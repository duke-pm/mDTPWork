/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: BodyPreview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BodyPreview.js
 **/
import {any} from 'prop-types';
import React, {useRef, useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Icons from '~/config/Icons';
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

let listener = null;

function BodyPreview(props) {
  const isDark = useTheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {dataHeader, dataBody} = props;

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
  const onParseData = (key, data) => {
    let item,
      result = [],
      resultChild = [];
    for (item of data) {
      if (item[key] === null || item[key] === undefined) {
        result.push(key);
      } else {
        result.push(item[key]);
      }
      if (item.lstProjChild.length > 0) {
        resultChild = onParseData(key, item.lstProjChild);
      } else if (item.lstTask.length > 0) {
        resultChild = onParseData(key, item.lstTask);
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
      result = onParseData(item.key, dataBody);
      dataRD.push(result);
      result = [];
    }
    setDataRender(dataRD);
    setLoading(false);
  };

  const formatIdentityColumn = (data, isIcon) => {
    let cells = [],
      cellsChild = [],
      item;

    for (item of data) {
      if (!isIcon) {
        cells.push(
          formatCell(
            customColors.card,
            'itemsStart',
            undefined,
            item.name,
            item.isChild,
            item.isProject,
            item.taskType,
          ),
        );
      } else {
        cells.push(
          formatCellIcon(
            customColors.card,
            item.id,
            item.isProject,
            item.taskType,
          ),
        );
      }
      if (item.lstProjChild.length > 0) {
        cellsChild = formatIdentityColumn(item.lstProjChild, isIcon);
      } else if (item.lstTask.length > 0) {
        cellsChild = formatIdentityColumn(item.lstTask, isIcon);
      }
      cells = cells.concat(cellsChild);
      cellsChild = [];
    }
    return cells;
  };

  const onCheckTaskType = taskType => {
    if (taskType === 'PHASE') {
      return 'orange';
    } else if (taskType === 'MILESTONE') {
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
      props.headerScroll.scrollTo &&
        props.headerScroll.scrollTo({x: position.value, animated: false});
    });
  }, [scrollX, props.headerScroll]);

  /************
   ** RENDER **
   ************/
  if (loading) {
    return null;
  }

  const formatCell = (
    bgColor = '',
    align = 'center',
    width = undefined,
    value = any,
    isChild = false,
    isProject = false,
    taskType = undefined,
  ) => {
    return (
      <View
        key={value}
        style={[
          cStyles.center,
          cStyles[align],
          cStyles.px6,
          cStyles.borderLeft,
          cStyles.borderBottom,
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          styles.cell,
          {width, backgroundColor: bgColor},
          isChild && cStyles.row,
          isChild && cStyles.itemsCenter,
          isChild && cStyles.justifyStart,
        ]}>
        {isChild && isProject && !taskType && (
          <Icon
            name={Icons.showChild}
            size={moderateScale(14)}
            color={customColors.icon}
          />
        )}
        <View>
          {isChild && !isProject && taskType && (
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pl16]}>
              <Icon
                name={Icons.showChild}
                size={moderateScale(14)}
                color={customColors.icon}
              />
              <CText
                customStyles={[
                  cStyles.pl4,
                  cStyles.textCaption1,
                  cStyles.fontBold,
                  {color: customColors[onCheckTaskType(taskType)]},
                ]}
                numberOfLines={2}
                customLabel={`${taskType}`}
              />
            </View>
          )}
          <CText
            customStyles={[
              cStyles.textCaption1,
              isProject && cStyles.fontBold,
              isChild && cStyles.pl4,
              isChild && !isProject && taskType && cStyles.pl16,
            ]}
            numberOfLines={1}
            customLabel={value}
          />
        </View>
      </View>
    );
  };

  const formatCellIcon = (
    bgColor = '',
    value = '',
    isProject = false,
    taskType = null,
  ) => {
    return (
      <View
        style={[
          cStyles.justifyCenter,
          cStyles.itemsStart,
          cStyles.px6,
          cStyles.borderLeft,
          cStyles.borderBottom,
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          styles.cell_small,
          {backgroundColor: bgColor},
        ]}>
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
              {color: customColors[onCheckTaskType(taskType)]},
            ]}
            customLabel={taskType + ' #' + value}
          />
        )}
      </View>
    );
  };

  const formatColumn = section => {
    let {item} = section,
      cells = [],
      i;
    for (i = 0; i < dataRender[0].length; i++) {
      cells.push([
        formatCell(
          i % 2 ? colors.STATUS_NEW_OPACITY : colors.STATUS_ON_HOLD_OPACITY,
          'center',
          CELL_WIDTH,
          item[i],
        ),
      ]);
    }
    return <View style={cStyles.col}>{cells}</View>;
  };

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
            {transform: [{translateX: headerTranslate}]},
          ]}>
          {formatIdentityColumn(dataBody, false)}
        </Animated.View>

        <Animated.FlatList
          style={cStyles.flex1}
          contentContainerStyle={styles.body}
          data={dataRender}
          renderItem={formatColumn}
          keyExtractor={(item, index) => index.toString()}
          extraData={dataBody}
          horizontal
          removeClippedSubviews={IS_ANDROID}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={scrollEvent}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            cStyles.ofHidden,
            cStyles.abs,
            styles.identity_small,
            {transform: [{translateX: headerTranslate2}]},
          ]}>
          {formatIdentityColumn(dataBody, true)}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  identity_large: {width: FIRST_CELL_WIDTH_LARGE},
  identity_small: {width: FIRST_CELL_WIDTH_SMALL},
  body: {paddingLeft: FIRST_CELL_WIDTH_LARGE},
  cell: {
    height: CELL_HEIGHT,
    width: FIRST_CELL_WIDTH_LARGE,
  },
  cell_small: {
    height: CELL_HEIGHT,
    width: FIRST_CELL_WIDTH_SMALL,
  },
});

export default BodyPreview;
