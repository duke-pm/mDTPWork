/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Plan
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectPlan.js
 **/
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, processColor, Text} from 'react-native';
import {HorizontalBarChart} from 'react-native-charts-wrapper';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CEmpty from '~/components/CEmpty';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Configs from '~/config';
import Services from '~/services';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, verticalScale} from '~/utils/helper';

/** All init */
const animationChart = {
  durationX: 0,
  durationY: 1000,
  easingY: 'EaseInOutQuart',
};
const formatDateTime = 'YYYY-MM-DDT00:00:00';

function ProjectPlan(props) {
  const {
    isDark = false,
    customColors = {},
    project = null,
    translation = () => null,
  } = props;
  let page = 1;

  /** Use states */
  const [loading, setLoading] = useState({
    main: true,
    data: false,
  });
  const [tasks, setTasks] = useState([]);
  const [chart, setChart] = useState({
    dataTask: [],
    data: [],
    legend: {enabled: false},
    marker: {
      enabled: true,
      digits: 0,
      markerColor: processColor('orange'),
      textColor: processColor('white'),
      textSize: cStyles.textBody.fontSize,
    },
    xAxis: {
      valueFormatter: [],
      position: 'BOTTOM',
      axisLineWidth: 1,
      granularityEnabled: true,
      granularity: 1,
      drawLabels: true,
      gridLineWidth: 0,
      gridDashedLine: {
        lineLength: 1,
        spaceLength: 1,
      },
      labelCount: 0,
      textColor: isDark ? processColor('white') : processColor('black'),
    },
    yAxis: {
      left: {
        axisMinimum: 0,
        axisLineWidth: 1,
        granularityEnabled: true,
        granularity: 1,
        drawLabels: true,
        gridLineWidth: 1,
        gridDashedLine: {
          lineLength: 1,
          spaceLength: 1,
        },
        textColor: isDark ? processColor('white') : processColor('black'),
      },
      right: {enabled: false},
    },
  });

  /**********
   ** FUNC **
   **********/
  const onDone = (main, data) => setLoading({main, data});

  const onFetchData = async (newpage = 1) => {
    let paramsListTask = fromJS({
      PrjID: project.prjID,
      PageSize: Configs.perPageProjects,
      PageNum: newpage,
    });
    let res = await Services.projectManagement.listTask(paramsListTask);
    if (res && !res.isError) {
      let listTask = [...tasks];
      if (res.data.listTask.length > 0) {
        listTask = listTask.concat(res.data.listTask);
        setTasks(listTask);
      }
      if (res.totalPage > page) {
        // Load more data
        page = page + 1;
        return onFetchData(page);
      } else {
        onDone(false, true);
      }
    } else {
      onDone(false, false);
    }
  };

  const onPrepareData = () => {
    if (tasks.length > 0) {
      let item,
        xValueFormatter = [],
        dataTask = [],
        dataChart = [
          {
            values: [],
            config: {
              valueFormatter: '#',
              color: isDark
                ? processColor('darkblue')
                : processColor('lightblue'),
              highlightAlpha: 90,
              highlightColor: processColor('red'),
              valueTextColor: isDark
                ? processColor('white')
                : processColor('black'),
            },
          },
        ],
        durations = 0;
      for (item of tasks) {
        if (item.parentID === 0) {
          durations = moment(item.endDate, formatDateTime).diff(
            moment(item.startDate, formatDateTime),
            'days',
          );
          dataChart[0].values.unshift({
            y: durations + 1,
            marker: durations + 1 + ` ${translation('common:days')}`,
          });
          xValueFormatter.unshift('#' + item.taskID);
          dataTask.push({
            id: item.taskID,
            name: item.taskName,
            type: item.typeName,
            typeColor: item.typeColor,
            typeDarkColor: item.typeColorDark,
          });
        }
      }
      setChart({
        ...chart,
        xAxis: {
          ...chart.xAxis,
          valueFormatter: xValueFormatter,
          labelCount: xValueFormatter.length,
        },
        data: dataChart,
        dataTask,
      });
      onDone(false, false);
    } else {
      onDone(false, false);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onFetchData(), []);

  useEffect(() => {
    if (!loading.main && loading.data) {
      onPrepareData();
    }
  }, [loading.data, loading.main]);

  /************
   ** RENDER **
   ************/
  if (loading.main || loading.data) {
    return <CActivityIndicator />;
  }

  if (!loading.main && !loading.main && chart.data.length > 0) {
    return (
      <ScrollView style={styles.scroll}>
        <View
          style={[
            cStyles.pb16,
            cStyles.fullWidth,
            cStyles.borderTop,
            isDark && cStyles.borderTopDark,
          ]}
        />

        <HorizontalBarChart
          style={styles.chart}
          legend={chart.legend}
          marker={chart.marker}
          data={{dataSets: chart.data}}
          xAxis={chart.xAxis}
          yAxis={chart.yAxis}
          animation={animationChart}
          chartDescription={{
            textColor: isDark ? processColor('white') : processColor('black'),
            text: `Durations (${translation('common:days')})`,
          }}
          drawGridBackground={false}
          autoScaleMinMaxEnabled={true}
          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={true}
          scaleXEnabled={true}
          scaleYEnabled={true}
          doubleTapToZoomEnabled={false}
          highlightPerTapEnabled={true}
          highlightPerDragEnabled={true}
          dragDecelerationEnabled={true}
          keepPositionOnRotation={false}
          drawValueAboveBar={false}
        />

        <View style={[cStyles.flex1, cStyles.mt10]}>
          <CText styles={'textCaption2 fontBold'} label={'common:note_chart'} />
          {chart.dataTask.map(item => {
            return (
              <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt6]}>
                <View
                  style={[
                    cStyles.center,
                    cStyles.p4,
                    cStyles.rounded1,
                    styles.caption_left,
                    {
                      backgroundColor: isDark
                        ? item.typeDarkColor
                        : item.typeColor,
                    },
                  ]}>
                  <CText
                    styles={'textCaption2 fontBold colorWhite'}
                    customLabel={'#' + item.id}
                  />
                </View>
                <View style={[cStyles.mt5, styles.caption_right]}>
                  <Text style={cStyles.ml10}>
                    <Text
                      style={[
                        cStyles.textCaption2,
                        cStyles.fontBold,
                        {color: isDark ? item.typeDarkColor : item.typeColor},
                      ]}>
                      {item.type}
                    </Text>
                    <Text
                      style={[
                        cStyles.textCaption2,
                        {color: customColors.text},
                      ]}>
                      {'  ' + item.name}
                    </Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
  if (!loading.main && !loading.main && chart.data.length === 0) {
    return (
      <View style={[cStyles.center, styles.empty]}>
        <CEmpty
          label={'common:empty_data'}
          description={'common:cannot_find_data_filter'}
        />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  empty: {height: verticalScale(150)},
  scroll: {maxHeight: verticalScale(340)},
  chart: {height: verticalScale(230), width: moderateScale(300)},
  caption_left: {flex: 0.1},
  caption_right: {flex: 0.9},
});

ProjectPlan.propTypes = {
  isDark: PropTypes.bool,
  translation: PropTypes.func,
  customColors: PropTypes.object,
  project: PropTypes.object,
};

export default ProjectPlan;
