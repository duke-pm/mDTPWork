/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Plan
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectPlan.js
 **/
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import React, {useState, useEffect, useContext} from 'react';
import {Button, Divider, Spinner, Text} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView, processColor} from 'react-native';
import {HorizontalBarChart} from 'react-native-charts-wrapper';
import moment from 'moment';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
/* COMMON */
import Configs from '~/configs';
import Services from '~/services';
import {cStyles} from '~/utils/style';
import {moderateScale, verticalScale} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
import {DARK, DEFAULT_FORMAT_DATE_4} from '~/configs/constants';
import Commons from '~/utils/common/Commons';

/** All init */
const ANIM_CHART = {
  durationX: 0,
  durationY: 1000,
  easingY: 'EaseInOutQuart',
};

function ProjectPlan(props) {
  const themeContext = useContext(ThemeContext);
  const {
    project = null,
    trans = () => null,
  } = props;
  let page = 1;
  const isDark = themeContext.themeApp === DARK;

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
      textColor: isDark
        ? processColor('white')
        : processColor('black'),
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
        textColor: isDark
          ? processColor('white')
          : processColor('black'),
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
              color: processColor('royalblue'),
              highlightAlpha: 90,
              highlightColor: processColor('red'),
              valueTextColor: processColor('white'),
            },
          },
        ],
        durations = 0;
      for (item of tasks) {
        if (item.parentID === 0) {
          durations = moment(item.endDate, DEFAULT_FORMAT_DATE_4).diff(
            moment(item.startDate, DEFAULT_FORMAT_DATE_4),
            'days',
          );
          dataChart[0].values.unshift({
            y: durations + 1,
            marker: durations + 1 + ` ${trans('common:days')}`,
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
    return (
      <View style={cStyles.flexCenter}>
        <Spinner style={cStyles.py24} />
      </View>
    );
  }

  if (!loading.main && !loading.main && chart.data.length > 0) {
    return (
      <ScrollView style={styles.scroll}>
        <Divider style={cStyles.flex1} />
        <HorizontalBarChart
          style={[cStyles.mt16, styles.chart]}
          legend={chart.legend}
          marker={chart.marker}
          data={{dataSets: chart.data}}
          xAxis={chart.xAxis}
          yAxis={chart.yAxis}
          animation={ANIM_CHART}
          chartDescription={{
            textColor: isDark
              ? processColor('white')
              : processColor('black'),
            text: `Durations (${trans('common:days')})`,
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
          <Text category="label">{trans('common:note_chart')}</Text>
          {chart.dataTask.map((itemT, indexT) => {
            return (
              <View
                key={itemT.id + '_' + indexT}
                style={[cStyles.row, cStyles.itemsStart, cStyles.mt6]}>
                <Button
                  // appearance="outline"
                  size="tiny"
                  status={Commons.TYPE_TASK[itemT.type]['color']}>
                  {'#' + itemT.id}
                </Button>
                <View style={[cStyles.mt6, styles.caption_right]}>
                  <Text style={cStyles.ml10}>
                    <Text
                      style={cStyles.fontBold}
                      category="c1"
                      status={Commons.TYPE_TASK[itemT.type]['color']}>
                      {itemT.type}
                    </Text>
                    <Text category="c1">{'  ' + itemT.name}</Text>
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
});

ProjectPlan.propTypes = {
  theme: PropTypes.object,
  trans: PropTypes.func,
  project: PropTypes.object,
};

export default ProjectPlan;
