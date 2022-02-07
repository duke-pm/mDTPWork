/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/*
 ** Name: Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {Layout, Text, Tab , TabView} from "@ui-kitten/components";
import {View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CLoading from "~/components/CLoading";
import Overview from "../components/Overview";
import Activities from "../components/Activities";
import Watchers from "../components/Watchers";
/* COMMON */
import Routes from "~/navigator/Routes";
import FieldsAuth from "~/configs/fieldsAuth";
import {Commons} from "~/utils/common";
import {cStyles} from "~/utils/style";
import {
  REDUX_LOGIN,
  AST_LOGIN,
  AST_LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_4,
} from "~/configs/constants";
import {
  getLocalInfo,
  getSecretInfo,
  resetRoute,
} from "~/utils/helper";
/** REDUX */
import * as Actions from "~/redux/actions";

function Task(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  let taskID = route.params?.data?.taskID || -1;
  if (taskID === -1) taskID = route.params?.taskID || -1;
  const perChangeStatus = route.params?.data?.isUpdated || false;
  const onRefresh = route.params?.onRefresh || false;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState["language"];
  const formatDateView = commonState["formatDateView"];
  const refreshToken = authState[REDUX_LOGIN]["refreshToken"];
  const userName = authState[REDUX_LOGIN]["userName"];

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
  const onStartUpdate = () =>
    setLoading({...loading, update: true});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onChangeTab = newIdx => {
    setSelectedIndexTab(newIdx);
    if (newIdx === 1 && newComment) setNewComment(false);
  };

  const onFetchData = () => {
    let params = {
      TaskID: taskID,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onPrepareData = async () => {
    let taskDetail = projectState["taskDetail"];
    let activities = projectState["activities"];
    let watchers = projectState["watchers"];
    let isWatched = projectState["isWatched"];

    if (activities.length > 0) {
      let lastComment = await getLocalInfo(AST_LAST_COMMENT_TASK);
      if (lastComment && lastComment.length > 0) {
        let find = lastComment.findIndex(f => f.taskID === taskID);
        if (find !== -1) {
          if (lastComment[find].value < activities[activities.length - 1]["rowNum"]) {
            setNewComment(true);
          }
        } else setNewComment(true);
      } else setNewComment(true);
    }
    setData({...data, taskDetail, watchers});

    /** Find watcher */
    setIsFastWatch(!isWatched);
    return setLoading({
      ...loading,
      main: false,
      startFetch: false,
      startFetchLogin: false,
    });
  }

  const onPrepareWatch = () => {
    showMessage({
      message: t("common:app_name"),
      description: t(!isFastWatch
        ? "success:change_follow"
        : "success:change_unfollow"),
      type: "success",
      icon: "success",
    });
    return setLoading({...loading, fastWatch: false});
  };

  const onPrepareUpdate = isSuccess => {
    if (isSuccess) {
      if (!newComment) setNewComment(true);
      if (!needRefresh) setNeedRefresh(true);
      let taskDetail = projectState["taskDetail"];
      let watchers = projectState["watchers"];
      setData({...data, taskDetail, watchers});
      setLoading({...loading, update: false});
      return showMessage({
        message: t("common:app_name"),
        description: t("success:change_info"),
        type: "success",
        icon: "success",
      });
    } else setLoading({...loading, update: false});
  };

  const onError = desUpdate => {
    let des = !desUpdate
      ? t("error:detail_request")
      : t(desUpdate);
    showMessage({
      message: t("common:app_name"),
      description: des,
      type: "danger",
      icon: "danger",
    });

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
      console.log("[LOG] === SignIn Local === ", dataLogin);
      let i,
        tmpDataLogin = {
          tokenInfo: {},
          lstMenu: {},
        };

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

  const shouldLoadComponent = index => index === selectedIndexTab;

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState["successLogin"];
    if (isLogin && !loading.startFetchLogin) {
      onFetchData();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState["submitting"]) {
        if (authState["successLogin"]) {
          return onFetchData();
        }
        if (authState["errorLogin"]) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetchLogin,
    authState["submitting"],
    authState["successLogin"],
    authState["errorLogin"],
  ]);

  useEffect(() => {
    if (loading.startFetch) {
      if (!projectState["submittingTaskDetail"]) {
        if (projectState["successTaskDetail"]) {
          return onPrepareData();
        }

        if (projectState["errorTaskDetail"]) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    projectState["submittingTaskDetail"],
    projectState["successTaskDetail"],
    projectState["errorTaskDetail"],
  ]);

  useEffect(() => {
    if (loading.fastWatch) {
      if (!projectState["submittingTaskWatcher"]) {
        if (projectState["successTaskWatcher"]) {
          return onPrepareWatch();
        }

        if (projectState["errorTaskWatcher"]) {
          return onError("error:send_follow");
        }
      }
    }
  }, [
    loading.fastWatch,
    projectState["submittingTaskWatcher"],
    projectState["successTaskWatcher"],
    projectState["errorTaskWatcher"],
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("dismiss", e => {
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
      safeArea={["top"]}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          title={`${t("project_management:detail_task")} #${taskID}`}
          back
          onPressCustomBack={handleBack}
        />
      }>
      {/** Title & Type */}
      {!loading.main && data.taskDetail && (
        <Layout style={cStyles.px16}>
          <Text>
            <Text
              category="h6"
              status={Commons.TYPE_TASK[data.taskDetail.typeName]["color"]}>
              {data.taskDetail.typeName}
            </Text>
            <Text category="h6">
              {`  ${data.taskDetail.taskName}`}
            </Text>
          </Text>
        </Layout>
      )}

      {/** Author & Updated at */}
      {!loading.main && data.taskDetail && (
        <Layout style={[cStyles.px16, cStyles.pb10]}>
          <Text style={cStyles.mt10}>
            {(!data.taskDetail.crtdUser ||
              data.taskDetail.crtdUser === "") && (
              <Text category="label">{`#${data.taskDetail.taskID} `}</Text>
            )}
            {data.taskDetail.crtdUser &&
              data.taskDetail.crtdUser !== "" && (
                <Text>
                  <Text category="label">{`#${data.taskDetail.taskID} `}</Text>
                  <Text category="c1">{t("project_management:created_by")}</Text>
                  <Text category="c1">{` ${moment(
                    data.taskDetail.crtdDate,
                    DEFAULT_FORMAT_DATE_4,
                  ).format(formatDateView)} `}</Text>
                  <Text category="c1">{t("project_management:created_by_2")}</Text>
                  <Text category="label" status="primary">
                    {` ${data.taskDetail.crtdUser}`}
                  </Text>
                </Text>
              )}
          </Text>
          <Text style={cStyles.mt10} category="c1">
            {`${t(
              "project_management:last_updated_at",
            )} ${moment(
              data.taskDetail.lUpdDate,
              DEFAULT_FORMAT_DATE_4,
            ).format(formatDateView)} ${t(
              "project_management:assignee_by",
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
        <Tab title={t("project_management:info_basic")}>
          <Layout style={cStyles.flex1} level="2">
            <Overview
              loading={loading.main}
              update={loading.update}
              permissionChangeStatus={perChangeStatus}
              language={language}
              refreshToken={refreshToken}
              formatDateView={formatDateView}
              navigation={navigation}
              task={data.taskDetail}
              onStartUpdate={onStartUpdate}
              onEndUpdate={onPrepareUpdate}
              onNeedUpdate={setNeedRefresh}
            />
          </Layout>
        </Tab>

        <Tab title={propsT =>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Text style={propsT.style}>{t("project_management:title_activity")}</Text>
            {newComment && (
              <View style={[cStyles.ml5, cStyles.px3, cStyles.rounded2, {backgroundColor: "red"}]}>
                <Text category="label" status="control">{t("common:new").toUpperCase()}</Text>
              </View>
            )}
          </View>
        }>
          <Layout style={cStyles.flex1}>
            <Activities
              navigation={navigation}
              formatDateView={formatDateView}
              taskID={data.taskDetail ? data.taskDetail.taskID : -1}
            />
          </Layout>
        </Tab>

        <Tab title={t("project_management:title_watcher")}>
          <Layout style={cStyles.flex1} level="2">
            <Watchers
              navigation={navigation}
              formatDateView={formatDateView}
              taskID={data.taskDetail ? data.taskDetail.taskID : -1}
            />
          </Layout>
        </Tab>
      </TabView>

      <CLoading
        show={
          loading.startFetch ||
          loading.startFetchLogin ||
          loading.update ||
          loading.fastWatch
        }
        description={loading.update ? "common:doing_update" : undefined}
      />
    </CContainer>
  );
}

export default Task;
