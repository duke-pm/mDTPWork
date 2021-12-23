/* eslint-disable eqeqeq */
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
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
import Percentage from '../components/Percentage';
// import CAvatar from '~/components/CAvatar';
// import CLabel from '~/components/CLabel';
// import CGroupInfo from '~/components/CGroupInfo';
// import CIconHeader from '~/components/CIconHeader';
// import CAlert from '~/components/CAlert';
// import CUser from '~/components/CUser';
// import CReadMore from '~/components/CReadMore';
// import CTouchable from '~/components/CTouchable';
// import CIcon from '~/components/CIcon';
// import CLoading from '~/components/CLoading';
// import CInvitedDetails from '~/components/CInvitedDetails';
// import Status from '../components/Status';
// import FileAttach from '../components/FileAttach';
// import Reminder from '../components/Reminder';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Commons, Icons} from '~/utils/common';
import {Animations, Assets} from '~/utils/asset';
import {usePrevious} from '~/utils/hook';
import {colors, cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4,
  AST_LAST_COMMENT_TASK,
  AST_LOGIN,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';
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
import CTopNavigation from '~/components/CTopNavigation';
import {useTheme, Layout, Text, Avatar, Tooltip} from '@ui-kitten/components';
import CLoading from '~/components/CLoading';

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

// export const RowInfoBasic = React.memo(
//   ({
//     style = {},
//     isDark = false,
//     left = null,
//     right = null,
//     iconOnPress = undefined,
//     onPress = undefined,
//   }) => {
//     const Touchable = onPress ? TouchableOpacity : View;
//     return (
//       <Touchable
//         style={[
//           cStyles.row,
//           cStyles.itemsCenter,
//           cStyles.justifyBetween,
//           cStyles.py12,
//           cStyles.borderBottom,
//           isDark && cStyles.borderBottomDark,
//           style,
//         ]}
//         onPress={onPress}>
//         <View style={[cStyles.itemsStart, styles.row_info_basic_left]}>
//           {left}
//         </View>
//         {onPress ? (
//           <View
//             style={[
//               cStyles.row,
//               cStyles.itemsCenter,
//               cStyles.justifyEnd,
//               styles.row_info_basic_right,
//             ]}>
//             <View>{right}</View>
//             {iconOnPress || (
//               <CIcon
//                 name={Icons.next}
//                 size={'small'}
//                 customColor={colors.GRAY_500}
//               />
//             )}
//           </View>
//         ) : (
//           <View style={[cStyles.itemsEnd, styles.row_info_basic_right]}>
//             {right}
//           </View>
//         )}
//       </Touchable>
//     );
//   },
// );

function Task(props) {
  const {t} = useTranslation();
  const theme = useTheme();
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
    update: false,
    fastWatch: false,
    preview: false,
  });
  const [tooltipDelay, setTooltipDelay] = useState(false);
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

  /** Use prev */
  let prevTaskDetail = usePrevious(projectState.get('taskDetail'));

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBack = () => resetRoute(navigation, Routes.TAB.name);

  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

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
    return navigation.navigate(
      Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name,
      {data: {taskID}},
    );
  };

  const handleWatchers = () => {
    return navigation.navigate(
      Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name,
      {data: {taskID}, onRefresh: onRefreshWatcher},
    );
  };

  const handleParticipant = (participant = null, showAlert = false) => {
    setData({...data, participantChoose: participant});
    return setParticipantInfo(showAlert);
  };

  /**********
   ** FUNC **
   **********/
  const onStart = () => onFetchData();

  const onRefreshWatcher = isWatch => setIsFastWatch(!isWatch);

  const onStartUpdate = () => setLoading({...loading, update: true});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onFetchData = () => {
    let params = fromJS({
      TaskID: taskID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchTaskDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onPrepareData = async () => {
    let taskDetail = projectState.get('taskDetail');
    let activities = projectState.get('activities');
    let isWatched = projectState.get('isWatched');
    if (activities.length > 0) {
      let lastComment = await getLocalInfo(AST_LAST_COMMENT_TASK);
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

  const onPrepareUpdate = isSuccess => {
    if (isSuccess) {
      if (!needRefresh) {
        setNeedRefresh(true);
      }
      let taskDetail = projectState.get('taskDetail');
      setData({taskDetail});
      setLoading({...loading, update: false});
      return showMessage({
        message: t('common:app_name'),
        description: t('success:change_info'),
        type: 'success',
        icon: 'success',
      });
    } else {
      setLoading({...loading, update: false});
    }
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
    return setLoading({
      ...loading,
      main: false,
      startFetch: false,
      startFetchLogin: false,
    });
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(AST_LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      let i,
        tmpDataLogin = {tokenInfo: {}, lstMenu: {}};
      for (i = 0; i < FieldsAuth.length; i++) {
        if (i === 0) {
          tmpDataLogin[FieldsAuth[i].key] = dataLogin[FieldsAuth[i].key];
        } else {
          tmpDataLogin.tokenInfo[FieldsAuth[i].key] =
            dataLogin[FieldsAuth[i].value];
        }
      }
      return dispatch(Actions.loginSuccess(tmpDataLogin));
    } else {
      return onGoToSignIn();
    }
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
        prevTaskDetail.statusID !== Commons.STATUS_TASK["5"]["value"] &&
        prevTaskDetail.statusID !== taskDetail.statusID
      ) {
        if (taskDetail.statusID === Commons.STATUS_TASK["5"]["value"]) {
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

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     backButtonInCustomView: true,
  //     headerLeft: () =>
  //       (taskID !== null || taskID !== undefined) && (
  //         <CIconHeader
  //           icons={[
  //             {
  //               show: !navigation.canGoBack(),
  //               showRedDot: false,
  //               icon: IS_IOS ? Icons.backiOS : Icons.backAndroid,
  //               iconColor: customColors.icon,
  //               onPress: handleBack,
  //             },
  //           ]}
  //         />
  //       ),
  //     headerRight: () => (
  //       <CIconHeader
  //         icons={[
  //           {
  //             show: true,
  //             showRedDot: false,
  //             icon: isFastWatch ? Icons.eye : Icons.eyeOff,
  //             onPress: handleFastWatch,
  //           },
  //           {
  //             show: true,
  //             showRedDot: newComment,
  //             icon: Icons.comments,
  //             onPress: handleActivities,
  //           },
  //           {
  //             show: true,
  //             showRedDot: !isFastWatch,
  //             icon: Icons.watchers,
  //             onPress: handleWatchers,
  //           },
  //         ]}
  //       />
  //     ),
  //   });
  // }, [
  //   navigation,
  //   isFastWatch,
  //   newComment,
  //   isFastWatch,
  //   taskID,
  //   navigation.canGoBack,
  // ]);

  /************
   ** RENDER **
   ************/
  let bgPriority = Commons.PRIORITY_TASK["L"]['color']; // default is Low;
  if (data.taskDetail) {
    if (!data.taskDetail.priorityColor) {
      if (data.taskDetail.priority === Commons.PRIORITY_TASK["N"]["value"]) {
        bgPriority = Commons.PRIORITY_TASK["N"]['color'];
      } else if (
        data.taskDetail.priority === Commons.PRIORITY_TASK["H"]["value"]
      ) {
        bgPriority = Commons.PRIORITY_TASK["H"]['color'];
      } else if (
        data.taskDetail.priority === Commons.PRIORITY_TASK["I"]["value"]
      ) {
        bgPriority = Commons.PRIORITY_TASK["I"]['color'];
      }
    } else {
      bgPriority = data.taskDetail.priorityColor;
    }
  }
  let delay = 0,
    showPercentage = data.taskDetail?.taskTypeID === Commons.TYPE_TASK.TASK.value;
  if (
    data.taskDetail &&
    showPercentage &&
    data.taskDetail.statusID < Commons.STATUS_TASK["5"]["value"]
  ) {
    if (data.taskDetail.endDate && data.taskDetail.endDate !== '') {
      delay = moment().diff(data.taskDetail.endDate, 'days');
    }
  }
  const usersInvited =
    (data.taskDetail && data.taskDetail.lstUserInvited) || [];
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={
        <CTopNavigation
          title={`${t('project_management:detail_task')} #${taskID}`}
          back
          borderBottom
        />
      }>
      <KeyboardAwareScrollView contentInsetAdjustmentBehavior={'automatic'}>
        {!loading.main && (
          <Layout style={[cStyles.px16, cStyles.py10]}>
            {/** Title & Type */}
            <View>
              <Text>
                <Text category="h6" status={Commons.TYPE_TASK[data.taskDetail.typeName]['color']}>
                  {data.taskDetail.typeName}
                </Text>
                <Text category="h6">{`  ${data.taskDetail.taskName}`}</Text>
              </Text>
            </View>

            {/** Author & Updated at */}
            <View>
              <Text style={cStyles.mt10}>
                {(!data.taskDetail.crtdUser ||
                  data.taskDetail.crtdUser === '') && (
                  <Text category="c1">{`#${data.taskDetail.taskID} `}</Text>
                )}
                {data.taskDetail.crtdUser &&
                  data.taskDetail.crtdUser !== '' && (
                    <Text>
                      <Text category="label">
                        {`#${data.taskDetail.taskID} `}
                      </Text>
                      <Text category="c1">{`${t(
                        'project_management:created_by',
                      )}`}</Text>
                      <Text category="label" status="primary">
                        {` ${data.taskDetail.crtdUser}`}
                      </Text>
                    </Text>
                  )}
                <Text category="c1">
                  {`, ${t(
                  'project_management:last_updated_at',
                )} ${moment(
                  data.taskDetail.lUpdDate,
                  DEFAULT_FORMAT_DATE_4,
                ).format(DEFAULT_FORMAT_DATE_9)}`}</Text>
              </Text>
            </View>
            
            {/** Project name */}
            <Layout
              style={[
                cStyles.rounded5,
                cStyles.center,
                cStyles.mt12,
                cStyles.py10,
              ]}
              level="3">
              <Text category="label">{data.taskDetail.prjName}</Text>
            </Layout>

            {/** Description */}
            <View style={cStyles.mt16}>
              <CText>{checkEmpty(data.taskDetail.descr, t('project_management:empty_description'))}</CText>
            </View>

            {/** Info basic */}
            <View style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter, cStyles.mt24]}>
              <CText category='c1' appearance="hint" style={cStyles.mr10}>
                {t('project_management:holder_task_percentage')}
              </CText>
              <Percentage
                disabled={loading.preview}
                navigation={navigation}
                language={language}
                refreshToken={refreshToken}
                task={data.taskDetail}
                onStartUpdate={onStartUpdate}
                onEndUpdate={onPrepareUpdate}
              />
            </View>

            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt16]}>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText>{moment(data.taskDetail.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
                  <CText style={cStyles.px5}>&#8594;</CText>
                  <Tooltip
                    backdropStyle={styles.con_backdrop}
                    visible={tooltipDelay}
                    onBackdropPress={toggleTooltipDelay}
                    anchor={() =>
                      <TouchableOpacity disabled={delay === 0} onPress={toggleTooltipDelay}>
                        <CText status={delay > 0 ? 'danger' : 'basic'}>
                          {moment(data.taskDetail.endDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
                        </CText>
                      </TouchableOpacity>
                    }>
                    {`${t('project_management:delay_date_1')} ${delay} ${t('project_management:delay_date_2')}`}
                  </Tooltip>
                </View>

                <CText category='c1' appearance="hint">
                  {t('project_management:estimated_time')}
                </CText>
              </View>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <Avatar size="tiny" source={Assets.iconUser} />
                  <CText style={cStyles.ml5}>{data.taskDetail.ownerName}</CText>
                </View>
                <CText category='c1' appearance="hint">
                  {t('project_management:assignee')}
                </CText>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt16]}>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText status={Commons.PRIORITY_TASK[data.taskDetail.priority]['color']}>
                  {checkEmpty(data.taskDetail.priorityName)}
                </CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:piority')}
                </CText>
              </View>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.sectorName)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:sector')}
                </CText>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt16]}>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.gradeName)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:grade')}
                </CText>
              </View>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.componentName)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:component')}
                </CText>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt16]}>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.originPublisher)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:origin_publisher')}
                </CText>
              </View>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.ownershipDTP)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:owner_ship_dtp')}
                </CText>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt16]}>
              <View style={[cStyles.itemsStart, styles.con_flex]}>
                <CText>{checkEmpty(data.taskDetail.author)}</CText>
                <CText category='c1' appearance="hint">
                  {t('project_management:author')}
                </CText>
              </View>
            </View>


          </Layout>
        )}
      </KeyboardAwareScrollView>
      <CLoading
        show={
          loading.main ||
          loading.startFetch ||
          loading.startFetchLogin ||
          loading.fastWatch ||
          loading.update
        }
      />
    </CContainer>
  )
  return (
    <CContainer
      loading={loading.main}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_PROJECT}
      primaryColorShapesDark={colors.BG_HEADER_PROJECT_DARK}
      content={
        !loading.main ? (
          <>
            <KeyboardAwareScrollView
              contentInsetAdjustmentBehavior={'automatic'}>
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
                    onStartUpdate={onStartUpdate}
                    onEndUpdate={onPrepareUpdate}
                    onNeedUpdate={setNeedRefresh}
                  />
                )}

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
                        <View
                          style={[cStyles.flex1, cStyles.px16, cStyles.py10]}>
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
                              cStyles.p4,
                              cStyles.mx16,
                              cStyles.mb16,
                              cStyles.mt10,
                              cStyles.rounded1,
                              cStyles.borderDashed,
                              cStyles.borderAll,
                              isDark && cStyles.borderAllDark,
                            ]}>
                            {usersInvited.map((item, index) => {
                              return (
                                <View
                                  style={[
                                    cStyles.row,
                                    cStyles.itemsCenter,
                                    cStyles.mt6,
                                  ]}>
                                  <View
                                    key={item.userName}
                                    style={cStyles.shadowListItem}>
                                    <CTouchable
                                      onPress={() =>
                                        handleParticipant(item, true)
                                      }>
                                      <View
                                        style={[
                                          cStyles.row,
                                          cStyles.itemsCenter,
                                          cStyles.rounded1,
                                          cStyles.py6,
                                          cStyles.px8,
                                          {
                                            backgroundColor:
                                              colors.STATUS_NEW_OPACITY,
                                          },
                                        ]}>
                                        <View style={cStyles.pr6}>
                                          <CAvatar
                                            label={item.fullName}
                                            size={'vsmall'}
                                          />
                                        </View>
                                        <CText
                                          styles={'textCallout'}
                                          customLabel={checkEmpty(
                                            item.fullName,
                                          )}
                                        />
                                      </View>
                                    </CTouchable>
                                  </View>
                                  <View style={cStyles.mx2} />
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
                <CInvitedDetails participant={data.participantChoose} />
              }
              onClose={handleParticipant}
            />

            <CLoading visible={loading.update} />
          </>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.48},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},

  row_info_basic_left: {flex: 0.4},
  row_info_basic_right: {flex: 0.6},
  last_row_info_basic: {borderBottomWidth: 0},
  icon_completed: {height: moderateScale(300), width: '100%'},
});

export default Task;
