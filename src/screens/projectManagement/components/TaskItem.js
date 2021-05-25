/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
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
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import CAvatar from '~/components/CAvatar';
import Assets from '~/utils/asset/Assets';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TaskItem = React.memo(function TaskItem(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {index, data, customColors, isDark} = props;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
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

  const handleShowInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInfo(!showInfo);
  };

  /** RENDER */
  let typeColor = customColors.secondary, // default is PHASE
    bgStatus = customColors.statusNew, // default is New
    isReject = false,
    isOutOfDate = false;
  if (data.type === 'TASK') {
    typeColor = customColors.blue;
  } else if (data.type === 'MILESTONE') {
    typeColor = customColors.green;
  }

  if (data.status === Commons.STATUS_TASK.TO_BE_SCHEDULE.label) {
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

  if (moment().valueOf() - moment(data.endDate, 'DD/MM/YYYY').valueOf() > 0) {
    isOutOfDate = true;
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
            data.parent && cStyles.ml16,
            IS_ANDROID && cStyles.borderTop,
            IS_ANDROID && cStyles.borderBottom,
            IS_ANDROID && cStyles.borderRight,
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
                cStyles.itemsStart,
                cStyles.justifyBetween,
                cStyles.fullWidth,
              ]}>
              <CText
                customStyles={[
                  cStyles.H6,
                  cStyles.fontBold,
                  {color: typeColor},
                  isReject && cStyles.textThrough,
                ]}
                customLabel={data.type}
              />

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  data.childrens.length > 0 && {marginTop: -8},
                ]}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 10,
                    backgroundColor: bgStatus,
                  }}
                />
                <CText
                  styles={'textMeta fontBold pl6 colorWhite'}
                  customStyles={[
                    cStyles.textMeta,
                    cStyles.fontBold,
                    {color: bgStatus},
                  ]}
                  customLabel={data.status}
                />
                {data.childrens.length > 0 && (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Animated.View style={{transform: [{rotate: rotateData}]}}>
                      <CIconButton
                        iconName={'chevron-down'}
                        iconColor={customColors.text}
                        onPress={handleShowChildren}
                      />
                    </Animated.View>
                    <View
                      style={[
                        cStyles.center,
                        {
                          height: 20,
                          width: 20,
                          borderRadius: 20,
                          backgroundColor: customColors.cardDisable,
                        },
                      ]}>
                      <CText
                        styles={'textMeta fontRegular'}
                        customLabel={data.childrens.length}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
            <View style={cStyles.flex1}>
              <CText
                styles={
                  'textTitle ' +
                  (isReject && 'textThrough ') +
                  (data.childrens.length === 0 && ' pt10')
                }
                customLabel={`#${data.id} ${data.label}`}
              />
            </View>
          </View>

          {/** Content */}
          {showInfo && (
            <View
              style={[
                cStyles.row,
                cStyles.itemsStart,
                cStyles.justifyBetween,
                cStyles.flex1,
                cStyles.pt10,
              ]}>
              <View style={styles.content_left}>
                {/** grade */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:grade'}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular ' + (isReject && 'textThrough')
                    }
                    customLabel={data.grade !== '' ? data.grade : '-'}
                  />
                </View>

                {/** Start date */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:start_date'}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular ' + (isReject && 'textThrough')
                    }
                    customLabel={data.startDate !== '' ? data.startDate : '-'}
                  />
                </View>

                {/** End date */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:end_date'}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular ' + (isReject && 'textThrough')
                    }
                    customStyles={[
                      cStyles.textMeta,
                      cStyles.fontRegular,
                      isReject && cStyles.textThrough,
                      isOutOfDate && {color: customColors.red},
                    ]}
                    customLabel={data.endDate !== '' ? data.endDate : '-'}
                  />
                </View>
              </View>

              <View style={styles.content_right}>
                {/** Component */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:component'}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular ' + (isReject && 'textThrough')
                    }
                    customLabel={data.component !== '' ? data.component : '-'}
                  />
                </View>

                {/** Piority */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:piority'}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular ' + (isReject && 'textThrough')
                    }
                    customLabel={data.piority !== '' ? data.piority : '-'}
                  />
                </View>

                {/** Assignee */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:assignee'}
                  />
                  <CAvatar
                    containerStyle={cStyles.ml2}
                    source={Assets.iconUserDefault}
                    size={'vsmall'}
                    customColors={customColors}
                  />
                  <CText
                    styles={
                      'textMeta fontRegular pl2 ' + (isReject && 'textThrough')
                    }
                    customLabel={data.assignee !== '' ? data.assignee : '-'}
                  />
                </View>
              </View>
            </View>
          )}

          {/** Show more */}
          <View
            style={[
              cStyles.fullWidth,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.mt10,
            ]}>
            {!showInfo ? (
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CAvatar
                  source={Assets.iconUserDefault}
                  size={'vsmall'}
                  customColors={customColors}
                />
                <CText
                  styles={
                    'textMeta fontRegular pl3 ' + (isReject && 'textThrough')
                  }
                  customLabel={data.assignee !== '' ? data.assignee : '-'}
                />
              </View>
            ) : (
              <View />
            )}

            <TouchableOpacity onPress={handleShowInfo}>
              <View
                style={[
                  cStyles.center,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.mt5,
                  cStyles.pl40,
                ]}>
                <CText
                  styles={'textMeta'}
                  label={'common:' + (showInfo ? 'show_less' : 'show_more')}
                />
                <Icon
                  style={cStyles.pl4}
                  name={showInfo ? 'chevrons-up' : 'chevrons-down'}
                  size={scalePx(1.5)}
                  color={customColors.icon}
                />
              </View>
            </TouchableOpacity>
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

const styles = StyleSheet.create({
  content_left: {flex: 0.45},
  content_right: {flex: 0.55},
});

export default TaskItem;
