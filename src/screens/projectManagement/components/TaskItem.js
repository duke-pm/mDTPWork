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
import {IS_ANDROID, IS_IOS, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import CAvatar from '~/components/CAvatar';
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
  let showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value,
    bgTaskType = colors.STATUS_NEW_OPACITY; // Default is TASK
  let delay = 0;
  if (data) {
    if (data.taskTypeID === Commons.TYPE_TASK.PHASE.value) {
      bgTaskType = colors.STATUS_ON_HOLD_OPACITY;
    } else if (data.taskTypeID === Commons.TYPE_TASK.MILESTONE.value) {
      bgTaskType = colors.STATUS_SCHEDULE_OPACITY;
    }
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
    <View
      style={[
        cStyles.row,
        cStyles.itemsStart,
        data.parentID > 0 && cStyles.ml12,
      ]}>
      {/** Arrow childrens */}
      {/* {data.parentID > 0 && (
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
      )} */}

      {/** Project card */}
      <View style={cStyles.flex1}>
        <CTouchable
          containerStyle={cStyles.rounded3}
          disabled={props.loading}
          onPress={handleTaskItem}>
          <View
            style={[
              cStyles.flex1,
              cStyles.p10,
              cStyles.rounded3,
              {backgroundColor: bgTaskType},
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
                <Text numberOfLines={2}>
                  <Text
                    style={[
                      cStyles.textBody,
                      cStyles.fontBold,
                      {color: isDark ? data.typeColorDark : data.typeColor},
                    ]}
                    customLabel={data.typeName}>
                    {data.typeName}
                  </Text>
                  <Text
                    style={[
                      cStyles.textBody,
                      cStyles.fontBold,
                      {color: customColors.text},
                    ]}>{`  #${data?.taskID} ${data?.taskName}`}</Text>
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
                    containerStyle={cStyles.rounded5}
                    onPress={handleShowChildren}>
                    <Progress.Circle
                      animated={false}
                      size={moderateScale(30)}
                      progress={data.percentage / 100}
                      thickness={1}
                      color={customColors.primary}
                      showsText
                      textStyle={[
                        cStyles.textCenter,
                        cStyles.fontRegular,
                        {fontSize: moderateScale(7)},
                      ]}
                    />
                  </CTouchable>
                ) : data.countChild > 0 ? (
                  <CTouchable onPress={handleShowChildren}>
                    <Animated.View
                      style={[
                        cStyles.center,
                        cStyles.rounded10,
                        {transform: [{rotate: rotateData}]},
                        styles.con_children,
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

            {data.descr !== '' && (
              <View style={cStyles.mt3}>
                <CText
                  styles={'textCaption1'}
                  customLabel={data.descr}
                  numberOfLines={2}
                />
              </View>
            )}

            {/** Informations */}
            <View
              style={[
                cStyles.mt6,
                cStyles.pt10,
                cStyles.borderTop,
                isDark && cStyles.borderTopDark,
              ]}>
              <View
                style={[
                  cStyles.flex1,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                ]}>
                <CUser style={styles.row_left} label={data.ownerName} />
                {data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value && (
                  <CStatusTag
                    customLabel={data.statusName}
                    color={isDark ? data.colorDarkCode : data.colorCode}
                  />
                )}
              </View>

              <View
                style={[
                  cStyles.flex1,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                  cStyles.pt12,
                ]}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <Icon
                    name={Icons.time}
                    color={delay > 0 ? customColors.red : customColors.icon}
                    size={moderateScale(10)}
                  />
                  <Text style={cStyles.pl4} numberOfLines={1}>
                    <Text style={cStyles.textCaption2}>
                      {`${moment(data.startDate).format('DD/MM/YYYY')} - `}
                    </Text>
                    <Text
                      style={[
                        cStyles.textCaption2,
                        delay > 0 && {color: customColors.red},
                      ]}>
                      {moment(data.endDate).format('DD/MM/YYYY')}
                    </Text>
                  </Text>
                  {delay > 0 && (
                    <CText
                      customStyles={[
                        cStyles.textCaption2,
                        cStyles.ml3,
                        {color: customColors.red},
                      ]}
                      customLabel={`(${translation(
                        'project_management:delay_date_1',
                      )} ${delay} ${translation(
                        'project_management:delay_date_2',
                      )})`}
                    />
                  )}
                </View>
                {data.lstUserInvited.length > 0 && (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    {data.lstUserInvited.map((item, index) => {
                      if (index === 3) {
                        return (
                          <View
                            style={[
                              cStyles.rounded10,
                              cStyles.p1,
                              cStyles.center,
                              cStyles.abs,
                              cStyles.right0,
                              {
                                top: -moderateScale(10),
                                backgroundColor: customColors.card,
                                height: moderateScale(20),
                                width: moderateScale(20),
                                zIndex: 0,
                              },
                            ]}>
                            <CText
                              styles={'textCaption2'}
                              customLabel={`+${data.lstUserInvited.length - 3}`}
                            />
                          </View>
                        );
                      }
                      if (index < 3) {
                        return (
                          <View
                            style={[
                              cStyles.rounded10,
                              cStyles.p1,
                              cStyles.abs,
                              {
                                top: -moderateScale(10),
                                right: (index + 1) * moderateScale(12),
                                zIndex: index + 1,
                              },
                            ]}>
                            <CAvatar size={'vsmall'} label={item.fullName} />
                          </View>
                        );
                      }
                      return null;
                    })}
                  </View>
                )}
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
  con_label_left: {flex: 0.85},
  con_label_right: {flex: 0.15},
  con_children: {
    width: moderateScale(40),
    height: moderateScale(40),
  },
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
