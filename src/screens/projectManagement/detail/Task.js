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
  TextInput,
  KeyboardAvoidingView,
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
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {LAST_COMMENT_TASK, THEME_DARK, THEME_LIGHT} from '~/config/constants';
import {
  scalePx,
  sH,
  getLocalInfo,
  checkEmpty,
  previewFile,
} from '~/utils/helper';
import API from '~/services/axios';
/** REDUX */
import * as Actions from '~/redux/actions';

/** All refs use in this screen */
const actionSheetStatusRef = createRef();
let percentRef = createRef();

function Task(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const taskID = route.params?.data?.taskID;
  const perChangeStatus = route.params?.data?.isUpdated;
  const onRefresh = route.params?.onRefresh;

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
    main: true,
    change: false,
    startFetch: false,
  });
  const [newComment, setNewComment] = useState(false);
  const [data, setData] = useState({
    taskDetail: null,
  });
  const [status, setStatus] = useState({
    data: statusMaster,
    active: 0,
  });
  const [percent, setPercent] = useState({
    visible: false,
    value: 0,
  });

  /** HANDLE FUNC */
  const handleChangeStatus = () => {
    actionSheetStatusRef.current?.hide();
  };

  const handleShowChangeStatus = () => {
    actionSheetStatusRef.current?.show();
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

  const handleChangePercent = () => {
    if (percent.visible) {
      if (percent.value < 0 || percent.value > 100) {
        showMessage({
          message: t('common:app_name'),
          description: t('project_management:warning_input_percent'),
          type: 'warning',
          icon: 'warning',
        });
        percentRef.focus();
      } else {
        if (Number(percent.value) === data.taskDetail.percentage) {
          setPercent({...percent, visible: !percent.visible});
        } else {
          setPercent({...percent, visible: !percent.visible});
          let params = {
            TaskID: taskID,
            StatusID: data.taskDetail.statusID,
            Percentage: percent.value,
            Lang: language,
            RefreshToken: refreshToken,
          };
          dispatch(Actions.fetchUpdateTask(params, navigation));
          setLoading({...loading, change: true});
        }
      }
    } else {
      setPercent({...percent, visible: !percent.visible});
    }
  };

  const handleClosePercent = () => {
    setPercent({visible: !percent.visible, value: data.taskDetail.percentage});
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
    setPercent({...percent, value: taskDetail.percentage});

    return setLoading({...loading, main: false, startFetch: false});
  };

  const onPrepareUpdate = () => {
    let taskDetail = projectState.get('taskDetail');
    setData({taskDetail});
    setLoading({...loading, change: false});
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

    return setLoading({...loading, main: false, startFetch: false});
  };

  const onCloseActionSheet = () => {
    if (status.data[status.active].statusID !== data.taskDetail.statusID) {
      setLoading({...loading, change: true});
      let params = {
        TaskID: taskID,
        StatusID: status.data[status.active].statusID,
        Lang: language,
        RefreshToken: refreshToken,
      };
      dispatch(Actions.fetchUpdateTask(params, navigation));
    }
  };

  const onChangePercent = value => {
    setPercent({...percent, value: Number(value) + ''});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
    setLoading({...loading, startFetch: true});
  }, []);

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

  useEffect(() => {
    if (loading.change) {
      if (!projectState.get('submittingTaskUpdate')) {
        if (projectState.get('successTaskUpdate')) {
          return onPrepareUpdate();
        }

        if (projectState.get('errorTaskUpdate')) {
          return onError(true);
        }
      }
    }
  }, [
    loading.change,
    projectState.get('submittingTaskUpdate'),
    projectState.get('successTaskUpdate'),
    projectState.get('errorTaskUpdate'),
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

                      <Text style={cStyles.pt4}>
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
                        <CText
                          styles={'textMeta'}
                          label={'project_management:piority'}
                        />

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
                        <CText
                          styles={'textMeta'}
                          label={'project_management:grade'}
                        />

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
                        <CText
                          styles={'textMeta'}
                          label={'project_management:component'}
                        />

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
                        <CText
                          styles={'textMeta'}
                          label={'project_management:origin_publisher'}
                        />

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
                        <CText
                          styles={'textMeta'}
                          label={'project_management:owner_ship_dtp'}
                        />

                        <CText
                          styles={'textMeta'}
                          customLabel={checkEmpty(data.taskDetail.ownershipDTP)}
                        />
                      </View>
                    </View>

                    {/** Percentage */}
                    <View
                      style={[
                        cStyles.pb10,
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                      ]}>
                      <TouchableOpacity
                        style={styles.con_left}
                        disabled={!data.taskDetail.isUpdated}
                        onPress={handleChangePercent}>
                        <View style={[cStyles.row, cStyles.itemsCenter]}>
                          <CText
                            styles={'textMeta'}
                            label={'project_management:task_percentage'}
                          />

                          {!percent.visible ? (
                            <View
                              style={[
                                cStyles.row,
                                cStyles.itemsCenter,
                                cStyles.pl10,
                              ]}>
                              <View style={styles.percent}>
                                <View
                                  style={[
                                    cStyles.fullWidth,
                                    cStyles.rounded5,
                                    cStyles.borderAll,
                                    styles.percent_active,
                                  ]}
                                />
                                <View
                                  style={[
                                    cStyles.abs,
                                    cStyles.roundedTopLeft5,
                                    cStyles.roundedBottomLeft5,
                                    percent.value === 100 &&
                                      cStyles.roundedTopRight5,
                                    percent.value === 100 &&
                                      cStyles.roundedBottomRight5,
                                    cStyles.center,
                                    styles.percent_active,
                                    {
                                      width: `${percent.value}%`,
                                      backgroundColor: customColors.primary,
                                    },
                                  ]}
                                />
                              </View>
                              <Text
                                style={[
                                  cStyles.textMeta,
                                  cStyles.textCenter,
                                  cStyles.pl10,
                                  {color: customColors.text},
                                ]}>{`${percent.value}%`}</Text>
                            </View>
                          ) : (
                            <View
                              style={[
                                cStyles.row,
                                cStyles.itemsCenter,
                                cStyles.fullWidth,
                              ]}>
                              <View
                                style={[
                                  cStyles.px4,
                                  cStyles.borderAll,
                                  cStyles.rounded1,
                                  styles.percent_input,
                                ]}>
                                <TextInput
                                  ref={ref => (percentRef = ref)}
                                  style={[
                                    cStyles.textDefault,
                                    cStyles.px4,
                                    {color: customColors.text},
                                  ]}
                                  autoFocus
                                  value={percent.value + ''}
                                  keyboardAppearance={
                                    isDark ? THEME_DARK : THEME_LIGHT
                                  }
                                  keyboardType={'number-pad'}
                                  returnKeyType={'done'}
                                  onChangeText={onChangePercent}
                                  onSubmitEditing={handleChangePercent}
                                  onEndEditing={handleChangePercent}
                                />
                              </View>
                              <TouchableOpacity
                                style={[cStyles.p3, cStyles.ml16]}
                                onPress={handleClosePercent}>
                                <Icon
                                  name={'x'}
                                  size={18}
                                  color={customColors.red}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/** Files attach */}
                    {data.taskDetail.attachFiles !== '' && (
                      <View style={cStyles.pb10}>
                        <CText
                          styles={'textMeta'}
                          label={'project_management:files_attach'}
                        />
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
  dot_file: {height: 5, width: 5, borderRadius: 5},
  percent_active: {height: 12},
  percent_input: {width: '40%'},
  percent: {width: '70%'},
});

export default Task;
