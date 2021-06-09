/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import ListTask from '../list/Task';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';
import {cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TaskItem = React.memo(function TaskItem(props) {
  const {
    isPrevIsParent,
    data,
    isDark,
    customColors,
    onPress,
    onShowDetail,
  } = props;

  /** Use ref */
  const valueAnim = useRef(new Animated.Value(0)).current;

  /** Use state */
  const [showChildren, setShowChildren] = useState(true);

  /** HANDLE FUNC */
  const handleTaskItem = () => {
    // onPress(data);
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

  /** RENDER */
  let typeColor = customColors[Commons.TYPE_TASK.PHASE.color], // default is PHASE
    bgStatus = customColors[Commons.STATUS_TASK.NEW.color], // default is New
    isReject = false;
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
      isReject = true;
      bgStatus = customColors[Commons.STATUS_TASK.REJECTED.color];
    }
  } else {
    if (data.statusID === Commons.STATUS_TASK.REJECTED.value) {
      isReject = true;
    }
    bgStatus = data.statusColor;
  }
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const Touchable = IS_IOS ? TouchableOpacity : TouchableNativeFeedback;
  return (
    <View style={isPrevIsParent && !showChildren ? cStyles.mt16 : {}}>
      <Touchable disabled={props.loading} onPress={handleTaskItem}>
        <View
          style={[
            cStyles.p10,
            cStyles.mb16,
            cStyles.rounded2,
            cStyles.shadowListItem,
            {
              backgroundColor: customColors.listItem,
              borderLeftColor: typeColor,
              borderLeftWidth: 3,
            },
            isReject && {backgroundColor: customColors.cardDisable},
          ]}>
          {/** Label */}
          <View style={[cStyles.flex1, cStyles.itemsStart, cStyles.fullWidth]}>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                cStyles.fullWidth,
              ]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CText
                  customStyles={[
                    cStyles.H6,
                    cStyles.fontBold,
                    {color: typeColor},
                    isReject && cStyles.textThrough,
                  ]}
                  customLabel={data.typeName}
                />
                <View style={cStyles.pl16}>
                  <CText
                    styles={'textMeta fontMedium ' + (isReject && ' textThrough')}
                    customLabel={data.ownerName}
                  />
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <View style={[styles.status, {backgroundColor: bgStatus}]} />
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

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  data.countChild > 0 && {marginTop: -8},
                ]}>
                {data.countChild > 0 && (
                  <Animated.View style={{transform: [{rotate: rotateData}]}}>
                    <CIconButton
                      iconName={'chevron-down'}
                      iconColor={customColors.text}
                      onPress={handleShowChildren}
                    />
                  </Animated.View>
                )}
                <TouchableOpacity onPress={() => onShowDetail(data)}>
                  <Icon
                    style={[cStyles.p10, cStyles.pl10, cStyles.pr0]}
                    name={'more-vertical'}
                    color={customColors.icon}
                    size={scalePx(3)}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[cStyles.flex1, cStyles.pt6]}>
              <CText
                styles={
                  ' ' +
                  (isReject && 'textThrough ') +
                  (data.countChild === 0 && ' pt10')
                }
                customLabel={`#${data?.taskID} ${data?.taskName}`}
              />
            </View>
          </View>
        </View>
      </Touchable>

      {showChildren && data.countChild > 0 && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={[
              cStyles.borderAll,
              isDark && cStyles.borderAllDark,
              styles.line_child,
            ]}
          />
          <View style={[cStyles.flex1, cStyles.ml12]}>
            <ListTask data={data.lstTaskItem} />
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  status: {
    height: 8,
    width: 8,
    borderRadius: 8,
  },
  line_child: {height: '100%'},
});

export default TaskItem;
