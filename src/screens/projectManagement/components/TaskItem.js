/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
import CUser from '~/components/CUser';
import CStatusTag from '~/components/CStatusTag';
import ListTask from '../list/Task';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const CustomLayoutAnimated = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

function TaskItem(props) {
  const {data, translation, isDark, customColors, onPress, onRefresh} = props;

  /** Use ref */
  const valueAnim = useRef(new Animated.Value(0)).current;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleTaskItem = () => {
    if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      data.isUpdated = false;
    }
    onPress(data);
  };

  const handleShowChildren = () => {
    LayoutAnimation.configureNext(CustomLayoutAnimated);
    Animated.timing(valueAnim, {
      toValue: showChildren ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowChildren(!showChildren);
  };

  /************
   ** RENDER **
   ************/
  let showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value;
  let delay = 0;
  if (
    data &&
    showPercentage &&
    data.statusID !== Commons.STATUS_TASK.REJECTED.value &&
    data.statusID !== Commons.STATUS_TASK.CLOSED.value
  ) {
    if (data.endDate && data.endDate !== '') {
      delay = moment().diff(data.endDate, 'days');
    }
  }
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  return (
    <View style={[cStyles.row, cStyles.itemsStart]}>
      {/** Arrow childrens */}
      {data.parentID > 0 && (
        <View style={styles.con_arrow}>
          <View
            style={[
              styles.top_arrow,
              {borderRightColor: customColors.cardHolder},
            ]}
          />
          <View
            style={[
              styles.bottom_arrow,
              {borderTopColor: customColors.cardHolder},
            ]}
          />
        </View>
      )}

      {/** Project card */}
      <View style={cStyles.flex1}>
        <CTouchable disabled={props.loading} onPress={handleTaskItem}>
          <View
            style={[
              cStyles.flex1,
              cStyles.p10,
              cStyles.rounded1,
              cStyles.shadowListItem,
              styles.con_task,
              {
                backgroundColor: customColors.card,
                borderLeftColor: isDark ? data.typeColorDark : data.typeColor,
              },
            ]}>
            {/** Label */}
            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value &&
                    styles.con_label_left,
                ]}>
                <Text>
                  <Text
                    style={[
                      cStyles.textHeadline,
                      {color: isDark ? data.typeColorDark : data.typeColor},
                    ]}
                    customLabel={data.typeName}>
                    {data.typeName}
                  </Text>
                  <Text
                    style={
                      cStyles.textSubheadline
                    }>{`  ${data?.taskName}`}</Text>
                </Text>
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyEnd,
                  data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value &&
                    styles.con_label_right,
                ]}>
                {showPercentage ? (
                  <CTouchable
                    containerStyle={cStyles.rounded10}
                    onPress={handleShowChildren}>
                    <Progress.Circle
                      animated={false}
                      size={moderateScale(30)}
                      progress={data.percentage / 100}
                      thickness={moderateScale(1)}
                      color={customColors.primary}
                      showsText
                      textStyle={[
                        cStyles.textCenter,
                        cStyles.fontRegular,
                        {fontSize: moderateScale(8)},
                      ]}
                    />
                  </CTouchable>
                ) : data.countChild > 0 ? (
                  <CTouchable
                    containerStyle={[
                      cStyles.rounded10,
                      cStyles.center,
                      cStyles.mr5,
                      cStyles.mt5,
                      {width: moderateScale(30), height: moderateScale(30)},
                    ]}
                    onPress={handleShowChildren}>
                    <Animated.View
                      style={[
                        {
                          width: moderateScale(21),
                          height: moderateScale(21),
                          transform: [{rotate: rotateData}],
                        },
                      ]}>
                      <Icon
                        name={Icons.up}
                        size={moderateScale(21)}
                        color={customColors.icon}
                      />
                    </Animated.View>
                  </CTouchable>
                ) : null}
              </View>
            </View>

            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                cStyles.mt10,
              ]}>
              {data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value && (
                <CStatusTag
                  customLabel={data.statusName}
                  color={isDark ? data.colorDarkCode : data.colorCode}
                />
              )}
              <CUser style={styles.row_left} label={data.ownerName} />
            </View>

            {delay > 0 && (
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
                <Icon
                  name={Icons.time}
                  color={customColors.red}
                  size={moderateScale(10)}
                />
                <CText
                  customStyles={[
                    cStyles.textCaption1,
                    cStyles.ml3,
                    {color: customColors.red},
                  ]}
                  customLabel={`${translation(
                    'project_management:delay_date_1',
                  )} ${delay} ${translation(
                    'project_management:delay_date_2',
                  )}`}
                />
              </View>
            )}

            {data.countChild > 0 && (
              <View
                style={[
                  cStyles.center,
                  cStyles.rounded2,
                  cStyles.abs,
                  styles.badge,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  {backgroundColor: customColors.red},
                  showPercentage && {right: moderateScale(10)},
                ]}>
                <Text
                  style={[
                    cStyles.fontRegular,
                    {color: colors.WHITE, fontSize: moderateScale(8)},
                  ]}>
                  {data.countChild}
                </Text>
              </View>
            )}
          </View>
        </CTouchable>

        {showChildren && data.countChild > 0 && (
          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.itemsCenter,
              !showChildren && cStyles.abs,
              {opacity: showChildren ? 1 : 0},
            ]}>
            <View
              style={[
                cStyles.borderAll,
                isDark && cStyles.borderAllDark,
                styles.line_child,
              ]}
            />
            <ListTask data={data.lstTaskItem} onRefreshTasks={onRefresh} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line_child: {height: '100%', borderRadius: 1},
  con_task: {borderLeftWidth: moderateScale(6)},
  con_label_left: {flex: 0.85},
  con_label_right: {flex: 0.15},
  badge: {
    height: moderateScale(15),
    width: moderateScale(15),
    top: moderateScale(8),
    right: moderateScale(5),
  },
  con_arrow: {
    backgroundColor: colors.TRANSPARENT,
    overflow: 'visible',
    width: moderateScale(15),
    height: moderateScale(25),
  },
  top_arrow: {
    backgroundColor: colors.TRANSPARENT,
    width: 0,
    height: 0,
    borderTopWidth: moderateScale(9),
    borderTopColor: colors.TRANSPARENT,
    borderRightWidth: moderateScale(9),
    borderStyle: 'solid',
    transform: [{rotate: '10deg'}],
    position: 'absolute',
    bottom: moderateScale(9),
    right: moderateScale(8),
    left: 0,
    overflow: 'visible',
  },
  bottom_arrow: {
    backgroundColor: colors.TRANSPARENT,
    position: 'absolute',
    borderBottomColor: colors.TRANSPARENT,
    borderLeftColor: colors.TRANSPARENT,
    borderRightColor: colors.TRANSPARENT,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: moderateScale(3),
    borderStyle: 'solid',
    borderTopLeftRadius: moderateScale(12),
    top: moderateScale(5),
    left: -moderateScale(8),
    width: moderateScale(10),
    height: moderateScale(15),
    transform: [{rotate: '45deg'}],
  },
});

export default React.memo(TaskItem);
