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
import {showMessage} from 'react-native-flash-message';
import {
  Layout, Text, Tab , TabView,
} from '@ui-kitten/components';
import {View} from 'react-native';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CLoading from '~/components/CLoading';
import Overview from '../components/Overview';
import Activities from '../components/Activities';
import Watchers from '../components/Watchers';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {
  AST_LOGIN,
  AST_LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';
import {
  getLocalInfo,
  getSecretInfo,
  resetRoute,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

function Task(props) {
  const {t} = useTranslation();
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
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const userName = authState.getIn(['login', 'userName']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    startFetchLogin: false,
    update: false,
    fastWatch: false,
  });
  const [selectedIndexTab, setSelectedIndexTab] = useState(0);
  const [newComment, setNewComment] = useState(false);
  const [isFastWatch, setIsFastWatch] = useState(true);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [data, setData] = useState({
    taskDetail: null,
    watchers: [],
    participantChoose: null,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
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

  const handleBack = () => {
    if (onRefresh && needRefresh) onRefresh();
    navigation.goBack();
  };

  /**********
   ** FUNC **
   **********/
  const onStart = () => onFetchData();

  const onStartUpdate = () => setLoading({...loading, update: true});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onChangeTab = newIdx => {
    setSelectedIndexTab(newIdx);
    if (newIdx === 1 && newComment) setNewComment(false);
  };

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
      if (!newComment) setNewComment(true);
      if (!needRefresh) setNeedRefresh(true);
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
    const unsubscribe = navigation.addListener('dismiss', e => {
      if (needRefresh && onRefresh) {
        onRefresh();
      }
    });
    return unsubscribe;
  }, [navigation, needRefresh]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          title={`${t('project_management:detail_task')} #${taskID}`}
          back
          onPressCustomBack={handleBack}
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
        <Layout style={[cStyles.px16, cStyles.pb10]}>
          <Text style={cStyles.mt10}>
            {(!data.taskDetail.crtdUser ||
              data.taskDetail.crtdUser === '') && (
              <Text category="label">{`#${data.taskDetail.taskID} `}</Text>
            )}
            {data.taskDetail.crtdUser &&
              data.taskDetail.crtdUser !== '' && (
                <Text>
                  <Text category="label">{`#${data.taskDetail.taskID} `}</Text>
                  <Text category="c1">{t('project_management:created_by',)}</Text>
                  <Text category="label" status="primary">
                    {` ${data.taskDetail.crtdUser}`}
                  </Text>
                </Text>
              )}
          </Text>
          <Text style={cStyles.mt10} category="c1">
            {`${t(
              'project_management:last_updated_at',
            )} ${moment(
              data.taskDetail.lUpdDate,
              DEFAULT_FORMAT_DATE_4,
            ).format(DEFAULT_FORMAT_DATE_9)} ${t(
              'project_management:assignee_by',
            )} `}
            <Text category="label" status="primary">
              {`${data.taskDetail.lUpdUser}`}
            </Text>
          </Text>
        </Layout>
      )}

      <TabView
        style={cStyles.flex1}
        selectedIndex={selectedIndexTab}
        onSelect={onChangeTab}
        shouldLoadComponent={shouldLoadComponent}>
        <Tab title={t('project_management:info_basic')}>
          <Layout style={cStyles.flex1}>
            <Overview
              loading={loading.main}
              update={loading.update}
              permissionChangeStatus={perChangeStatus}
              language={language}
              refreshToken={refreshToken}
              navigation={navigation}
              task={data.taskDetail}
              onStartUpdate={onStartUpdate}
              onEndUpdate={onPrepareUpdate}
              onNeedUpdate={setNeedRefresh}
            />
          </Layout>
        </Tab>

        <Tab
          title={propsT =>
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <Text style={propsT.style}>{t('project_management:title_activity')}</Text>
              {newComment && (
                <View style={[cStyles.ml5, cStyles.px3, cStyles.rounded2, {backgroundColor: 'red'}]}>
                  <Text category="label" status="control">{t('common:new').toUpperCase()}</Text>
                </View>
              )}
            </View>
          }>
          <Layout style={cStyles.flex1}>
            <Activities
              navigation={navigation}
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

export default Task;
