/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: BodyPreview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BodyPreview.js
 **/
import PropTypes, {any} from 'prop-types';
import React, {useRef, useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Text, Animated} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
/* COMMON */
import {Commons, Icons} from '~/utils/common';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {
  THEME_DARK,
  FIRST_CELL_WIDTH_LARGE,
  FIRST_CELL_WIDTH_SMALL,
  FIRST_CELL_WIDTH_DISTANCE,
  CELL_HEIGHT,
  CELL_WIDTH,
} from '~/config/constants';

/** All init */
let listener = null;
let child = 0;
const PLEFT_COMMON = moderateScale(4);

const FormatCell = React.memo(
  ({isDark = false, bgColor = undefined, align = 'center', value = any}) => {
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
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          bgColor && {backgroundColor: bgColor},
        ]}>
        {typeof value === 'string' ? (
          <CText
            customStyles={[cStyles.textCaption1, cStyles.fontRegular]}
            customLabel={value}
            numberOfLines={1}
          />
        ) : (
          value
        )}
      </View>
    );
  },
);

const FormatCompactCell = React.memo(
  ({
    isDark = false,
    customColors = {},
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
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          isDark && cStyles.borderRightDark,
        ]}>
        <View style={cStyles.itemsStart}>
          {isProject && !taskType && (
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.fontBold,
                cStyles.textCenter,
              ]}
              customLabel={'Project #' + value}
            />
          )}
          {!isProject && taskType && (
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.fontBold,
                {
                  color:
                    taskTypeColor || customColors[onCheckTaskType(taskType)],
                },
              ]}
              customLabel={taskTypeName + ' #' + value}
            />
          )}
          <CText
            customStyles={[cStyles.textCaption1, cStyles.fontRegular]}
            numberOfLines={1}
            customLabel={name}
          />
        </View>
      </View>
    );
  },
);

const FormatFirstCell = React.memo(
  ({
    isDark = false,
    customColors = {},
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
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          pChild > 2 ? {paddingLeft: PLEFT_COMMON * pChild} : {},
        ]}>
        {pChild > 1 && (
          <View
            style={[!isProject ? {paddingLeft: PLEFT_COMMON * pChild} : {}]}>
            <CIcon name={Icons.showChild} size={'smaller'} />
          </View>
        )}
        <Text
          style={[pChild > 1 && cStyles.pl4, cStyles.flex1]}
          numberOfLines={2}>
          {!isProject && (
            <Text
              style={[
                cStyles.textCaption1,
                cStyles.fontBold,
                {
                  color:
                    taskTypeColor || customColors[onCheckTaskType(taskType)],
                },
              ]}
              numberOfLines={1}>
              {`${taskTypeName}  `}
            </Text>
          )}
          <Text
            style={[
              cStyles.textCaption1,
              cStyles.fontRegular,
              isProject && cStyles.fontBold,
              {color: customColors.text},
            ]}>
            {value}
          </Text>
        </Text>
      </View>
    );
  },
);

const FormatColumn = React.memo(
  ({isDark = false, customColors = {}, section = {}, dataRender = []}) => {
    let {item} = section,
      cells = [],
      i;
    for (i = 0; i < dataRender[0].length; i++) {
      cells.push([
        <FormatCell
          isDark={isDark}
          bgColor={i % 2 ? customColors.card : colors.STATUS_NEW_OPACITY}
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
    isDark = false,
    customColors = {},
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
            isDark={isDark}
            isProject={data[i].isProject}
            customColors={customColors}
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
            isDark={isDark}
            customColors={customColors}
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
            isIcon={isIcon}
            isDark={isDark}
            customColors={customColors}
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

function BodyPreview(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {formatDateView, dataHeader, dataBody, headerScroll} = props;

  /** All ref of page */
  let scrollX = useRef(new Animated.Value(0)).current;
  let scrollEvent = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false},
  );

  /** All state of page */
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
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.fontBold,
                {color: isDark ? item.colorDarkCode : item.colorCode},
              ]}
              customLabel={item[key]}
            />,
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
      return 'orange';
    } else if (taskType === Commons.TYPE_TASK.MILESTONE.value) {
      return 'green';
    } else {
      return 'blue';
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
              backgroundColor: customColors.card,
              transform: [{translateX: headerTranslate}],
            },
          ]}>
          <FormatIdentityColumn
            isIcon={false}
            isDark={isDark}
            customColors={customColors}
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
              isDark={isDark}
              customColors={customColors}
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
              backgroundColor: customColors.card,
              transform: [{translateX: headerTranslate2}],
            },
          ]}>
          <FormatIdentityColumn
            isIcon={true}
            isDark={isDark}
            customColors={customColors}
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

BodyPreview.propTypes = {
  formatDateView: PropTypes.string,
  dataHeader: PropTypes.array,
  dataBody: PropTypes.array,
  headerScroll: PropTypes.any,
};

export default React.memo(BodyPreview);
