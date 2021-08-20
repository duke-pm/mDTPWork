/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Plan
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectPlan.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
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
import {THEME_DARK} from '~/config/constants';
import {moderateScale, verticalScale} from '~/utils/helper';

const descriptionChart = {text: 'Durations (days)'};
const animationChart = {
  durationX: 0,
  durationY: 1000,
  easingY: 'Linear',
};

function ProjectPlan(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {project = null} = props;

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
      textSize: moderateScale(16),
      config: {
        drawValues: true,
        drawCircles: true,
        lineWidth: 1,
        mode: 'CUBIC_BEZIER',
        drawCubicIntensity: 0.2,
        circleRadius: moderateScale(4),
        color: processColor('gray'),
        drawFilled: true,
        fillColor: processColor('gray'),
        fillAlpha: 45,
        circleColor: processColor('gray'),
        circleHoleColor: processColor('gray'),
      },
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
  const onDone = isError => setLoading({...loading, main: false});

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
        onDone(false);
      }
    } else {
      onDone(true);
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
          durations = moment(item.endDate, 'YYYY-MM-DDT00:00:00').diff(
            moment(item.startDate, 'YYYY-MM-DDT00:00:00'),
            'days',
          );
          dataChart[0].values.push({y: durations});
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
    if (!loading.main && !loading.data && chart.data.length === 0) {
      setLoading({...loading, data: true});
      onPrepareData();
    }
  }, [loading.data, loading.main, chart.data]);

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
          dragDecelerationFrictionCoef={0.99}
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

export default ProjectPlan;
