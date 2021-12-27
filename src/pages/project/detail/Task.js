/* eslint-disable eqeqeq */
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import {
  useTheme, Layout, Text, Avatar, Tooltip, Icon,
  ListItem, Tab , TabView,
} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CAvatar from '~/components/CAvatar';
import CLoading from '~/components/CLoading';
import CText from '~/components/CText';
import FileAttach from '../components/FileAttach';
import Status from '../components/Status';
import Percentage from '../components/Percentage';
import Activities from '../components/Activities';
import Watchers from '../components/Watchers';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Commons} from '~/utils/common';
import {Assets} from '~/utils/asset';
import {usePrevious} from '~/utils/hook';
import {colors, cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4, AST_LAST_COMMENT_TASK, AST_LOGIN,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';
import {
  getLocalInfo, checkEmpty, getSecretInfo, resetRoute,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';


const RenderDescriptionIcon = props => (
  <Icon {...props} name="menu-2-outline" />
);

const RenderStatusIcon = props => (
  <Icon {...props} name="flash-outline" />
);

const RenderProjectIcon = props => (
  <Icon {...props} name="file-text-outline" />
);

const RenderTimeIcon = props => (
  <Icon {...props} name="clock-outline" />
);

const RenderPercentIcon = props => (
  <Icon {...props} name="navigation-2-outline" />
);

const RenderPersonIcon = props => (
  <Icon {...props} name="person-outline" />
);

const RenderPeopleIcon = props => (
  <Icon {...props} name="people-outline" />
);

const RenderPiorityIcon = props => (
  <Icon {...props} name="heart-outline" />
);

const RenderSectorIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderGradeIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderComponentIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderPushlisherIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderOwnershipIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderFileIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderAuthorIcon = props => (
  <Icon {...props} name="person-outline" />
);

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
  const [selectedIndexTab, setSelectedIndexTab] = useState(0);
  
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
    watchers: [],
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
    let watchers = projectState.get('watchers');
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
    setData({...data, taskDetail, watchers});
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
      let watchers = projectState.get('watchers');
      setData({...data, taskDetail, watchers});
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

  const shouldLoadComponent = (index) => index === selectedIndexTab;

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
  let delay = 0,
    showPercentage = data.taskDetail?.taskTypeID === Commons.TYPE_TASK.TASK.value,
    arrAvatarParticipant = [];
  if (
    data.taskDetail &&
    showPercentage &&
    data.taskDetail.statusID < Commons.STATUS_TASK["5"]["value"]
  ) {
    if (data.taskDetail.endDate && data.taskDetail.endDate !== '') {
      delay = moment().diff(data.taskDetail.endDate, 'days');
    }
  }
  if (data.taskDetail &&
      data.taskDetail.lstUserInvited.length > 0) {
    arrAvatarParticipant = data.taskDetail.lstUserInvited.map(itemA =>
      Assets.iconUser
    );
  }
  return (
    <CContainer
      safeArea={['top']}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          title={`${t('project_management:detail_task')} #${taskID}`}
          back
        />
      }>
      {/** Title & Type */}
      {!loading.main && data.taskDetail && (
        <Layout style={cStyles.px16}>
          <Text>
            <Text category="h6" status={Commons.TYPE_TASK[data.taskDetail.typeName]['color']}>
              {data.taskDetail.typeName}
            </Text>
            <Text category="h6">{`  ${data.taskDetail.taskName}`}</Text>
          </Text>
        </Layout>
      )}

      {/** Author & Updated at */}
      {!loading.main && data.taskDetail && (
        <Layout style={[cStyles.px16, cStyles.pb20]}>
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
          </Text>
          <Text  style={cStyles.mt10} category="c1">
            {`${t(
              'project_management:last_updated_at',
            )} ${moment(
              data.taskDetail.lUpdDate,
              DEFAULT_FORMAT_DATE_4,
            ).format(DEFAULT_FORMAT_DATE_9)} ${t(
              'project_management:assignee_by',
            )} `}
            <Text category="label" status="primary">{`${data.taskDetail.lUpdUser}`}</Text>
          </Text>
        </Layout>
      )}

      <TabView
        style={cStyles.flex1}
        swipeEnabled={false}
        selectedIndex={selectedIndexTab}
        onSelect={index => setSelectedIndexTab(index)}
        shouldLoadComponent={shouldLoadComponent}>
        <Tab title={t('project_management:info_basic')}>
          <Layout style={cStyles.flex1}>
            <KeyboardAwareScrollView
              contentInsetAdjustmentBehavior={'automatic'}>
              {!loading.main && (
                <Layout style={[cStyles.flex1, cStyles.py10, cStyles.pr10]}>
                  {data.taskDetail.taskTypeID !==
                    Commons.TYPE_TASK.MILESTONE.value && (
                    <ListItem
                      title={propsT =>
                        <Text appearance="hint">{t('project_management:status')}</Text>}
                      accessoryLeft={RenderStatusIcon}
                      accessoryRight={propsR =>
                        <Status
                          disabled={loading.preview || loading.update}
                          isUpdate={perChangeStatus}
                          language={language}
                          refreshToken={refreshToken}
                          navigation={navigation}
                          task={data.taskDetail}
                          onStartUpdate={onStartUpdate}
                          onEndUpdate={onPrepareUpdate}
                          onNeedUpdate={setNeedRefresh}
                        />
                      }
                    />
                  )}
                  
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:main_title')}</Text>}
                    accessoryLeft={RenderProjectIcon}
                    accessoryRight={propsR =>
                      <View>
                        <Text>{data.taskDetail.prjName}</Text>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:estimated_time')}</Text>}
                    accessoryLeft={RenderTimeIcon}
                    accessoryRight={propsR =>
                      <View style={[cStyles.row, cStyles.itemsCenter]}>
                        <CText>{moment(data.taskDetail.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
                        <Text>  &#8594;  </Text>
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
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:holder_task_percentage')}</Text>}
                    accessoryLeft={RenderPercentIcon}
                    accessoryRight={propsR =>
                      <Percentage
                        disabled={loading.preview}
                        navigation={navigation}
                        language={language}
                        refreshToken={refreshToken}
                        task={data.taskDetail}
                        onStartUpdate={onStartUpdate}
                        onEndUpdate={onPrepareUpdate}
                      />
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:assignee')}</Text>}
                    accessoryLeft={RenderPersonIcon}
                    accessoryRight={propsR =>
                      <View style={[cStyles.row, cStyles.itemsCenter]}>
                        <Avatar size="tiny" source={Assets.iconUser} />
                        <CText style={cStyles.ml10}>{data.taskDetail.ownerName}</CText>
                      </View>
                    }
                  />
                  {arrAvatarParticipant.length > 0 && (
                    <ListItem
                      title={propsT =>
                        <Text appearance="hint">{t('project_management:user_invited')}</Text>}
                      accessoryLeft={RenderPeopleIcon}
                      accessoryRight={propsR =>
                        <CAvatar
                          style={cStyles.justifyEnd}
                          absolute={false}
                          sources={arrAvatarParticipant}
                          size="tiny"
                        />
                      }
                    />
                  )}
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:piority')}</Text>}
                    accessoryLeft={RenderPiorityIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText status={Commons.PRIORITY_TASK[data.taskDetail.priority]['color']}>
                          {checkEmpty(data.taskDetail.priorityName)}
                        </CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:sector')}</Text>}
                    accessoryLeft={RenderSectorIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.sectorName)}</CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:grade')}</Text>}
                    accessoryLeft={RenderGradeIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.gradeName)}</CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:component')}</Text>}
                    accessoryLeft={RenderComponentIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.componentName)}</CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:origin_publisher')}</Text>}
                    accessoryLeft={RenderPushlisherIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.originPublisher)}</CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:owner_ship_dtp')}</Text>}
                    accessoryLeft={RenderOwnershipIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.ownershipDTP)}</CText>
                      </View>
                    }
                  />
                  <ListItem
                    title={propsT =>
                      <Text appearance="hint">{t('project_management:author')}</Text>}
                    accessoryLeft={RenderAuthorIcon}
                    accessoryRight={propsR =>
                      <View>
                        <CText>{checkEmpty(data.taskDetail.author)}</CText>
                      </View>
                    }
                  />
                  {data.taskDetail.attachFiles !== '' && (
                    <ListItem
                      title={propsT =>
                        <Text appearance="hint">{t('project_management:files_attach')}</Text>}
                      accessoryLeft={RenderFileIcon}
                      accessoryRight={propsR =>
                        <View style={cStyles.flex1}>
                          <FileAttach file={data.taskDetail.attachFiles} />
                        </View>
                      }
                    />
                  )}
                  <ListItem
                    style={cStyles.itemsStart}
                    title={propsT =>
                      <Text style={cStyles.mt5} appearance="hint">{t('project_management:description')}</Text>}
                    description={propsD =>
                      <View style={cStyles.mt10}>
                        <CText>
                          {checkEmpty(data.taskDetail.descr, t('project_management:empty_description'))}
                        </CText>
                      </View>
                    }
                    accessoryLeft={RenderDescriptionIcon}
                  />
                </Layout>
              )}
            </KeyboardAwareScrollView>
          </Layout>
        </Tab>

        <Tab title={t('project_management:title_activity')}>
          <Layout style={cStyles.flex1}>
            <Activities
              taskID={data.taskDetail ? data.taskDetail.taskID : -1}
            />
          </Layout>
        </Tab>

        <Tab title={t('project_management:title_watcher')}>
          <Layout style={cStyles.flex1}>
            <Watchers
              taskID={data.taskDetail ? data.taskDetail.taskID : -1}
              watchers={data.watchers}
            />
          </Layout>
        </Tab>
      </TabView>

      <CLoading
        show={
          loading.startFetch ||
          loading.startFetchLogin ||
          loading.fastWatch ||
          loading.update
        }
      />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.48},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

export default Task;
