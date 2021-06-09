/*
 ** Name: Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React, {createRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Picker from '@gregfrench/react-native-wheel-picker';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CActionSheet from '~/components/CActionSheet';
import Activity from '../components/Activity';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {STATUS_TASK, THEME_DARK} from '~/config/constants';
import {scalePx, sH} from '~/utils/helper';

/** All refs use in this screen */
const actionSheetStatusRef = createRef();

function Task(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const data = props.route.params.data;
  let findStatus = STATUS_TASK.findIndex(f => f.label === data.status);

  /** Use state */
  const [showActivity, setShowActivity] = useState(false);
  const [status, setStatus] = useState({
    data: STATUS_TASK,
    active: findStatus,
  });

  /** HANDLE FUNC */
  const handleChangeStatus = () => {
    data.status = status.data[status.active].label;
    actionSheetStatusRef.current?.hide();
  };

  const handleShowChangeStatus = () => {
    actionSheetStatusRef.current?.show();
  };

  const handleShowActivity = () => {
    setShowActivity(!showActivity);
  };

  /** FUNC */
  const onChangeStatus = index => {
    setStatus({...status, active: index});
  };

  /** RENDER */
  return (
    <CContainer
      loading={false}
      title={''}
      header
      hasBack
      headerRight={
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowActivity}>
            <Icon
              style={cStyles.p16}
              name={'message-square'}
              color={'white'}
              size={scalePx(3)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowActivity}>
            <Icon
              style={cStyles.p16}
              name={'git-pull-request'}
              color={'white'}
              size={scalePx(3)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowActivity}>
            <Icon
              style={cStyles.p16}
              name={'users'}
              color={'white'}
              size={scalePx(3)}
            />
          </TouchableOpacity>
        </View>
      }
      content={
        <CContent>
          <ScrollView
            style={cStyles.flex1}
            contentContainerStyle={cStyles.pt16}>
            {/** Status */}
            <TouchableOpacity onPress={handleShowChangeStatus}>
              <View
                style={[
                  cStyles.mx16,
                  cStyles.px16,
                  cStyles.py10,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                  cStyles.rounded1,
                  {backgroundColor: STATUS_TASK[findStatus].color.opacity},
                ]}>
                <CText
                  customStyles={[
                    cStyles.fontMedium,
                    {color: STATUS_TASK[findStatus].color[useColorScheme()]},
                  ]}
                  customLabel={data.status.toUpperCase()}
                />
                <Icon
                  name={'chevron-down'}
                  color={STATUS_TASK[findStatus].color[useColorScheme()]}
                  size={scalePx(3)}
                />
              </View>
            </TouchableOpacity>

            <View
              style={[
                cStyles.rounded2,
                cStyles.m16,
                cStyles.p16,
                !isDark && cStyles.shadowListItem,
                {backgroundColor: customColors.card},
              ]}>
              {/** Assigned & Time */}
              <View
                style={[
                  cStyles.pb10,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                ]}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CAvatar
                    customColors={customColors}
                    size={'vsmall'}
                    label={data.assignee}
                  />
                  <CText
                    styles={'textMeta pl6 fontMedium'}
                    customLabel={data.assignee}
                  />
                </View>

                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <Icon
                    name={'calendar'}
                    color={customColors.icon}
                    size={scalePx(2.3)}
                  />
                  <CText
                    customStyles={[
                      cStyles.textMeta,
                      cStyles.pl6,
                      cStyles.fontRegular,
                      {color: customColors.text},
                    ]}
                    customLabel={data.startDate + ' - ' + data.endDate}
                  />
                </View>
              </View>

              {/** Title & Project */}
              <View style={cStyles.pb10}>
                <CText styles={'H6'} customLabel={data.label} />
                <View
                  style={[
                    cStyles.rounded5,
                    cStyles.center,
                    cStyles.mt10,
                    cStyles.py6,
                    {
                      flex: undefined,
                      backgroundColor: isDark
                        ? customColors.cardDisable
                        : colors.GRAY_300,
                    },
                  ]}>
                  <CText
                    styles={'textMeta fontMedium'}
                    customLabel={data.project}
                  />
                </View>
              </View>

              {/** Description */}
              <View style={cStyles.pb10}>
                <CText customLabel={data.description} />
              </View>
            </View>
          </ScrollView>

          <CActionSheet
            actionRef={actionSheetStatusRef}
            headerChoose
            onConfirm={handleChangeStatus}>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: scalePx(3)}}
              selectedValue={status.active}
              onValueChange={onChangeStatus}>
              {status.data.map((value, i) => (
                <Picker.Item label={value.label} value={i} key={value} />
              ))}
            </Picker>
          </CActionSheet>

          <Activity visible={showActivity} onClose={handleShowActivity} />
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: sH('25%')},
});

export default Task;
