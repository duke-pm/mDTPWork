/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Name: Task
 ** Author: DTP-Education
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

const Separator = isDark => (
  <View style={[cStyles.flexCenter, cStyles.my5]}>
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
);

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
  const userName = authState.getIn(['login', 'userName']);
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    fastWatch: false,
  });
  const [newComment, setNewComment] = useState(false);
  const [isFastWatch, setIsFastWatch] = useState(true);
  const [data, setData] = useState({
    taskDetail: null,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFastWatch = () => {
    if (isFastWatch) {
      setLoading({...loading, fastWatch: true});
      let params = {
        LineNum: 0,
        TaskID: taskID,
        Lang: language,
        RefreshToken: refreshToken,
      };
      return dispatch(Actions.fetchTaskWatcher(params, navigation));
    }
  };

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

  /************
   ** FUNC **
   ************/
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

  const onPrepareData = async updateWatcher => {
    let taskDetail = projectState.get('taskDetail');
    let activities = projectState.get('activities');
    let watchers = projectState.get('watchers');
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

    /** Find watcher */
    if (updateWatcher) {
      if (watchers.length > 0) {
        let fWatcher = watchers.find(f => f.userName === userName);
        if (fWatcher) {
          setIsFastWatch(false);
        }
      }
    }
    return done();
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

  const onError = desUpdate => {
    let des = !desUpdate ? t('error:detail_request') : t(desUpdate);
    showMessage({
      message: t('common:app_name'),
      description: des,
      type: 'danger',
      icon: 'danger',
    });
    return done();
  };

  const done = () => {
    return setLoading({main: false, startFetch: false, fastWatch: false});
  };

  /******************
   ** LIFE CYCLE **
   ******************/
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
          return onPrepareData(true);
        }

        if (projectState.get('errorTaskDetail')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    projectState.get('submittingTaskDetail'),
    projectState.get('successTaskDetail'),
    projectState.get('errorTaskDetail'),
  ]);

  useEffect(() => {
    if (loading.fastWatch) {
      if (!projectState.get('submittingTaskWatcher')) {
        if (projectState.get('successTaskWatcher')) {
          showMessage({
            message: t('common:app_name'),
            description: t('success:change_follow'),
            type: 'success',
            icon: 'success',
          });
          setIsFastWatch(false);
          return onPrepareData(false);
        }

        if (projectState.get('errorTaskWatcher')) {
          return onError('error:send_follow');
        }
      }
    }
  }, [
    loading.fastWatch,
    projectState.get('submittingTaskWatcher'),
    projectState.get('successTaskWatcher'),
    projectState.get('errorTaskWatcher'),
    setIsFastWatch,
  ]);

  /**************
   ** RENDER **
   **************/
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
          <TouchableOpacity
            style={cStyles.itemsEnd}
            disabled={!isFastWatch}
            onPress={handleFastWatch}>
            <Icon
              style={cStyles.p16}
              name={'eye'}
              color={isFastWatch ? colors.WHITE : colors.GRAY_500}
              size={scalePx(3)}
            />
            {!isFastWatch && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.center,
                  cStyles.rounded2,
                  styles.badge2,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  {backgroundColor: customColors.green},
                ]}
              />
            )}
            {!isFastWatch && (
              <Icon
                style={[cStyles.p16, cStyles.abs, styles.dot_check]}
                name={'check'}
                color={colors.WHITE}
                size={8}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={cStyles.itemsEnd} onPress={handleActivities}>
            <Icon
              style={cStyles.p16}
              name={'message-square'}
              color={colors.WHITE}
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
              color={colors.WHITE}
              size={scalePx(3)}
            />
          </TouchableOpacity>
        </View>
      }
      content={
        <CContent>
          <ScrollView style={cStyles.flex1}>
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
                        cStyles.mt12,
                        cStyles.py10,
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
                      cStyles.py10,
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
                    <View>
                      {Separator(isDark)}
                      <Percentage
                        isDark={isDark}
                        customColors={customColors}
                        navigation={navigation}
                        language={language}
                        refreshToken={refreshToken}
                        task={data.taskDetail}
                        onUpdate={onPrepareUpdate}
                      />
                    </View>
                  )}

                  {/** Files attach */}
                  {data.taskDetail.attachFiles !== '' && (
                    <View>
                      {data.taskDetail.taskTypeID !==
                        Commons.TYPE_TASK.TASK.value && Separator(isDark)}
                      <View style={cStyles.pb10}>
                        <CLabel label={'project_management:files_attach'} />
                        <TouchableOpacity onPress={handlePreviewFile}>
                          <View
                            style={[
                              cStyles.row,
                              cStyles.itemsCenter,
                              cStyles.py2,
                            ]}>
                            <Icon
                              style={cStyles.ml16}
                              name={'paperclip'}
                              color={customColors.icon}
                              size={13}
                            />
                            <CText
                              customStyles={[
                                cStyles.textMeta,
                                cStyles.textItalic,
                                cStyles.ml6,
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
                    </View>
                  )}

                  {Separator(isDark)}

                  {/** Description */}
                  <View style={cStyles.py10}>
                    <CText customLabel={checkEmpty(data.taskDetail.descr)} />
                  </View>
                </View>
              ) : (
                <CEmpty />
              ))}

            <View style={cStyles.flex1} />
          </ScrollView>
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
  badge2: {height: 10, width: 10, top: 16, right: 13},
  line: {borderRadius: 1},
  dot_file: {height: 5, width: 5, borderRadius: 5},
  dot_check: {right: -2, top: 1},
});

export default Task;
