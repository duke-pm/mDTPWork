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
import CAvatar from '~/components/CAvatar';
import CTouchable from '~/components/CTouchable';
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
    if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      data.isUpdated = false;
    }
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

  /************
   ** RENDER **
   ************/
  let showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value;
  let delay = 0;
  let typeColor = customColors[Commons.TYPE_TASK.PHASE.color], // default is PHASE
    bgStatus = customColors[Commons.STATUS_TASK.NEW.color]; // default is New
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
      bgStatus = customColors[Commons.STATUS_TASK.CLOSED.color];
    } else if (data.statusID === Commons.STATUS_TASK.ON_HOLD.value) {
      bgStatus = customColors[Commons.STATUS_TASK.ON_HOLD.color];
    } else if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      bgStatus = customColors[Commons.STATUS_TASK.REJECTED.color];
    }
  } else {
    bgStatus = data.statusColor;
  }
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
    <View>
      <CTouchable
        containerStyle={cStyles.rounded2}
        disabled={props.loading}
        onPress={handleTaskItem}>
        <View
          style={[
            cStyles.p10,
            cStyles.rounded2,
            index === 0 && cStyles.mt12,
            {
              backgroundColor: customColors.listItem,
              borderLeftColor: typeColor,
              borderLeftWidth: moderateScale(3),
            },
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
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <View>
                  <CText
                    customStyles={[
                      cStyles.H6,
                      {color: typeColor},
                      delay > 0 && cStyles.pb3,
                    ]}
                    customLabel={data.typeName}
                  />
                  {delay > 0 && (
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
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
                    </View>
                  )}
                </View>

                <View style={cStyles.pl16}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <CAvatar size={'vsmall'} label={data.ownerName} />
                    <CText
                      styles={'textMeta pl6'}
                      customLabel={data.ownerName}
                    />
                  </View>

                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
                    <CText
                      styles={'textMeta fontBold colorWhite'}
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
                  containerStyle={cStyles.rounded10}
                  onPress={handleShowChildren}>
                  <Animated.View
                    style={[
                      cStyles.mr10,
                      {
                        width: moderateScale(23),
                        height: moderateScale(23),
                        transform: [{rotate: rotateData}],
                      },
                    ]}>
                    <Icon
                      name={Icons.down}
                      size={moderateScale(23)}
                      color={customColors.icon}
                    />
                  </Animated.View>
                </CTouchable>
              ) : null}
            </View>

            <View style={cStyles.mt10}>
              <CText
                styles={'textSubTitle'}
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
      </CTouchable>

      {showChildren && data.countChild > 0 && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={[
              cStyles.borderAll,
              cStyles.borderDashed,
              isDark && cStyles.borderAllDark,
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
  line_child: {height: '100%', borderRadius: 1},
  badge: {
    height: moderateScale(15),
    width: moderateScale(15),
    top: moderateScale(8),
    right: moderateScale(5),
  },
});

export default TaskItem;
