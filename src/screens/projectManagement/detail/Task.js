/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Name: Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CActionSheet from '~/components/CActionSheet';
import Activity from '../components/Activity';
import CEmpty from '~/components/CEmpty';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {scalePx, sH} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

/** All refs use in this screen */
const actionSheetStatusRef = createRef();

function Task(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const taskID = route.params?.data?.taskID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const statusMaster = masterState.get('projectStatus');

  /** Use state */
  const [loading, setLoading] = useState({
    main: false,
  });
  const [showActivity, setShowActivity] = useState(false);
  const [data, setData] = useState({
    taskDetail: null,
    activities: [],
    relationShips: [],
    watchers: [],
  });
  const [status, setStatus] = useState({
    data: statusMaster,
    active: 0,
  });

  /** HANDLE FUNC */
  const handleChangeStatus = () => {
    actionSheetStatusRef.current?.hide();
  };

  const handleShowChangeStatus = () => {
    actionSheetStatusRef.current?.show();
  };

  const handleShowActivity = () => {
    setShowActivity(!showActivity);
  };

  /** FUNC */
  const onFetchData = () => {
    let params = fromJS({
      TaskID: taskID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchTaskDetail(params, navigation));
  };

  const onChangeStatus = index => {
    setStatus({...status, active: index});
  };

  const onPrepareData = () => {
    let taskDetail = projectState.get('taskDetail');
    let activities = projectState.get('activities');
    let relationShips = projectState.get('relationShips');
    let watchers = projectState.get('watchers');

    let findStatus = status.data.findIndex(
      f => f.statusID === taskDetail.statusID,
    );
    if (findStatus !== -1) {
      setStatus({...status, active: findStatus});
    }
    setData({taskDetail, activities, relationShips, watchers});

    return setLoading({main: false});
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:detail_request'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({main: false});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
    setLoading({...loading, main: true});
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (!projectState.get('submittingTaskDetail')) {
        if (projectState.get('successTaskDetail')) {
          return onPrepareData();
        }

        if (projectState.get('errorTaskDetail')) {
          return onError();
        }
      }
    }
  }, [
    loading.main,
    projectState.get('submittingTaskDetail'),
    projectState.get('successTaskDetail'),
    projectState.get('errorTaskDetail'),
  ]);

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
          {data.taskDetail ? (
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
                    {backgroundColor: data.taskDetail.colorOpacityCode},
                  ]}>
                  <CText
                    customStyles={[
                      cStyles.fontMedium,
                      {
                        color: isDark
                          ? data.taskDetail.colorDarkCode
                          : data.taskDetail.colorCode,
                      },
                    ]}
                    customLabel={data.taskDetail.statusName.toUpperCase()}
                  />
                  <Icon
                    name={'chevron-down'}
                    color={
                      isDark
                        ? data.taskDetail.colorDarkCode
                        : data.taskDetail.colorCode
                    }
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
                      label={data.taskDetail.ownerName}
                    />
                    <CText
                      styles={'textMeta pl6 fontMedium'}
                      customLabel={data.taskDetail.ownerName}
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
                      customLabel={
                        moment(
                          data.taskDetail.startDate,
                          'YYYY-MM-DDTHH:mm:ss',
                        ).format(formatDateView) +
                        ' - ' +
                        moment(
                          data.taskDetail.endDate,
                          'YYYY-MM-DDTHH:mm:ss',
                        ).format(formatDateView)
                      }
                    />
                  </View>
                </View>

                {/** Title & Project */}
                <View style={cStyles.pb10}>
                  <CText styles={'H6'} customLabel={data.taskDetail.taskName} />
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
                      customLabel={data.taskDetail.prjName}
                    />
                  </View>
                </View>

                {/** Description */}
                <View style={cStyles.pb10}>
                  <CText customLabel={data.taskDetail.descr} />
                </View>
              </View>
            </ScrollView>
          ) : (
            <CEmpty />
          )}

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
                <Picker.Item
                  label={value.statusName}
                  value={i}
                  key={value.statusID}
                />
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
