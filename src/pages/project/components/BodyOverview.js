/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: BodyOverview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BodyOverview.js
 **/
import PropTypes, {any} from 'prop-types';
import React, {useRef, useState, useEffect, useContext} from 'react';
import {useTheme, Text} from '@ui-kitten/components';
import {StyleSheet, View, Animated} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMMON */
import {Commons} from '~/utils/common';
import {ThemeContext} from '~/configs/theme-context';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import {
  FIRST_CELL_WIDTH_LARGE,
  FIRST_CELL_WIDTH_SMALL,
  FIRST_CELL_WIDTH_DISTANCE,
  CELL_HEIGHT,
  CELL_WIDTH,
  DARK,
} from '~/configs/constants';
import { useTranslation } from 'react-i18next';

/** All init */
let listener = null;
let child = 0;
const PLEFT_COMMON = moderateScale(4);
const sIcon = moderateScale(12);

const FormatCell = React.memo(
  ({theme = {}, bgColor = undefined, align = 'center', value = any}) => {
    return (
      <View
        key={value + ''}
        style={[
          cStyles.center,
          cStyles[align],
          cStyles.borderLeft,
          cStyles.borderBottom,
          styles.con_cell,
          styles.cell,
          {
            borderLeftColor: theme['border-basic-color-5'],
            borderBottomColor: theme['border-basic-color-5'],
          },
          bgColor && {backgroundColor: bgColor},
        ]}>
        {typeof value === 'string' ? (
          <Text>{value}</Text>
        ) : (
          value
        )}
      </View>
    );
  },
);

const FormatCompactCell = React.memo(
  ({
    trans = {},
    theme = {},
    value = '',
    name = '',
    isProject = false,
    taskType = undefined,
    taskTypeName = undefined,
    taskTypeColor = undefined,
    onCheckTaskType = () => null,
  }) => {
    return (
      <View
        style={[
          cStyles.justifyCenter,
          cStyles.itemsStart,
          cStyles.px6,
          cStyles.borderLeft,
          cStyles.borderBottom,
          cStyles.borderRight,
          styles.cell_small,
          {
            borderLeftColor: theme['border-basic-color-5'],
            borderBottomColor: theme['border-basic-color-5'],
            borderRightColor: theme['border-basic-color-5'],
          },
        ]}>
        <View style={cStyles.itemsStart}>
          {isProject && !taskType && (
            <Text style={cStyles.textCenter} category="label">
              {`${trans('project_management:main_title')} #`.toUpperCase() + value}
            </Text>
          )}
          {!isProject && taskType && (
            <Text
              style={taskTypeColor ? {color: taskTypeColor} : undefined}
              status={taskType ? onCheckTaskType(taskType) : undefined}
              category="label">
              {taskTypeName + ' #' + value}
            </Text>
          )}
          <Text numberOfLines={1} category="c1" appearance="hint">{name}</Text>
        </View>
      </View>
    );
  },
);

const FormatFirstCell = React.memo(
  ({
    theme = {},
    value = any,
    pChild = 0,
    isProject = false,
    taskType = undefined,
    taskTypeName = undefined,
    taskTypeColor = undefined,
    onCheckTaskType = () => null,
  }) => {
    return (
      <View
        key={value + ''}
        style={[
          cStyles.px4,
          cStyles.flex1,
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.borderLeft,
          cStyles.borderBottom,
          styles.cell,
          {
            borderBottomColor: theme['border-basic-color-5'],
            borderLeftColor: theme['border-basic-color-5'],
          },
          pChild > 2 ? {paddingLeft: PLEFT_COMMON * pChild} : {},
        ]}>
        {pChild > 1 && (
          <View
            style={[!isProject ? {paddingLeft: PLEFT_COMMON * pChild} : {}]}>
            <IoniIcon
              name={'caret-forward'}
              size={sIcon}
              color={theme['text-hint-color']}
            />
          </View>
        )}
        <Text
          style={[pChild > 1 && cStyles.pl5, cStyles.flex1]}
          category="p2"
          numberOfLines={2}>
          {!isProject && (
            <Text
              style={{color: taskTypeColor}}
              status={taskType ? onCheckTaskType(taskType) : undefined}
              category="label">
              {`${taskTypeName}  `}
            </Text>
          )}
          <Text category="p2">{value}</Text>
        </Text>
      </View>
    );
  },
);

const FormatColumn = React.memo(
  ({theme = {}, section = {}, dataRender = []}) => {
    let {item} = section,
      cells = [],
      i;
    for (i = 0; i < dataRender[0].length; i++) {
      cells.push([
        <FormatCell
          theme={theme}
          bgColor={i % 2
            ? theme['background-basic-color-3']
            : theme['background-basic-color-1']}
          align={'center'}
          value={item[i]}
        />,
      ]);
    }
    return <View style={cStyles.col}>{cells}</View>;
  },
);

const FormatIdentityColumn = React.memo(
  ({
    trans = {},
    theme = {},
    isDark = false,
    data = {},
    isIcon = false,
    pChild = 0,
    onCheckTaskType = () => null,
  }) => {
    let cells = [],
      cellsChild = [],
      i;
    let tmpPChild = pChild + 1;
    for (i = 0; i < data.length; i++) {
      if (!isIcon) {
        cells.push(
          <FormatFirstCell
            theme={theme}
            isProject={data[i].isProject}
            value={data[i].itemName}
            pChild={tmpPChild}
            taskType={data[i].taskTypeID}
            taskTypeName={data[i].typeName}
            taskTypeColor={isDark ? data[i].typeColorDark : data[i].typeColor}
          />,
        );
      } else {
        cells.push(
          <FormatCompactCell
            trans={trans}
            theme={theme}
            isProject={data[i].isProject}
            value={data[i].itemID}
            name={data[i].itemName}
            taskType={data[i].taskTypeID}
            taskTypeName={data[i].typeName}
            taskTypeColor={isDark ? data[i].typeColorDark : data[i].typeColor}
            onCheckTaskType={onCheckTaskType}
          />,
        );
      }
      if (data[i].lstItemChild.length > 0) {
        cellsChild = (
          <FormatIdentityColumn
            trans={trans}
            isIcon={isIcon}
            theme={theme}
            data={data[i].lstItemChild}
            pChild={tmpPChild}
            onCheckTaskType={onCheckTaskType}
          />
        );
      }
      cells = cells.concat(cellsChild);
      cellsChild = [];
    }
    return cells;
  },
);

function BodyOverview(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {formatDateView, dataHeader, dataBody, headerScroll} = props;

  /** Use ref */
  let scrollX = useRef(new Animated.Value(0)).current;
  let scrollEvent = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [dataRender, setDataRender] = useState([]);

  /**********
   ** FUNC **
   **********/
  const onParseDataView = (key, data) => {
    let item,
      result = [],
      resultChild = [];
    for (item of data) {
      if (item[key] === null || item[key] === undefined || item[key] === 0) {
        result.push('-');
      } else if (key === 'startDate' || key === 'endDate') {
        result.push(moment(item[key]).format(formatDateView));
      } else if (key === 'statusName') {
        if (item.taskTypeID === Commons.TYPE_TASK.MILESTONE.value) {
          result.push('');
        } else {
          result.push(
            <Text style={[cStyles.fontBold,
              {color: themeContext.themeApp === DARK
              ? item.colorDarkCode
              : item.colorCode}]} category="p1">{item[key]}</Text>
          );
        }
      } else if (key === 'completedPercent') {
        result.push(item[key] + '%');
      } else if (key === 'duration') {
        result.push(item[key] + ' days');
      } else {
        result.push(item[key] + '');
      }
      if (item.lstItemChild.length > 0) {
        resultChild = onParseDataView(key, item.lstItemChild);
      }
      result = result.concat(resultChild);
      resultChild = [];
    }
    return result;
  };

  const onPrepareData = () => {
    let dataRD = [],
      result = [],
      item;
    for (item of dataHeader) {
      result = onParseDataView(item.key, dataBody);
      dataRD.push(result);
      result = [];
    }
    setDataRender(dataRD);
    setLoading(false);
  };

  const onCheckTaskType = taskType => {
    if (taskType === Commons.TYPE_TASK.PHASE.value) {
      return 'warning';
    } else if (taskType === Commons.TYPE_TASK.MILESTONE.value) {
      return 'success';
    } else {
      return 'primary';
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onPrepareData();
    return () => {
      listener && scrollX.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    listener = scrollX.addListener(position => {
      headerScroll.current.scrollTo &&
        headerScroll.current.scrollTo({x: position.value, animated: false});
    });
  }, [scrollX, headerScroll]);

  /************
   ** RENDER **
   ************/
  if (loading) {
    return null;
  }
  if (!loading) {
    const headerTranslate = scrollX.interpolate({
      inputRange: [0, FIRST_CELL_WIDTH_DISTANCE],
      outputRange: [0, -FIRST_CELL_WIDTH_DISTANCE],
      extrapolate: 'clamp',
    });
    const headerTranslate2 = scrollX.interpolate({
      inputRange: [0, FIRST_CELL_WIDTH_DISTANCE],
      outputRange: [-FIRST_CELL_WIDTH_DISTANCE, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={[cStyles.flex1, cStyles.row, cStyles.itemsStart]}>
        <Animated.View
          pointerEvents="none"
          style={[
            cStyles.abs,
            styles.identity_large,
            {
              backgroundColor: theme['background-basic-color-2'],
              transform: [{translateX: headerTranslate}],
            },
          ]}>
          <FormatIdentityColumn
            trans={t}
            theme={theme}
            isDark={themeContext.themeApp === DARK}
            isIcon={false}
            data={dataBody}
            pChild={child}
            onCheckTaskType={onCheckTaskType}
          />
        </Animated.View>

        <Animated.FlatList
          style={cStyles.flex1}
          contentContainerStyle={styles.body}
          data={dataRender}
          renderItem={section => (
            <FormatColumn
              theme={theme}
              section={section}
              dataRender={dataRender}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          removeClippedSubviews={IS_ANDROID}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollEvent}
        />
        <Animated.View
          pointerEvents={'none'}
          style={[
            cStyles.ofHidden,
            cStyles.abs,
            cStyles.shadowListItem,
            styles.identity_small,
            {
              backgroundColor: theme['background-basic-color-2'],
              transform: [{translateX: headerTranslate2}],
            },
          ]}>
          <FormatIdentityColumn
            trans={t}
            theme={theme}
            isDark={themeContext.themeApp === DARK}
            isIcon={true}
            data={dataBody}
            onCheckTaskType={onCheckTaskType}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  identity_large: {width: FIRST_CELL_WIDTH_LARGE},
  identity_small: {width: FIRST_CELL_WIDTH_SMALL},
  body: {paddingLeft: FIRST_CELL_WIDTH_LARGE},
  con_cell: {width: CELL_WIDTH},
  cell: {height: CELL_HEIGHT},
  cell_small: {height: CELL_HEIGHT},
});

BodyOverview.propTypes = {
  formatDateView: PropTypes.string,
  dataHeader: PropTypes.array,
  dataBody: PropTypes.array,
  headerScroll: PropTypes.any,
};

export default BodyOverview;
