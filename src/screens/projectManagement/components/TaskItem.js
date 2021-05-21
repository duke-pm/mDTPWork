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
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import ListTask from '../list/Task';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';
/* REDUX */

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TaskItem = React.memo(function TaskItem(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {index, data, customColors, darkMode, onPress, onChangeStatus} = props;

  const commonState = useSelector(({common}) => common);

  const [showChildren, setShowChildren] = useState(false);
  const [valueAnim] = useState(new Animated.Value(0));

  const handleShowChildren = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(valueAnim, {
      toValue: showChildren ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowChildren(!showChildren);
  };

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

  if (data.status === 'New') {
    bgStatus = customColors.statusNew;
  } else if (data.status === 'To be scheduled') {
    bgStatus = customColors.stausToBeSchedule;
  } else if (data.status === 'Scheduled') {
    bgStatus = customColors.statusSchedule;
  } else if (data.status === 'In progress') {
    bgStatus = customColors.statusInProcess;
  } else if (data.status === 'Closed') {
    bgStatus = customColors.statusClose;
  } else if (data.status === 'On hold') {
    bgStatus = customColors.statusOnHold;
  } else if (data.status === 'Rejected') {
    isReject = true;
    bgStatus = customColors.statusReject;
  }
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  return (
    <View>
      <View style={{position: 'absolute', bottom: 20, left: 0}}>
        <Icon
          name={'arrow-right'}
          color={colors.GRAY_400}
          size={scalePx(1.8)}
        />
      </View>

      <TouchableOpacity disabled={props.loading} onPress={onPress}>
        <Animated.View
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
              cStyles.itemsCenter,
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

              <TouchableOpacity onPress={onChangeStatus}>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
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
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
            isDark={darkMode}
            onChangeStatus={onChangeStatus}
          />
        </View>
      )}
    </View>
  );
});

export default TaskItem;
