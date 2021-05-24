/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Animated,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import ListTask from '../list/Task';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';
import Commons from '~/utils/common/Commons';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TaskItem = React.memo(function TaskItem(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {index, data, customColors, isDark} = props;

  const commonState = useSelector(({common}) => common);

  const [showChildren, setShowChildren] = useState(false);
  const [valueAnim] = useState(new Animated.Value(0));

  /** HANDLE FUNC */
  const handleTaskItem = () => {
    navigation.navigate(Routes.MAIN.TASK_DETAIL.name, {
      data,
    });
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
  let type = '',
    bgStatus = '',
    isReject = false;
  if (data.type === 'PHASE') {
    type = 'colorSecondary';
  } else if (data.type === 'TASK') {
    type = 'colorBlue';
  } else if (data.type === 'MILESTONE') {
    type = 'colorGreen';
  }

  if (data.status === Commons.STATUS_TASK.NEW.label) {
    bgStatus = customColors.statusNew;
  } else if (data.status === Commons.STATUS_TASK.TO_BE_SCHEDULE.label) {
    bgStatus = customColors.stausToBeSchedule;
  } else if (data.status === Commons.STATUS_TASK.SCHEDULE.label) {
    bgStatus = customColors.statusSchedule;
  } else if (data.status === Commons.STATUS_TASK.IN_PROCESS.label) {
    bgStatus = customColors.statusInProcess;
  } else if (data.status === Commons.STATUS_TASK.CLOSED.label) {
    bgStatus = customColors.statusClose;
  } else if (data.status === Commons.STATUS_TASK.ON_HOLD.label) {
    bgStatus = customColors.statusOnHold;
  } else if (data.status === Commons.STATUS_TASK.REJECTED.label) {
    isReject = true;
    bgStatus = customColors.statusReject;
  }
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View>
      <TouchableOpacity disabled={props.loading} onPress={handleTaskItem}>
        <View
          style={[
            cStyles.p10,
            cStyles.mb16,
            cStyles.rounded2,
            IS_IOS && cStyles.shadowListItem,
            data.parent && cStyles.ml24,
            IS_ANDROID && cStyles.borderTop,
            IS_ANDROID && cStyles.borderBottom,
            IS_ANDROID && cStyles.borderRight,
            {
              backgroundColor: customColors.listItem,
              borderLeftColor: bgStatus,
              borderLeftWidth: 3,
            },
            isReject && {backgroundColor: customColors.cardDisable},
          ]}>
          {/** Label */}
          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.itemsStart,
              cStyles.justifyBetween,
            ]}>
            <View style={[cStyles.row, cStyles.itemsStart, cStyles.flex1]}>
              <CText
                styles={
                  'H6 fontBold ' + type + ' ' + (isReject && 'textThrough')
                }
                customLabel={data.type}
              />
              <View style={cStyles.flex1}>
                <CText
                  styles={'textTitle pl10 ' + (isReject && 'textThrough')}
                  customLabel={`#${data.id} ${data.label}`}
                />
              </View>
              {data.childrens.length > 0 && (
                <Animated.View style={{transform: [{rotate: rotateData}]}}>
                  <CIconButton
                    iconName={'chevron-down'}
                    iconColor={customColors.text}
                    onPress={handleShowChildren}
                  />
                </Animated.View>
              )}
            </View>
          </View>

          {/** Content */}
          <View
            style={[
              cStyles.row,
              cStyles.itemsStart,
              cStyles.justifyBetween,
              cStyles.flex1,
            ]}>
            <View style={{flex: 0.5}}>
              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText styles={'textMeta'} label={'project_management:grade'} />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.grade !== '' ? data.grade : '-'}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:start_date'}
                />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.startDate !== '' ? data.startDate : '-'}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:end_date'}
                />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.endDate !== '' ? data.endDate : '-'}
                />
              </View>
              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText />
              </View>
            </View>

            <View style={{flex: 0.5}}>
              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:component'}
                />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.component !== '' ? data.component : '-'}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:piority'}
                />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.piority !== '' ? data.piority : '-'}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:assignee'}
                />
                <CText
                  styles={'textMeta fontRegular ' + (isReject && 'textThrough')}
                  customLabel={data.assignee !== '' ? data.assignee : '-'}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:status'}
                />
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 10,
                      backgroundColor: bgStatus,
                    }}
                  />
                  <CText
                    styles={'textMeta fontBold pl6'}
                    customLabel={data.status}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {data.childrens.length > 0 && showChildren && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={{
              borderColor: colors.GRAY_400,
              borderWidth: 0.5,
              height: '100%',
              marginTop: 30,
              marginBottom: 50,
            }}
          />

          <ListTask
            data={data.childrens}
            customColors={customColors}
            isDark={isDark}
            onPress={handleTaskItem} 
          />
        </View>
      )}
    </View>
  );
});

export default TaskItem;
