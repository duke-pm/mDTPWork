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
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
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
import CEmpty from '~/components/CEmpty';
import Activities from '../components/Activities';
import Watchers from '../components/Watchers';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {LAST_COMMENT_TASK, THEME_DARK} from '~/config/constants';
import {scalePx, sH, getLocalInfo, checkEmpty} from '~/utils/helper';
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
  const perChangeStatus = route.params?.data?.isUpdated;
  const onRefresh = props.params?.onRefresh;

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
    change: false,
  });
  const [showActivities, setShowActivities] = useState(false);
  const [showWatchers, setShowWatchers] = useState(false);
  const [newComment, setNewComment] = useState(false);
  const [data, setData] = useState({
    taskDetail: null,
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

  const handleShowActivities = () => {
    setNewComment(false);
    setShowActivities(!showActivities);
  };

  const handleShowWatchers = () => {
    setShowWatchers(!showWatchers);
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

  const onPrepareData = async () => {
    let taskDetail = projectState.get('taskDetail');
    let activities = projectState.get('activities');
    if (activities.length > 0) {
      let lastComment = await getLocalInfo(LAST_COMMENT_TASK);
      if (lastComment && lastComment.length > 0) {
        let find = lastComment.findIndex(f => f.taskID === taskID);
        if (find !== -1) {
          if (
            lastComment[find].value < activities[activities.length - 1].rowNum
          ) {
            setNewComment(true);
          }
        } else {
          setNewComment(true);
        }
      } else {
        setNewComment(true);
      }
    }

    let findStatus = status.data.findIndex(
      f => f.statusID === taskDetail.statusID,
    );
    if (findStatus !== -1) {
      setStatus({...status, active: findStatus});
    }
    setData({taskDetail});

    return setLoading({...loading, main: false});
  };

  const onPrepareUpdateStatus = () => {
    let taskDetail = projectState.get('taskDetail');
    setData({taskDetail});
    setLoading({...loading, change: false});
    return showMessage({
      message: t('common:app_name'),
      description: t('success:change_status'),
      type: 'success',
      icon: 'success',
    });
  };

  const onError = isUpdate => {
    let des = !isUpdate
      ? t('error:detail_request')
      : t('error:update_status_request');
    showMessage({
      message: t('common:app_name'),
      description: des,
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({...loading, main: false});
  };

  const onCloseActionSheet = () => {
    setLoading({...loading, change: true});
    let params = fromJS({
      TaskID: taskID,
      StatusID: status.data[status.active].statusID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchUpdateStatusTask(params, navigation));
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
          return onError(false);
        }
      }
    }
  }, [
    loading.main,
    projectState.get('submittingTaskDetail'),
    projectState.get('successTaskDetail'),
    projectState.get('errorTaskDetail'),
  ]);

  useEffect(() => {
    if (loading.change) {
      if (!projectState.get('submittingTaskUpdateStatus')) {
        if (projectState.get('successTaskUpdateStatus')) {
          return onPrepareUpdateStatus();
        }

        if (projectState.get('errorTaskUpdateStatus')) {
          return onError(true);
        }
      }
    }
  }, [
    loading.change,
    projectState.get('submittingTaskUpdateStatus'),
    projectState.get('successTaskUpdateStatus'),
    projectState.get('errorTaskUpdateStatus'),
  ]);

  /** RENDER */
  let bgPriority = customColors[Commons.PRIORITY_TASK.LOW.color]; // default is Low;
  if (data.taskDetail) {
    if (!data.taskDetail.priorityColor) {
      if (data.taskDetail.priority === Commons.PRIORITY_TASK.MEDIUM.value) {
        bgPriority = customColors[Commons.PRIORITY_TASK.MEDIUM.color];
      } else if (
        data.taskDetail.priority === Commons.PRIORITY_TASK.HIGH.value
      ) {
        bgPriority = customColors[Commons.PRIORITY_TASK.HIGH.color];
      }
    } else {
      bgPriority = data.taskDetail.priorityColor;
    }
  }
  return (
    <CContainer
      loading={loading.main || loading.change}
      title={''}
      header
      hasBack
      onRefresh={onRefresh}
      headerRight={
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowActivities}>
            <Icon
              style={cStyles.p16}
              name={'message-square'}
              color={'white'}
              size={scalePx(3)}
            />
            {newComment && (
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.abs,
                  styles.badge,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  {backgroundColor: customColors.red},
                ]}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowWatchers}>
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
          {!loading.main && data.taskDetail && (
            <TouchableOpacity
              disabled={!perChangeStatus}
              onPress={handleShowChangeStatus}>
              <View
                style={[
                  cStyles.mt16,
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
                {perChangeStatus && (
                  <Icon
                    name={'chevron-down'}
                    color={
                      isDark
                        ? data.taskDetail.colorDarkCode
                        : data.taskDetail.colorCode
                    }
                    size={scalePx(3)}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}

          {!loading.main &&
            (data.taskDetail ? (
              <ScrollView style={[cStyles.flex1, cStyles.mt16]}>
                <View
                  style={[
                    cStyles.rounded2,
                    cStyles.m16,
                    cStyles.p16,
                    !isDark && cStyles.shadowListItem,
                    {backgroundColor: customColors.card},
                  ]}>
                  {/** Title & Project */}
                  <View style={cStyles.pb10}>
                    <Text>
                      <Text
                        style={[
                          cStyles.H6,
                          {
                            color: isDark
                              ? data.taskDetail.typeColorDark
                              : data.taskDetail.typeColor,
                          },
                        ]}>
                        {data.taskDetail.typeName}
                      </Text>
                      <Text
                        style={[
                          cStyles.H6,
                          {color: customColors.text},
                        ]}>{`  #${data.taskDetail.taskID} - ${data.taskDetail.taskName}`}</Text>
                    </Text>

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

                  {/** Owner & Time */}
                  <View
                    style={[
                      cStyles.pb10,
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                    ]}>
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_left,
                      ]}>
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

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_right,
                      ]}>
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

                  {/** Piority, Grade & Component */}
                  <View
                    style={[
                      cStyles.pb10,
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                    ]}>
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_left_1,
                      ]}>
                      <CText
                        styles={'textMeta'}
                        label={'project_management:piority'}
                      />

                      <CText
                        customStyles={[
                          cStyles.textMeta,
                          cStyles.fontMedium,
                          {color: bgPriority},
                        ]}
                        customLabel={checkEmpty(data.taskDetail.priorityName)}
                      />
                    </View>

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyStart,
                        styles.con_middle,
                      ]}>
                      <CText
                        styles={'textMeta'}
                        label={'project_management:grade'}
                      />

                      <CText
                        styles={'textMeta pl2 fontMedium'}
                        customLabel={checkEmpty(data.taskDetail.grade)}
                      />
                    </View>

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_right_1,
                      ]}>
                      <CText
                        styles={'textMeta'}
                        label={'project_management:component'}
                      />

                      <CText
                        styles={'textMeta fontMedium'}
                        customLabel={checkEmpty(data.taskDetail.componentName)}
                      />
                    </View>
                  </View>

                  {/** Origin publish & Owner ship */}
                  <View
                    style={[
                      cStyles.pb10,
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                    ]}>
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_left,
                      ]}>
                      <CText
                        styles={'textMeta'}
                        label={'project_management:origin_publisher'}
                      />

                      <CText
                        styles={'textMeta fontMedium'}
                        customLabel={checkEmpty(
                          data.taskDetail.originPublisher,
                        )}
                      />
                    </View>

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_right,
                      ]}>
                      <CText
                        styles={'textMeta'}
                        label={'project_management:owner_ship_dtp'}
                      />

                      <CText
                        styles={'textMeta fontMedium'}
                        customLabel={checkEmpty(data.taskDetail.ownershipDTP)}
                      />
                    </View>
                  </View>

                  {/** Description */}
                  <View style={cStyles.flexCenter}>
                    <View
                      style={[
                        cStyles.borderDashed,
                        cStyles.fullWidth,
                        cStyles.borderAll,
                        isDark && cStyles.borderAllDark,
                        styles.line,
                      ]}
                    />
                  </View>

                  <View style={cStyles.py10}>
                    <CText customLabel={checkEmpty(data.taskDetail.descr)} />
                  </View>
                </View>
              </ScrollView>
            ) : (
              <CEmpty />
            ))}

          <CActionSheet
            actionRef={actionSheetStatusRef}
            headerChoose
            onConfirm={handleChangeStatus}
            onClose={onCloseActionSheet}>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: scalePx(3)}}
              selectedValue={status.active}
              onValueChange={onChangeStatus}>
              {status.data.map((value, i) => (
                <Picker.Item
                  key={value.statusID}
                  label={value.statusName}
                  value={i}
                />
              ))}
            </Picker>
          </CActionSheet>

          {!loading.main && (
            <Activities
              language={language}
              refreshToken={refreshToken}
              navigation={navigation}
              taskID={taskID}
              visible={showActivities}
              onClose={handleShowActivities}
            />
          )}
          {!loading.main && (
            <Watchers
              language={language}
              refreshToken={refreshToken}
              navigation={navigation}
              taskID={taskID}
              visible={showWatchers}
              onClose={handleShowWatchers}
            />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: sH('25%')},
  con_left: {flex: 0.5},
  con_right: {flex: 0.5},
  con_left_1: {flex: 0.3},
  con_middle: {flex: 0.2},
  con_right_1: {flex: 0.5},
  badge: {height: 10, width: 10, top: 16, right: 15},
  line: {borderRadius: 1},
});

export default Task;
