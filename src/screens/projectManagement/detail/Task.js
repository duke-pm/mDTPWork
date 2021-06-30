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
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CList from '~/components/CList';
import Status from '../components/Status';
import Percentage from '../components/Percentage';
import FileAttach from '../components/FileAttach';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4,
  LAST_COMMENT_TASK,
  LOGIN,
  THEME_DARK,
} from '~/config/constants';
import {
  getLocalInfo,
  checkEmpty,
  IS_ANDROID,
  getSecretInfo,
  resetRoute,
  fS,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Separator = isDark => (
  <View style={[cStyles.flexCenter, cStyles.my3]}>
    <View
      style={[
        cStyles.borderDashed,
        cStyles.fullWidth,
        cStyles.borderAll,
        cStyles.py5,
        isDark && cStyles.borderAllDark,
        styles.line,
      ]}
    />
  </View>
);

function GroupInfo({loading, customColors, label, content, empty}) {
  if (empty) {
    return null;
  }
  return (
    <View style={cStyles.mb16}>
      {label && <CText styles={'H6 px16'} label={label} />}
      {content}
    </View>
  );
}

function Task(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  let taskID = route.params?.data?.taskID || -1;
  if (taskID === -1) {
    taskID = route.params?.taskID || -1;
  }
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
    startFetchLogin: false,
    fastWatch: false,
    preview: false,
  });
  const [newComment, setNewComment] = useState(false);
  const [isFastWatch, setIsFastWatch] = useState(true);
  const [needRefresh, setNeedRefresh] = useState(false);
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
      onRefresh: () => onRefreshWatcher(),
    });
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
    if (!needRefresh) {
      setNeedRefresh(true);
    }
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return setLoading({main: false, startFetch: false, fastWatch: false});
  };

  const onRefreshWatcher = () => {
    setIsFastWatch(false);
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      dataLogin = {
        tokenInfo: {
          access_token: dataLogin.accessToken,
          token_type: dataLogin.tokenType,
          expires_in: dataLogin.expiresIn,
          refresh_token: dataLogin.refreshToken,
          userName: dataLogin.userName,
          userID: dataLogin.userID,
          empCode: dataLogin.empCode,
          fullName: dataLogin.fullName,
          regionCode: dataLogin.regionCode,
          deptCode: dataLogin.deptCode,
          jobTitle: dataLogin.jobTitle,
          '.expires': dataLogin.expired,
          groupID: dataLogin.groupID,
        },
        lstMenu: dataLogin.lstMenu,
      };
      dispatch(Actions.loginSuccess(dataLogin));
    } else {
      onGoToSignIn();
    }
  };

  const onGoToSignIn = () => {
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      onStart();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return onStart();
        }
        if (authState.get('errorLogin')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetchLogin,
    authState.get('submitting'),
    authState.get('successLogin'),
    authState.get('errorLogin'),
  ]);

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
          if (!needRefresh) {
            setNeedRefresh(true);
          }
          return onPrepareData(false);
        }

        if (projectState.get('errorTaskWatcher')) {
          if (!needRefresh) {
            setNeedRefresh(true);
          }
          return onError('error:send_follow');
        }
      }
    }
  }, [
    loading.fastWatch,
    needRefresh,
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
  let isDelay = false;
  if (
    data.taskDetail &&
    data.taskDetail.endDate &&
    data.taskDetail.endDate !== ''
  ) {
    isDelay = moment().isAfter(
      moment(data.taskDetail.endDate, DEFAULT_FORMAT_DATE_4),
      'days',
    );
  }
  return (
    <CContainer
      loading={false}
      title={''}
      header
      hasBack
      onRefresh={needRefresh ? onRefresh : null}
      headerRight={
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          {!loading.main && isFastWatch && (
            <TouchableOpacity
              style={cStyles.itemsEnd}
              disabled={!isFastWatch}
              onPress={handleFastWatch}>
              <Icon
                style={cStyles.p16}
                name={'eye'}
                color={isFastWatch ? colors.WHITE : colors.GRAY_500}
                size={fS(20)}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={cStyles.itemsEnd} onPress={handleActivities}>
            <Icon
              style={cStyles.p16}
              name={'message-circle'}
              color={colors.WHITE}
              size={fS(20)}
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
              size={fS(20)}
            />
            {!isFastWatch && (
              <View
                style={[
                  cStyles.center,
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
        </View>
      }
      content={
        <CContent scroll>
          {!loading.main && data.taskDetail && (
            <Status
              disabled={loading.preview}
              isUpdate={perChangeStatus}
              isDark={isDark}
              customColors={customColors}
              language={language}
              refreshToken={refreshToken}
              navigation={navigation}
              task={data.taskDetail}
              onUpdate={onPrepareUpdate}
              onNeedUpdate={setNeedRefresh}
            />
          )}

          {/** Title & Project */}
          <GroupInfo
            loading={loading.main}
            customColors={customColors}
            label={null}
            content={
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.m16,
                  cStyles.mt10,
                  cStyles.p16,
                  (loading.main || !data.taskDetail) && styles.group_holder,
                  {backgroundColor: customColors.card},
                ]}>
                {loading.main || !data.taskDetail ? (
                  <ActivityIndicator size={'small'} color={colors.GRAY_500} />
                ) : (
                  <>
                    <View style={cStyles.pb10}>
                      {/** Title & Type */}
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

                      {/** Author & Updated at */}
                      <Text style={cStyles.mt10}>
                        {(!data.taskDetail.crtdUser ||
                          data.taskDetail.crtdUser === '') && (
                          <Text
                            style={[
                              cStyles.textMeta,
                              {color: customColors.text},
                            ]}>{`#${data.taskDetail.taskID} `}</Text>
                        )}
                        {data.taskDetail.crtdUser &&
                          data.taskDetail.crtdUser !== '' && (
                            <Text>
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
                                {` ${data.taskDetail.crtdUser}. `}
                              </Text>
                            </Text>
                          )}
                        <Text
                          style={[
                            cStyles.textMeta,
                            {color: customColors.text},
                          ]}>{`${t(
                          'project_management:last_updated_at',
                        )} ${moment(
                          data.taskDetail.lUpdDate,
                          DEFAULT_FORMAT_DATE_4,
                        ).format(formatDateView)}.`}</Text>
                      </Text>

                      {/** Project name */}
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
                  </>
                )}
              </View>
            }
          />

          <GroupInfo
            loading={loading.main}
            customColors={customColors}
            label={'project_management:info_basic'}
            content={
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.m16,
                  cStyles.mt10,
                  cStyles.p16,
                  (loading.main || !data.taskDetail) && styles.group_holder,
                  {backgroundColor: customColors.card},
                ]}>
                {loading.main || !data.taskDetail ? (
                  <ActivityIndicator size={'small'} color={colors.GRAY_500} />
                ) : (
                  <>
                    {/** Owner & Time */}
                    <View
                      style={[
                        cStyles.py10,
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                      ]}>
                      <View style={styles.con_left}>
                        <CLabel label={'project_management:assignee'} />
                        <View style={[cStyles.row, cStyles.itemsCenter]}>
                          <CAvatar
                            size={'vsmall'}
                            label={data.taskDetail.ownerName}
                          />
                          <CText
                            styles={'textMeta pl6 fontMedium'}
                            customLabel={data.taskDetail.ownerName}
                          />
                        </View>
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
                          size={fS(16)}
                        />
                        <View style={cStyles.pl6}>
                          <View style={[cStyles.row, cStyles.itemsCenter]}>
                            <CLabel label={'project_management:from_date'} />
                            <CText
                              customStyles={[
                                cStyles.textMeta,
                                cStyles.fontRegular,
                                {color: customColors.text},
                              ]}
                              customLabel={checkEmpty(
                                data.taskDetail.startDate,
                                '#',
                                false,
                                formatDateView,
                              )}
                            />
                          </View>
                          <View style={[cStyles.row, cStyles.itemsCenter]}>
                            <CLabel label={'project_management:to_date'} />
                            <CText
                              customStyles={[
                                cStyles.textMeta,
                                cStyles.fontRegular,
                                {
                                  color: isDelay
                                    ? customColors.red
                                    : customColors.text,
                                },
                              ]}
                              customLabel={checkEmpty(
                                data.taskDetail.endDate,
                                '#',
                                false,
                                formatDateView,
                              )}
                            />
                          </View>
                        </View>
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
                          styles.con_left,
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
                          styles.con_right,
                        ]}>
                        <CLabel label={'project_management:grade'} />
                        <CLabel
                          customLabel={checkEmpty(data.taskDetail.grade)}
                        />
                      </View>
                    </View>

                    {/** Component */}
                    <View
                      style={[cStyles.row, cStyles.itemsCenter, cStyles.mb10]}>
                      <CLabel label={'project_management:component'} />
                      <CLabel
                        customLabel={checkEmpty(data.taskDetail.componentName)}
                      />
                    </View>

                    {/** Component */}
                    <View
                      style={[cStyles.row, cStyles.itemsCenter, cStyles.mb10]}>
                      <CLabel label={'project_management:author'} />
                      <CLabel
                        customLabel={checkEmpty(data.taskDetail.author)}
                      />
                    </View>

                    {/** Origin publish */}
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.mb10,
                        styles.con_left,
                      ]}>
                      <CLabel label={'project_management:origin_publisher'} />
                      <CLabel
                        customLabel={checkEmpty(
                          data.taskDetail.originPublisher,
                        )}
                      />
                    </View>

                    {/** Owner ship */}
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.mb10,
                        styles.con_right,
                      ]}>
                      <CLabel label={'project_management:owner_ship_dtp'} />
                      <CLabel
                        customLabel={checkEmpty(data.taskDetail.ownershipDTP)}
                      />
                    </View>

                    {/** Sector */}
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        styles.con_sector,
                      ]}>
                      <CLabel label={'project_management:sector'} />
                      <CLabel
                        customLabel={checkEmpty(data.taskDetail.sectorName)}
                      />
                    </View>
                  </>
                )}
              </View>
            }
          />

          <GroupInfo
            loading={loading.main}
            customColors={customColors}
            label={'project_management:info_basic_2'}
            empty={
              data.taskDetail &&
              data.taskDetail.taskTypeID !== Commons.TYPE_TASK.TASK.value
            }
            content={
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.m16,
                  cStyles.mt10,
                  cStyles.p16,
                  (loading.main || !data.taskDetail) && styles.group_holder,
                  {backgroundColor: customColors.card},
                ]}>
                {loading.main || !data.taskDetail ? (
                  <ActivityIndicator size={'small'} color={colors.GRAY_500} />
                ) : (
                  <View style={cStyles.my5}>
                    {/** Percentage */}
                    <Percentage
                      disabled={loading.preview}
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
              </View>
            }
          />

          <GroupInfo
            loading={loading.main}
            customColors={customColors}
            label={'project_management:info_basic_3'}
            empty={
              data.taskDetail &&
              data.taskDetail.attachFiles === '' &&
              data.taskDetail.lstUserInvited.length === 0
            }
            content={
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.m16,
                  cStyles.mt10,
                  cStyles.p16,
                  (loading.main || !data.taskDetail) && styles.group_holder,
                  {backgroundColor: customColors.card},
                ]}>
                {loading.main || !data.taskDetail ? (
                  <ActivityIndicator size={'small'} color={colors.GRAY_500} />
                ) : (
                  <>
                    {/** Files attach */}
                    {data.taskDetail.attachFiles !== '' && (
                      <View style={cStyles.flex1}>
                        <CLabel label={'project_management:files_attach'} />
                        <FileAttach file={data.taskDetail.attachFiles} />
                      </View>
                    )}

                    {data.taskDetail.attachFiles !== '' &&
                      data.taskDetail.lstUserInvited.length > 0 &&
                      Separator(isDark)}

                    {/** Users invited */}
                    {data.taskDetail.lstUserInvited.length > 0 && (
                      <>
                        <CLabel label={'project_management:user_invited'} />
                        <CList
                          style={[
                            cStyles.mt6,
                            cStyles.rounded2,
                            styles.list_invited,
                            {backgroundColor: customColors.textInput},
                          ]}
                          contentStyle={cStyles.p10}
                          data={data.taskDetail.lstUserInvited}
                          item={({item, index}) => {
                            return (
                              <View
                                key={item.userName}
                                style={[
                                  cStyles.row,
                                  cStyles.itemsCenter,
                                  cStyles.ml3,
                                ]}>
                                <CAvatar
                                  containerStyle={cStyles.mr5}
                                  label={item.fullName}
                                  size={'vsmall'}
                                />
                                <View
                                  style={[
                                    cStyles.ml5,
                                    cStyles.py6,
                                    cStyles.flex1,
                                    index !==
                                      data.taskDetail.lstUserInvited.length -
                                        1 && cStyles.borderBottom,
                                    index !==
                                      data.taskDetail.lstUserInvited.length -
                                        1 &&
                                      isDark &&
                                      cStyles.borderBottomDark,
                                  ]}>
                                  <CLabel
                                    medium
                                    customLabel={checkEmpty(item.fullName)}
                                  />
                                  <CLabel
                                    customLabel={checkEmpty(item.email)}
                                  />
                                </View>
                              </View>
                            );
                          }}
                        />
                      </>
                    )}
                  </>
                )}
              </View>
            }
          />

          {/** Description */}
          <GroupInfo
            loading={loading.main}
            customColors={customColors}
            label={'project_management:info_basic_4'}
            content={
              <View
                style={[
                  cStyles.rounded2,
                  cStyles.m16,
                  cStyles.mt10,
                  cStyles.p16,
                  (loading.main || !data.taskDetail) && styles.group_holder,
                  {backgroundColor: customColors.card},
                ]}>
                {loading.main || !data.taskDetail ? (
                  <ActivityIndicator size={'small'} color={colors.GRAY_500} />
                ) : (
                  <View style={cStyles.pt5}>
                    <CText customLabel={checkEmpty(data.taskDetail.descr)} />
                  </View>
                )}
              </View>
            }
          />
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
  con_sector: {flex: 0.4},
  badge: {height: 10, width: 10, top: 16, right: 15},
  badge2: {height: 10, width: 10, top: 16, right: 13},
  line: {borderRadius: 1},
  dot_check: {right: -2, top: 1},
  list_invited: {maxHeight: 150},
  group_holder: {height: 50},
});

export default Task;
