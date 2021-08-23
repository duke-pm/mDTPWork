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
import {StyleSheet, View, ScrollView, processColor} from 'react-native';
import {HorizontalBarChart} from 'react-native-charts-wrapper';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CEmpty from '~/components/CEmpty';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Services from '~/services';
import Configs from '~/config';
import {cStyles} from '~/utils/style';
import {moderateScale, verticalScale} from '~/utils/helper';

const descriptionChart = {text: 'Durations (days)'};
const animationChart = {
  durationX: 0,
  durationY: 1000,
  easingY: 'Linear',
};
const formatDateTime = 'YYYY-MM-DDT00:00:00';

function ProjectPlan(props) {
  const {isDark = false, customColors = {}, project = null} = props;

  /** Use states */
  const [loading, setLoading] = useState({
    main: true,
    data: false,
  });
  const [page, setPage] = useState(1);
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
      },
      right: {enabled: false},
    },
  });

  /**********
   ** FUNC **
   **********/
  const onDone = () => setLoading({...loading, main: false});

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
        let newPage = page + 1;
        setPage(newPage);
        return onFetchData(newPage);
      } else {
        onDone();
      }
    } else {
      onDone();
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
            config: {valueFormatter: '#', color: customColors.green2},
          },
        ],
        durations = 0;
      for (item of tasks) {
        if (item.parentID === 0) {
          durations = moment(item.endDate, formatDateTime).diff(
            moment(item.startDate, formatDateTime),
            'days',
          );
          dataChart[0].values.push({y: durations + 1});
          xValueFormatter.push('#' + item.taskID);
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
      setLoading({...loading, data: false});
    } else {
      setLoading({...loading, data: false});
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onFetchData(), []);

  useEffect(() => {
    if (!loading.main && !loading.data) {
      setLoading({...loading, data: true});
      onPrepareData();
    }
  }, [loading.main, loading.data]);

  useEffect(() => {
    if (loading.data) {
      if (chart.data.length > 0) {
        setLoading({...loading, data: false});
      }
    }
  }, [loading.main, loading.data, chart.data]);

  /************
   ** RENDER **
   ************/
  if (!loading.data && chart.data.length === 0) {
    return (
      <View style={[cStyles.center, styles.empty]}>
        <CEmpty
          label={'common:empty_data'}
          description={'common:cannot_find_data_filter'}
        />
      </View>
    );
  }
  return (
    <ScrollView style={styles.scroll}>
      <View
        style={[
          cStyles.borderTop,
          isDark && cStyles.borderTopDark,
          cStyles.fullWidth,
          cStyles.pb16,
        ]}
      />

      {(loading.data || loading.main) && <CActivityIndicator />}

      {!loading.data && chart.data.length > 0 && (
        <HorizontalBarChart
          style={styles.chart}
          legend={chart.legend}
          marker={chart.marker}
          data={{dataSets: chart.data}}
          xAxis={chart.xAxis}
          yAxis={chart.yAxis}
          animation={animationChart}
          chartDescription={descriptionChart}
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
          drawValueAboveBar={true}
        />
      )}

      {!loading.data && chart.data.length > 0 && (
        <View style={[cStyles.flex1, cStyles.mt10]}>
          <CText styles={'textCaption2 fontBold'} label={'common:note_chart'} />
          {chart.dataTask.map(item => {
            return (
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt4]}>
                <View
                  style={[
                    cStyles.center,
                    cStyles.p4,
                    cStyles.rounded1,
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
                <CText styles={'textCaption2 pl6'} customLabel={item.name} />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: {height: verticalScale(150)},
  scroll: {maxHeight: verticalScale(340)},
  chart: {height: verticalScale(230), width: moderateScale(300)},
});

ProjectPlan.propTypes = {
  isDark: PropTypes.bool,
  customColors: PropTypes.object,
  project: PropTypes.object,
};

export default ProjectPlan;
