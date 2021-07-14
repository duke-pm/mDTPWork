/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Name: Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Text, LayoutAnimation, UIManager} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CList from '~/components/CList';
import CGroupInfo from '~/components/CGroupInfo';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
import CIconHeader from '~/components/CIconHeader';
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
  moderateScale,
  IS_IOS,
} from '~/utils/helper';
import Icons from '~/config/Icons';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RowInfoBasic = ({
  style = {},
  isDark = false,
  left = null,
  right = null,
}) => {
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.py12,
        cStyles.borderBottom,
        isDark && cStyles.borderBottomDark,
        style,
      ]}>
      <View style={[cStyles.itemsStart, styles.row_info_basic_left]}>
        {left}
      </View>
      <View style={[cStyles.itemsEnd, styles.row_info_basic_right]}>
        {right}
      </View>
    </View>
  );
};

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
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const userName = authState.getIn(['login', 'userName']);

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
  const handleBack = () => {
    resetRoute(navigation, Routes.ROOT_TAB.name);
  };

  const handleFastWatch = () => {
    setIsFastWatch(!isFastWatch);
    let params = {
      TaskID: taskID,
      IsWatched: isFastWatch,
      IsReceiveEmail: true,
      Lang: language,
      RefreshToken: refreshToken,
      UserName: userName,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    return setLoading({
      ...loading,
      main: false,
      startFetch: false,
      fastWatch: true,
    });
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
      onRefresh: onRefreshWatcher,
    });
  };

  /************
   ** FUNC **
   ************/
  const onStart = () => {
    onFetchData();
  };

  const onFetchData = () => {
    let params = fromJS({
      TaskID: taskID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchTaskDetail(params, navigation));
    setLoading({...loading, startFetch: true});
  };

  const onPrepareData = async () => {
    let taskDetail = projectState.get('taskDetail');
    let activities = projectState.get('activities');
    let isWatched = projectState.get('isWatched');
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
    setIsFastWatch(!isWatched);

    return done();
  };

  const onPrepareWatch = () => {
    showMessage({
      message: t('common:app_name'),
      description: t(
        !isFastWatch ? 'success:change_follow' : 'success:change_unfollow',
      ),
      type: 'success',
      icon: 'success',
    });
    return setLoading({...loading, fastWatch: false});
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
    return setLoading({...loading, main: false, startFetch: false});
  };

  const onRefreshWatcher = isWatch => {
    setIsFastWatch(!isWatch);
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
          return onPrepareData();
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
          return onPrepareWatch();
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
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('dismiss', e => {
      if (needRefresh && onRefresh) {
        onRefresh();
      }
    });
    return unsubscribe;
  }, [navigation, needRefresh]);

  useLayoutEffect(() => {
    navigation.setOptions({
      backButtonInCustomView: true,
      title: `${t('project_management:detail_task')} #${taskID}`,
      headerLeft: () =>
        (route.params?.taskID !== null ||
          route.params?.taskID !== undefined) && (
          <CIconHeader
            icons={[
              {
                show: !navigation.canGoBack(),
                showRedDot: false,
                icon: IS_IOS ? Icons.backiOS : Icons.backAndroid,
                iconColor: IS_ANDROID ? colors.WHITE : customColors.blue,
                onPress: handleBack,
              },
            ]}
          />
        ),
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: false,
              icon: isFastWatch ? Icons.eye : Icons.eyeOff,
              onPress: handleFastWatch,
            },
            {
              show: true,
              showRedDot: newComment,
              icon: Icons.comments,
              onPress: handleActivities,
            },
            {
              show: true,
              showRedDot: !isFastWatch,
              icon: Icons.watchers,
              onPress: handleWatchers,
            },
          ]}
        />
      ),
    });
  }, [
    navigation,
    isFastWatch,
    newComment,
    isFastWatch,
    taskID,
    navigation.canGoBack,
    route.params?.taskID,
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
      } else if (
        data.taskDetail.priority === Commons.PRIORITY_TASK.IMMEDIATE.value
      ) {
        bgPriority = customColors[Commons.PRIORITY_TASK.IMMEDIATE.color];
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
      content={
        <CAvoidKeyboard>
          <CContent>
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
            <CGroupInfo
              loading={loading.main || !data.taskDetail}
              label={null}
              content={
                data.taskDetail ? (
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
                ) : null
              }
            />

            {/** Info basic */}
            <CGroupInfo
              loading={loading.main || !data.taskDetail}
              label={'project_management:info_basic'}
              content={
                data.taskDetail ? (
                  <>
                    {/** Time */}
                    <RowInfoBasic
                      style={cStyles.pb12}
                      isDark={isDark}
                      left={
                        <CText
                          styles={'textRight'}
                          label={'project_management:estimated_time'}
                        />
                      }
                      right={
                        <>
                          <CText
                            style={[
                              cStyles.textDefault,
                              {color: customColors.text},
                            ]}
                            customLabel={`${t(
                              'project_management:from_date',
                            )} ${checkEmpty(
                              data.taskDetail.startDate,
                              '#',
                              false,
                              formatDateView,
                            )}`}
                          />
                          <CText
                            style={[
                              cStyles.mt5,
                              cStyles.textDefault,
                              {
                                color: isDelay
                                  ? customColors.red
                                  : customColors.text,
                              },
                            ]}
                            customLabel={`${t(
                              'project_management:to_date',
                            )} ${checkEmpty(
                              data.taskDetail.startDate,
                              '#',
                              false,
                              formatDateView,
                            )}`}
                          />
                        </>
                      }
                    />

                    {/** Owner */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:assignee'} />}
                      right={
                        <View style={[cStyles.row, cStyles.itemsCenter]}>
                          <CAvatar
                            size={'vsmall'}
                            label={data.taskDetail.ownerName}
                          />
                          <CText
                            styles={'pl6 textRight'}
                            customLabel={data.taskDetail.ownerName}
                          />
                        </View>
                      }
                    />

                    {/** Piority */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:piority'} />}
                      right={
                        <CText
                          customStyles={[
                            cStyles.textRight,
                            {color: bgPriority},
                          ]}
                          customLabel={checkEmpty(data.taskDetail.priorityName)}
                        />
                      }
                    />

                    {/** Sector */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:sector'} />}
                      right={
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(data.taskDetail.sectorName)}
                        />
                      }
                    />

                    {/** Grade */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:grade'} />}
                      right={
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(data.taskDetail.gradeName)}
                        />
                      }
                    />

                    {/** Component */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:component'} />}
                      right={
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(
                            data.taskDetail.componentName,
                          )}
                        />
                      }
                    />

                    {/** Author */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={<CText label={'project_management:author'} />}
                      right={
                        <View style={[cStyles.row, cStyles.itemsCenter]}>
                          {data.taskDetail.author !== '' && (
                            <CAvatar
                              size={'vsmall'}
                              label={data.taskDetail.author}
                            />
                          )}
                          <CText
                            styles={'pl6 textRight'}
                            customLabel={checkEmpty(data.taskDetail.author)}
                          />
                        </View>
                      }
                    />

                    {/** Origin publish */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={
                        <CText label={'project_management:origin_publisher'} />
                      }
                      right={
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(
                            data.taskDetail.originPublisher,
                          )}
                        />
                      }
                    />

                    {/** Owner ship */}
                    <RowInfoBasic
                      style={styles.last_row_info_basic}
                      isDark={isDark}
                      left={
                        <CText label={'project_management:owner_ship_dtp'} />
                      }
                      right={
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(data.taskDetail.ownershipDTP)}
                        />
                      }
                    />
                  </>
                ) : null
              }
            />

            {/** Progress task */}
            <CGroupInfo
              loading={loading.main || !data.taskDetail}
              label={'project_management:info_basic_2'}
              empty={
                data.taskDetail &&
                data.taskDetail.taskTypeID !== Commons.TYPE_TASK.TASK.value
              }
              content={
                data.taskDetail ? (
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
                ) : null
              }
            />

            {/** Other info */}
            <CGroupInfo
              loading={loading.main || !data.taskDetail}
              label={'project_management:info_basic_3'}
              empty={
                data.taskDetail &&
                data.taskDetail.attachFiles === '' &&
                data.taskDetail.lstUserInvited.length === 0
              }
              content={
                data.taskDetail ? (
                  <>
                    {/** Files attach */}
                    {data.taskDetail.attachFiles !== '' && (
                      <View style={cStyles.flex1}>
                        <CLabel label={'project_management:files_attach'} />
                        <FileAttach file={data.taskDetail.attachFiles} />
                      </View>
                    )}

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
                          nestedScrollEnabled={true}
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
                                    cStyles.py10,
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
                                  <CText
                                    styles={'mt5 textMeta'}
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
                ) : null
              }
            />

            {/** Description */}
            <CGroupInfo
              loading={loading.main || !data.taskDetail}
              label={'project_management:info_basic_4'}
              empty={data.taskDetail && data.taskDetail.descr.trim() === ''}
              content={
                data.taskDetail ? (
                  <View style={cStyles.pt5}>
                    <CText customLabel={checkEmpty(data.taskDetail.descr)} />
                  </View>
                ) : null
              }
            />
          </CContent>
        </CAvoidKeyboard>
      }
    />
  );
}

const styles = StyleSheet.create({
  list_invited: {height: moderateScale(150)},
  row_info_basic_left: {flex: 0.4},
  row_info_basic_right: {flex: 0.6},
  last_row_info_basic: {borderBottomWidth: 0},
});

export default Task;
