/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Name: Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CEmpty from '~/components/CEmpty';
import CLabel from '~/components/CLabel';
import Status from '../components/Status';
import Percentage from '../components/Percentage';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {LAST_COMMENT_TASK, THEME_DARK} from '~/config/constants';
import {scalePx, getLocalInfo, checkEmpty, previewFile} from '~/utils/helper';
import API from '~/services/axios';
/** REDUX */
import * as Actions from '~/redux/actions';

function Task(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const taskID = route.params?.data?.taskID || 0;
  const perChangeStatus = route.params?.data?.isUpdated || false;
  const onRefresh = route.params?.onRefresh || false;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
  });
  const [newComment, setNewComment] = useState(false);
  const [data, setData] = useState({
    taskDetail: null,
  });

  /** HANDLE FUNC */
  const handleActivities = () => {
    if (newComment) {
      setNewComment(false);
    }
    navigation.navigate(
      Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name,
      {
        data: {taskID},
      },
    );
  };

  const handleWatchers = () => {
    navigation.navigate(Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name, {
      data: {taskID},
    });
  };

  const handlePreviewFile = () => {
    let url =
      API.defaults.baseURL.substring(0, API.defaults.baseURL.length - 3) +
      data.taskDetail.attachFiles;
    let fileName = data.taskDetail.attachFiles.substring(
      data.taskDetail.attachFiles.lastIndexOf('/') + 1,
      data.taskDetail.attachFiles.length,
    );
    previewFile(url, fileName);
  };

  /** FUNC */
  const onStart = () => {
    onFetchData();
    setLoading({...loading, startFetch: true});
  };

  const onFetchData = () => {
    let params = fromJS({
      TaskID: taskID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchTaskDetail(params, navigation));
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
    setData({taskDetail});

    return setLoading({main: false, startFetch: false});
  };

  const onPrepareUpdate = () => {
    let taskDetail = projectState.get('taskDetail');
    setData({taskDetail});
    return showMessage({
      message: t('common:app_name'),
      description: t('success:change_info'),
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

    return setLoading({main: false, startFetch: false});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    if (data.taskDetail) {
      if (data.taskDetail.taskID !== taskID) {
        onStart();
      }
    } else {
      onStart();
    }
  }, [data.taskDetail, taskID]);

  useEffect(() => {
    if (loading.startFetch) {
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
    loading.startFetch,
    projectState.get('submittingTaskDetail'),
    projectState.get('successTaskDetail'),
    projectState.get('errorTaskDetail'),
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
      loading={loading.main}
      title={''}
      header
      hasBack
      onRefresh={onRefresh}
      headerRight={
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <TouchableOpacity style={cStyles.itemsEnd} onPress={handleActivities}>
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
          <TouchableOpacity style={cStyles.itemsEnd} onPress={handleWatchers}>
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
          <KeyboardAvoidingView style={cStyles.flex1} behavior={'padding'}>
            <ScrollView
              contentContainerStyle={[cStyles.flex1, cStyles.justifyEnd]}>
              {!loading.main && data.taskDetail && (
                <Status
                  isUpdate={perChangeStatus}
                  isDark={isDark}
                  customColors={customColors}
                  language={language}
                  refreshToken={refreshToken}
                  navigation={navigation}
                  task={data.taskDetail}
                  onUpdate={onPrepareUpdate}
                />
              )}

              {!loading.main &&
                (data.taskDetail ? (
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
                          ]}>{`  ${data.taskDetail.taskName}`}</Text>
                      </Text>

                      <Text style={cStyles.mt10}>
                        <Text
                          style={[
                            cStyles.textMeta,
                            {color: customColors.text},
                          ]}>{`#${data.taskDetail.taskID}: ${t(
                          'project_management:created_by',
                        )}`}</Text>
                        <Text
                          style={[
                            cStyles.textMeta,
                            {color: customColors.primary},
                          ]}>
                          {` ${data.taskDetail.author}. `}
                        </Text>
                        <Text
                          style={[
                            cStyles.textMeta,
                            {color: customColors.text},
                          ]}>{`${t(
                          'project_management:last_updated_at',
                        )} ${moment(
                          data.taskDetail.lUpdDate,
                          'YYYY-MM-DDTHH:mm:ss',
                        ).format(formatDateView)}.`}</Text>
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
                            checkEmpty(
                              data.taskDetail.startDate,
                              '#',
                              false,
                              formatDateView,
                            ) +
                            ' - ' +
                            checkEmpty(
                              data.taskDetail.endDate,
                              '#',
                              false,
                              formatDateView,
                            )
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
                        <CLabel label={'project_management:piority'} />

                        <CText
                          customStyles={[cStyles.textMeta, {color: bgPriority}]}
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
                        <CLabel label={'project_management:grade'} />

                        <CText
                          styles={'textMeta'}
                          customLabel={checkEmpty(data.taskDetail.grade)}
                        />
                      </View>

                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          styles.con_right_1,
                        ]}>
                        <CLabel label={'project_management:component'} />

                        <CText
                          styles={'textMeta'}
                          customLabel={checkEmpty(
                            data.taskDetail.componentName,
                          )}
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
                        <CLabel label={'project_management:origin_publisher'} />

                        <CText
                          styles={'textMeta'}
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
                        <CLabel label={'project_management:owner_ship_dtp'} />

                        <CText
                          styles={'textMeta'}
                          customLabel={checkEmpty(data.taskDetail.ownershipDTP)}
                        />
                      </View>
                    </View>

                    {/** Percentage */}
                    {data.taskDetail.taskTypeID ===
                      Commons.TYPE_TASK.TASK.value && (
                      <Percentage
                        isDark={isDark}
                        customColors={customColors}
                        navigation={navigation}
                        language={language}
                        refreshToken={refreshToken}
                        task={data.taskDetail}
                        onUpdate={onPrepareUpdate}
                      />
                    )}

                    {/** Files attach */}
                    {data.taskDetail.attachFiles !== '' && (
                      <View style={cStyles.pb10}>
                        <CLabel label={'project_management:files_attach'} />
                        <TouchableOpacity onPress={handlePreviewFile}>
                          <View
                            style={[
                              cStyles.row,
                              cStyles.itemsCenter,
                              cStyles.py2,
                            ]}>
                            <View
                              style={[
                                cStyles.mx10,
                                styles.dot_file,
                                {backgroundColor: customColors.icon},
                              ]}
                            />
                            <CText
                              customStyles={[
                                cStyles.textMeta,
                                cStyles.textItalic,
                                {color: customColors.primary},
                              ]}
                              customLabel={data.taskDetail.attachFiles.substring(
                                data.taskDetail.attachFiles.lastIndexOf('/') +
                                  1,
                                data.taskDetail.attachFiles.length,
                              )}
                              dataDetectorType={'link'}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}

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
                ) : (
                  <CEmpty />
                ))}

              <View style={cStyles.flex1} />
            </ScrollView>
          </KeyboardAvoidingView>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.5},
  con_right: {flex: 0.5},
  con_left_1: {flex: 0.3},
  con_middle: {flex: 0.2},
  con_right_1: {flex: 0.5},
  badge: {height: 10, width: 10, top: 16, right: 15},
  line: {borderRadius: 1},
  dot_file: {height: 5, width: 5, borderRadius: 5},
});

export default Task;
