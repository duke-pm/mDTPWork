/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import PropTypes from 'prop-types';
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
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
import CUser from '~/components/CUser';
import CStatusTag from '~/components/CStatusTag';
import CAvatar from '~/components/CAvatar';
import CIcon from '~/components/CIcon';
import ListTask from '../list/Task';
/* COMMON */
import {DEFAULT_FORMAT_DATE_2} from '~/config/constants';
import {Commons, Icons} from '~/utils/common';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const SIZE_PERCENT_CIRCLE = moderateScale(30);
const PADDING_PARTICIPANT = moderateScale(14);
const PADDING_TOP_PARTICIPANT = moderateScale(10);
const CUSTOM_ANIM = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 16,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

function TaskItem(props) {
  const {
    data = null,
    translation = null,
    isDark = false,
    customColors = {},
    onPress = () => null,
    onRefresh = () => null,
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
    LayoutAnimation.configureNext(CUSTOM_ANIM);
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
    bgTaskType = colors.STATUS_NEW_OPACITY, // Default is TASK
    delay = 0;
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
    data.statusID < Commons.STATUS_TASK.CLOSED.value
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
    <View style={[cStyles.flex1, data.parentID > 0 ? cStyles.ml12 : {}]}>
      <CTouchable
        containerStyle={cStyles.rounded1}
        disabled={props.loading}
        onPress={handleTaskItem}>
        <View
          style={[
            cStyles.flex1,
            cStyles.p10,
            cStyles.rounded1,
            {backgroundColor: bgTaskType},
          ]}>
          {/** Label */}
          <View
            style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value &&
                  styles.con_label_left,
              ]}>
              <View
                style={[
                  cStyles.p4,
                  cStyles.center,
                  cStyles.rounded1,
                  {backgroundColor: bgTaskType},
                ]}>
                <CText
                  styles={'textBody fontBold'}
                  customLabel={data?.taskID}
                />
              </View>
              <Text style={cStyles.pl6} numberOfLines={2}>
                <Text
                  style={[
                    cStyles.textBody,
                    cStyles.fontBold,
                    {color: isDark ? data.typeColorDark : data.typeColor},
                  ]}>
                  {data.typeName}
                </Text>
                <Text
                  style={[
                    cStyles.textBody,
                    cStyles.fontBold,
                    {color: customColors.text},
                  ]}>{` ${data?.taskName}`}</Text>
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
                    size={SIZE_PERCENT_CIRCLE}
                    progress={data.percentage / 100}
                    thickness={1}
                    color={customColors.primary}
                    showsText
                    textStyle={[
                      cStyles.textCenter,
                      cStyles.fontRegular,
                      styles.txt_percent,
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
                    <CIcon name={Icons.up} size={'medium'} />
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
              <CUser label={data.ownerName} />
              {data.taskTypeID !== Commons.TYPE_TASK.MILESTONE.value && (
                <CStatusTag
                  customLabel={data.statusName}
                  color={isDark ? data.colorDarkCode : data.colorCode}
                  bgColor={data.colorOpacityCode}
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
                <CIcon
                  name={Icons.calendar}
                  size={'smaller'}
                  color={delay > 0 ? 'red' : 'icon'}
                />
                <Text style={cStyles.pl4} numberOfLines={1}>
                  <Text
                    style={[cStyles.textCaption2, {color: customColors.text}]}>
                    {`${moment(data.startDate).format(
                      DEFAULT_FORMAT_DATE_2,
                    )} - `}
                  </Text>
                  <Text
                    style={[
                      cStyles.textCaption2,
                      {color: customColors.text},
                      delay > 0 && {color: customColors.red},
                    ]}>
                    {moment(data.endDate).format(DEFAULT_FORMAT_DATE_2)}
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
                          key={index + ''}
                          style={[
                            cStyles.rounded10,
                            cStyles.p1,
                            cStyles.center,
                            cStyles.abs,
                            cStyles.right0,
                            styles.con_user_invite,
                            {backgroundColor: customColors.card},
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
                          key={index + ''}
                          style={[
                            cStyles.rounded10,
                            cStyles.p1,
                            cStyles.abs,
                            {
                              top: -PADDING_TOP_PARTICIPANT,
                              right: (index + 1.5) * PADDING_PARTICIPANT,
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
                cStyles.rounded1,
                cStyles.abs,
                cStyles.borderAll,
                styles.badge,
                isDark && cStyles.borderAllDark,
                showPercentage && styles.right_child,
                {backgroundColor: customColors.red},
              ]}>
              <Text style={[cStyles.fontRegular, styles.txt_count_child]}>
                {data.countChild}
              </Text>
            </View>
          )}
        </View>
      </CTouchable>

      {data.countChild > 0 && (
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            {opacity: showChildren ? 1 : 0, height: showChildren ? '100%' : 0},
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
  );
}

const styles = StyleSheet.create({
  line_child: {height: '100%', borderRadius: 1},
  con_label_left: {flex: 0.85},
  con_label_right: {flex: 0.15},
  con_user_invite: {
    top: -moderateScale(10),
    height: moderateScale(20),
    width: moderateScale(20),
    zIndex: 0,
  },
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
  right_child: {right: moderateScale(10)},
  txt_percent: {fontSize: moderateScale(7)},
  txt_count_child: {color: colors.WHITE, fontSize: moderateScale(8)},
});

TaskItem.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object.isRequired,
  translation: PropTypes.func,
  isDark: PropTypes.bool,
  customColors: PropTypes.object,
  onPress: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default React.memo(TaskItem);
