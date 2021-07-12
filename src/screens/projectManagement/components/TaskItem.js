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
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  TouchableNativeFeedback,
} from 'react-native';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import ListTask from '../list/Task';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import Icons from '~/config/Icons';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function TaskItem(props) {
  const {
    index,
    data,
    translation,
    isDark,
    customColors,
    onPress,
    onRefresh,
  } = props;

  /** Use ref */
  const valueAnim = useRef(new Animated.Value(0)).current;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleTaskItem = () => {
    onPress(data);
  };

  const handleShowChildren = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(valueAnim, {
      toValue: showChildren ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowChildren(!showChildren);
  };

  /**************
   ** RENDER **
   **************/
  let typeColor = customColors[Commons.TYPE_TASK.PHASE.color], // default is PHASE
    bgStatus = customColors[Commons.STATUS_TASK.NEW.color], // default is New
    isReject = false,
    isClose = false;
  if (data.typeColor === '') {
    if (data.taskTypeID === Commons.TYPE_TASK.TASK.value) {
      typeColor = customColors.typeTask;
    } else if (data.taskTypeID === Commons.TYPE_TASK.MILESTONE.value) {
      typeColor = customColors.typeMilestone;
    }
  } else {
    typeColor = data.typeColor;
  }

  if (!data.statusColor || data.statusColor === '') {
    if (data.statusID === Commons.STATUS_TASK.TO_BE_SCHEDULE.value) {
      bgStatus = customColors[Commons.STATUS_TASK.TO_BE_SCHEDULE.color];
    } else if (data.statusID === Commons.STATUS_TASK.SCHEDULE.value) {
      bgStatus = customColors[Commons.STATUS_TASK.SCHEDULE.color];
    } else if (data.statusID === Commons.STATUS_TASK.IN_PROGRESS.value) {
      bgStatus = customColors[Commons.STATUS_TASK.IN_PROGRESS.color];
    } else if (data.statusID === Commons.STATUS_TASK.CLOSED.value) {
      isClose = true;
      bgStatus = customColors[Commons.STATUS_TASK.CLOSED.color];
    } else if (data.statusID === Commons.STATUS_TASK.ON_HOLD.value) {
      bgStatus = customColors[Commons.STATUS_TASK.ON_HOLD.color];
    } else if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      isReject = true;
      bgStatus = customColors[Commons.STATUS_TASK.REJECTED.color];
    }
  } else {
    if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      isReject = true;
    }
    if (data.statusID === Commons.STATUS_TASK.CLOSED.value) {
      isClose = true;
    }
    bgStatus = data.statusColor;
  }
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value;
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
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <View style={[cStyles.flex1, cStyles.rounded2, cStyles.ofHidden]}>
      <Touchable
        style={cStyles.rounded2}
        disabled={props.loading}
        onPress={handleTaskItem}>
        <View
          style={[
            cStyles.p10,
            cStyles.mb20,
            cStyles.rounded2,
            index === 0 && cStyles.mt12,
            {
              backgroundColor: customColors.listItem,
              borderLeftColor: typeColor,
              borderLeftWidth: moderateScale(3),
            },
            isReject && {backgroundColor: customColors.cardDisable},
            isClose && {backgroundColor: customColors.cardDisable},
          ]}>
          {/** Label */}
          <View style={[cStyles.itemsStart, cStyles.fullWidth]}>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                cStyles.fullWidth,
              ]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <View>
                  <CText
                    customStyles={[
                      cStyles.H6,
                      cStyles.fontBold,
                      delay > 0 && cStyles.pb3,
                      {color: typeColor},
                      isReject && cStyles.textThrough,
                    ]}
                    customLabel={data.typeName}
                  />
                  {delay > 0 && (
                    <Animatable.View
                      style={[cStyles.row, cStyles.itemsCenter]}
                      animation={'rubberBand'}
                      easing={'ease-out'}>
                      <Icon
                        name={Icons.time}
                        color={customColors.red}
                        size={moderateScale(14)}
                      />
                      <CText
                        customStyles={[
                          cStyles.textMeta,
                          cStyles.ml3,
                          {color: customColors.red},
                        ]}
                        customLabel={`${translation(
                          'project_management:delay_date_1',
                        )} ${delay} ${translation(
                          'project_management:delay_date_2',
                        )}`}
                      />
                    </Animatable.View>
                  )}
                </View>

                <View style={cStyles.pl16}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <CAvatar size={'vsmall'} label={data.ownerName} />
                    <CText
                      styles={
                        'textMeta fontMedium pl6 ' +
                        (isReject && ' textThrough')
                      }
                      customLabel={data.ownerName}
                    />
                  </View>

                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.mt6,
                      cStyles.pl5,
                    ]}>
                    <View
                      style={[styles.status, {backgroundColor: bgStatus}]}
                    />
                    <CText
                      styles={'textMeta fontBold pl6 colorWhite'}
                      customStyles={[
                        cStyles.textMeta,
                        cStyles.fontBold,
                        {color: bgStatus},
                      ]}
                      customLabel={data.statusName}
                    />
                  </View>
                </View>
              </View>

              {showPercentage ? (
                <View style={[cStyles.ofHidden, cStyles.rounded10]}>
                  <Touchable onPress={handleShowChildren}>
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
                  </Touchable>
                </View>
              ) : data.countChild > 0 ? (
                <View style={[cStyles.ofHidden, cStyles.rounded10]}>
                  <Touchable onPress={handleShowChildren}>
                    <Animated.View
                      style={{
                        width: moderateScale(28),
                        height: moderateScale(28),
                        transform: [{rotate: rotateData}],
                      }}>
                      <Icon
                        name={Icons.down}
                        size={moderateScale(28)}
                        color={customColors.icon}
                      />
                    </Animated.View>
                  </Touchable>
                </View>
              ) : null}
            </View>

            <View style={[cStyles.flex1, cStyles.mt10]}>
              <CText
                styles={
                  'textSubTitle ' +
                  (isReject && 'textThrough ') +
                  (data.countChild === 0 && ' pt10')
                }
                customLabel={`#${data?.taskID} ${data?.taskName}`}
              />
            </View>
          </View>

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
      </Touchable>

      {showChildren && data.countChild > 0 && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={[
              cStyles.borderAll,
              isDark && cStyles.borderAllDark,
              cStyles.borderDashed,
              styles.line_child,
            ]}
          />
          <View style={[cStyles.flex1, cStyles.ml12]}>
            <ListTask data={data.lstTaskItem} onRefreshTasks={onRefresh} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  line_child: {height: '100%', borderRadius: 1},
  badge: {
    height: moderateScale(15),
    width: moderateScale(15),
    top: moderateScale(8),
    right: moderateScale(5),
  },
});

export default TaskItem;
