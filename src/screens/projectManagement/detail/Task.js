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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  ScrollView,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CGroupInfo from '~/components/CGroupInfo';
import CIconHeader from '~/components/CIconHeader';
import CAlert from '~/components/CAlert';
import CUser from '~/components/CUser';
import CReadMore from '~/components/CReadMore';
import CTouchable from '~/components/CTouchable';
import CIcon from '~/components/CIcon';
import Status from '../components/Status';
import Percentage from '../components/Percentage';
import FileAttach from '../components/FileAttach';
import Reminder from '../components/Reminder';
/* COMMON */
import Icons from '~/config/Icons';
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {Animations} from '~/utils/asset';
import {usePrevious} from '~/utils/hook';
import {colors, cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4,
  LAST_COMMENT_TASK,
  LOGIN,
  THEME_DARK,
} from '~/config/constants';
import {
  IS_IOS,
  IS_ANDROID,
  getLocalInfo,
  checkEmpty,
  getSecretInfo,
  resetRoute,
  moderateScale,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CustomLayoutAnimated = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};

export const RowInfoBasic = ({
  style = {},
  isDark = false,
  left = null,
  right = null,
  iconOnPress = undefined,
  onPress = undefined,
}) => {
  const Touchable = onPress ? TouchableOpacity : View;
  return (
    <Touchable
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.py12,
        cStyles.borderBottom,
        isDark && cStyles.borderBottomDark,
        style,
      ]}
      onPress={onPress}>
      <View style={[cStyles.itemsStart, styles.row_info_basic_left]}>
        {left}
      </View>
      {onPress ? (
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyEnd,
            styles.row_info_basic_right,
          ]}>
          <View>{right}</View>
          {iconOnPress || (
            <CIcon
              name={Icons.next}
              size={'small'}
              customColor={colors.GRAY_500}
            />
          )}
        </View>
      ) : (
        <View style={[cStyles.itemsEnd, styles.row_info_basic_right]}>
          {right}
        </View>
      )}
    </Touchable>
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
  const userId = authState.getIn(['login', 'userId']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    startFetchLogin: false,
    fastWatch: false,
    preview: false,
  });
  const [participantInfo, setParticipantInfo] = useState(false);
  const [newComment, setNewComment] = useState(false);
  const [isFastWatch, setIsFastWatch] = useState(true);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [completed, setCompleted] = useState({
    status: false,
    show: false,
  });
  const [data, setData] = useState({
    taskDetail: null,
    participantChoose: null,
  });

  let prevTaskDetail = usePrevious(projectState.get('taskDetail'));

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

  const handleParticipant = (participant = null, showAlert = false) => {
    setData({...data, participantChoose: participant});
    setParticipantInfo(showAlert);
  };

  const handleEmail = data => {
    Linking.openURL(`mailto:${data}`);
  };

  /**********
   ** FUNC **
   **********/
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
    return onDone();
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
    return onDone();
  };

  const onDone = () => {
    LayoutAnimation.configureNext(CustomLayoutAnimated);
    return setLoading({
      ...loading,
      main: false,
      startFetch: false,
      startFetchLogin: false,
    });
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
          refresh_token: dataLogin.refreshToken,
          userName: dataLogin.userName,
          userID: dataLogin.userID,
          userId: dataLogin.userId,
          empCode: dataLogin.empCode,
          fullName: dataLogin.fullName,
          regionCode: dataLogin.regionCode,
          deptCode: dataLogin.deptCode,
          jobTitle: dataLogin.jobTitle,
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin && !loading.startFetchLogin) {
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
    if (prevTaskDetail) {
      let taskDetail = projectState.get('taskDetail');
      if (
        prevTaskDetail.taskID === taskDetail.taskID &&
        prevTaskDetail.statusID !== Commons.STATUS_TASK.CLOSED.value &&
        prevTaskDetail.statusID !== taskDetail.statusID
      ) {
        if (taskDetail.statusID === Commons.STATUS_TASK.CLOSED.value) {
          setCompleted({status: true, show: true});
        }
      }
    }
  }, [prevTaskDetail, projectState.get('taskDetail')]);

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
      headerLeft: () =>
        (taskID !== null || taskID !== undefined) && (
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
  ]);

  /************
   ** RENDER **
   ************/
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
  const usersInvited =
    (data.taskDetail && data.taskDetail.lstUserInvited) || [];
  return (
    <CContainer
      loading={false}
      content={
        <>
          <KeyboardAwareScrollView contentInsetAdjustmentBehavior={'automatic'}>
            {!loading.main &&
              data.taskDetail &&
              data.taskDetail.taskTypeID !==
                Commons.TYPE_TASK.MILESTONE.value && (
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
                          cStyles.textHeadline,
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
                          cStyles.textHeadline,
                          {color: customColors.text},
                        ]}>{`  ${data.taskDetail.taskName}`}</Text>
                    </Text>

                    {/** Author & Updated at */}
                    <Text style={cStyles.mt10}>
                      {(!data.taskDetail.crtdUser ||
                        data.taskDetail.crtdUser === '') && (
                        <Text
                          style={[
                            cStyles.textCaption1,
                            {color: customColors.text},
                          ]}>{`#${data.taskDetail.taskID} `}</Text>
                      )}
                      {data.taskDetail.crtdUser &&
                        data.taskDetail.crtdUser !== '' && (
                          <Text>
                            <Text
                              style={[
                                cStyles.textCaption1,
                                {color: customColors.text},
                              ]}>{`#${data.taskDetail.taskID} ${t(
                              'project_management:created_by',
                            )}`}</Text>
                            <Text
                              style={[
                                cStyles.textCaption1,
                                {color: customColors.primary},
                              ]}>
                              {` ${data.taskDetail.crtdUser}`}
                            </Text>
                          </Text>
                        )}
                      <Text
                        style={[
                          cStyles.textCaption1,
                          {color: customColors.text},
                        ]}>{`, ${t(
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
                        styles={'textCaption1 fontMedium'}
                        customLabel={data.taskDetail.prjName}
                      />
                    </View>
                  </View>
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
                  <CReadMore
                    textStyle={[cStyles.textBody, {color: customColors.text}]}
                    textMoreStyle={[
                      cStyles.textCaption1,
                      {color: colors.SECONDARY},
                    ]}
                    numberOfLines={5}
                    textShow={t('common:read_more')}
                    textHide={t('common:read_less')}>
                    {checkEmpty(data.taskDetail.descr)}
                  </CReadMore>
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
                    {/** Reminder */}
                    {data.taskDetail.owner == userId &&
                      data.taskDetail.taskTypeID ===
                        Commons.TYPE_TASK.TASK.value &&
                      data.taskDetail.statusID < 5 && (
                        <Reminder
                          task={data.taskDetail}
                          t={t}
                          isDark={isDark}
                          customColors={customColors}
                        />
                      )}

                    {/** Time */}
                    <RowInfoBasic
                      isDark={isDark}
                      left={
                        <CText label={'project_management:estimated_time'} />
                      }
                      right={
                        <>
                          <CText
                            style={[
                              cStyles.textRight,
                              cStyles.textBody,
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
                              cStyles.textRight,
                              cStyles.textBody,
                              {
                                color: isDelay
                                  ? customColors.red
                                  : customColors.text,
                              },
                            ]}
                            customLabel={`${t(
                              'project_management:to_date',
                            )} ${checkEmpty(
                              data.taskDetail.endDate,
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
                        <CUser
                          textStyle={cStyles.textBody}
                          label={data.taskDetail.ownerName}
                        />
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
                        <CText
                          styles={'textRight'}
                          customLabel={checkEmpty(data.taskDetail.author)}
                        />
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
              contentStyle={cStyles.p0}
              label={'project_management:info_basic_3'}
              empty={
                data.taskDetail &&
                data.taskDetail.attachFiles === '' &&
                usersInvited.length === 0
              }
              content={
                data.taskDetail ? (
                  <>
                    {/** Files attach */}
                    {data.taskDetail.attachFiles !== '' && (
                      <View style={[cStyles.flex1, cStyles.px16, cStyles.py10]}>
                        <CLabel label={'project_management:files_attach'} />
                        <FileAttach file={data.taskDetail.attachFiles} />
                      </View>
                    )}

                    {/** Users invited */}
                    {usersInvited.length > 0 && (
                      <View style={[cStyles.flex1, cStyles.mt10]}>
                        <CLabel
                          style={cStyles.px16}
                          label={'project_management:user_invited'}
                        />
                        <ScrollView
                          contentContainerStyle={[
                            cStyles.flexWrap,
                            cStyles.row,
                            cStyles.itemsCenter,
                            cStyles.p16,
                            cStyles.pt10,
                          ]}>
                          {usersInvited.map((item, index) => {
                            return (
                              <View
                                key={item.userName}
                                style={cStyles.shadowListItem}>
                                <CTouchable
                                  onPress={() => handleParticipant(item, true)}>
                                  <View
                                    style={[
                                      cStyles.row,
                                      cStyles.itemsCenter,
                                      cStyles.rounded1,
                                      cStyles.mt6,
                                      cStyles.mr10,
                                      cStyles.py6,
                                      cStyles.px10,
                                      IS_ANDROID && cStyles.borderAll,
                                      IS_ANDROID &&
                                        isDark &&
                                        cStyles.borderAllDark,
                                      {backgroundColor: customColors.card},
                                    ]}>
                                    <View style={cStyles.pr6}>
                                      <CAvatar
                                        label={item.fullName}
                                        size={'vsmall'}
                                      />
                                    </View>
                                    <CText
                                      styles={'textCallout'}
                                      customLabel={checkEmpty(item.fullName)}
                                    />
                                  </View>
                                </CTouchable>
                              </View>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}
                  </>
                ) : null
              }
            />
          </KeyboardAwareScrollView>

          <CAlert
            show={completed.show}
            title={t('common:congratulations')}
            customContent={
              <View style={cStyles.center}>
                <CText
                  styles={'textCaption1 mt16'}
                  label={'project_management:completed_task'}
                />
                <LottieView
                  style={styles.icon_completed}
                  source={Animations.taskCompleted}
                  autoPlay
                  loop
                />
              </View>
            }
            onClose={() => setCompleted({...completed, show: false})}
          />

          <CAlert
            loading={data.participantChoose === null}
            show={participantInfo}
            contentStyle={cStyles.mt0}
            title={''}
            customContent={
              data.participantChoose && (
                <View>
                  <View style={[cStyles.center, cStyles.mb10]}>
                    <CAvatar
                      size={'large'}
                      label={data.participantChoose.fullName}
                    />
                  </View>
                  {/** User name */}
                  <View
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
                    <CIcon name={Icons.user} size={'medium'} />
                    <CText
                      styles={'pl12'}
                      customLabel={data.participantChoose.userName}
                    />
                  </View>

                  {/** Full name */}
                  <View
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
                    <CIcon name={Icons.userCircle} size={'large'} />
                    <CText
                      styles={'pl10'}
                      customLabel={data.participantChoose.fullName}
                    />
                  </View>

                  {/** Email */}
                  <View
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
                    <CIcon name={Icons.mail} size={'medium'} />
                    <CTouchable
                      onPress={() => handleEmail(data.participantChoose.email)}>
                      <CText
                        styles={'pl12 textUnderline'}
                        customLabel={data.participantChoose.email}
                      />
                    </CTouchable>
                  </View>

                  {/** Phone */}
                </View>
              )
            }
            onClose={handleParticipant}
          />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  row_info_basic_left: {flex: 0.4},
  row_info_basic_right: {flex: 0.6},
  last_row_info_basic: {borderBottomWidth: 0},
  icon_completed: {height: moderateScale(300), width: '100%'},
});

export default Task;
