/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Detail screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {View} from "react-native";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import Filter from "../components/Filter";
import ListTask from "../list/Task";
/** COMMON */
import Configs from "~/configs";
import Routes from "~/navigator/Routes";
import FieldsAuth from "~/configs/fieldsAuth";
import {getSecretInfo, resetRoute} from "~/utils/helper";
import {
  REFRESH,
  LOAD_MORE,
  AST_LOGIN,
} from "~/configs/constants";
/** REDUX */
import * as Actions from "~/redux/actions";

function ProjectDetail(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  let projectID = route.params?.data?.projectID || -1; // for navigate from projects page
  if (projectID === -1) {
    projectID = route.params?.projectID || -1; // for deeplink from email
  }
  const taskID = route.params?.data?.taskID || null; // for navigate from projects page

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState["language"];
  const formatDateView = commonState["formatDateView"];
  const refreshToken = authState["login"]["refreshToken"];
  const perPageMaster = Configs.perPageProjects;

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    refreshing: false,
    startFetch: false,
    startFetchLogin: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    ownerID: null,
    statusID: null,
    sectorID: null,
    page: 1,
    search: "",
    tasks: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBack = () => resetRoute(navigation, Routes.TAB.name);

  const handleSearch = value => {
    setData({...data, page: 1, search: value});
    onFetchData(
      data.ownerID,
      data.statusID,
      data.sectorID,
      perPageMaster,
      1,
      value,
    );
    return setLoading({...loading, startFetch: true});
  };

  const handleFilter = (
    activeSector = null,
    activeOwner = null,
    activeStatus = null,
    toggle = () => null,
  ) => {
    toggle();
    setData({
      ...data,
      sectorID: activeSector,
      ownerID: activeOwner,
      statusID: activeStatus,
    });
    onFetchData(
      activeOwner,
      activeStatus,
      activeSector,
      perPageMaster,
      1,
      "",
    );
    return setLoading({...loading, startFetch: true});
  };

  /**********
   ** FUNC **
   **********/
  const onFetchData = (
    ownerID = null,
    statusID = null,
    sectorID = null,
    perPage = perPageMaster,
    page = 1,
    search = "",
  ) => {
    let params = {
      TaskParentID: taskID,
      PrjID: projectID,
      OwnerID: ownerID,
      StatusID: statusID,
      SectorID: sectorID,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchListTask(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpTasks = [...data.tasks];

    // Prepare data tasks
    let tasks = projectState["tasks"];
    let pagesTasks = projectState["pagesTasks"];

    // Check if count result < perPage => loadmore is unavailable
    if (data.page >= pagesTasks) {
      isLoadmore = false;
    }

    // Check type fetch is refresh or loadmore
    if (type === REFRESH) {
      tmpTasks = onRecursiveData([], tasks);
    } else if (type === LOAD_MORE) {
      tmpTasks = onRecursiveData(tmpTasks, tasks);
    }
    setData({...data, tasks: tmpTasks});

    return onDone(isLoadmore);
  };

  const onRecursiveData = (currentData, newData) => {
    let endData = currentData;
    let endData2 = [];
    if (currentData.length > 0) {
      if (newData.length > 0) {
        let item1 = null,
          item2 = null,
          tmpData1 = [];
        for (item1 of currentData) {
          for (item2 of newData) {
            if (item2.parentID !== 0) {
              if (item1.taskID === item2.parentID) {
                item1.lstTaskItem.push(item2);
              } else if (item1.lstTaskItem.length > 0) {
                onRecursiveData(item1.lstTaskItem, tmpData1);
              }
            } else {
              endData2.push(item2);
            }
          }
        }
        return [...endData, ...endData2];
      } else {
        return endData;
      }
    } else {
      return newData;
    }
  };

  const onError = () => {
    showMessage({
      message: t("common:app_name"),
      description: t("error:list_request"),
      type: "danger",
      icon: "danger",
    });
    return onDone(false);
  };

  const onDone = isLoadmore => {
    return setLoading({
      main: false,
      refreshing: false,
      startFetch: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefreshTasks = () => {
    if (!loading.refreshing) {
      setData({...data, page: 1});
      onFetchData(
        data.ownerID,
        data.statusID,
        data.sectorID,
        perPageMaster,
        1,
        data.search,
      );
      return setLoading({...loading, refreshing: true, isLoadmore: true});
    }
    return;
  };

  const onLoadmoreTasks = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(
        data.ownerID,
        data.statusID,
        data.sectorID,
        perPageMaster,
        newPage,
        data.search,
      );
      return setLoading({...loading, loadmore: true});
    }
    return;
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(AST_LOGIN);
    if (dataLogin) {
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

  const onGoToSignIn = () => {
    return resetRoute(navigation, Routes.LOGIN_IN.name);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState["successLogin"];
    if (isLogin && !loading.startFetchLogin) {
      onFetchData();
      setLoading({...loading, startFetch: true});
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState["submitting"]) {
        if (authState["successLogin"]) {
          onFetchData();
          return setLoading({
            ...loading,
            startFetch: true,
            startFetchLogin: false,
          });
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
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!projectState["submittingListTask"]) {
        if (projectState["successListTask"]) {
          let type = REFRESH;
          if (loading.loadmore) {
            type = LOAD_MORE;
          }
          return onPrepareData(type);
        }

        if (projectState["errorListTask"]) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    projectState["submittingListTask"],
    projectState["successListTask"],
    projectState["errorListTask"],
  ]);

  /************
   ** RENDER **
   ************/
  let title = `${t("project_management:list_task")} #${projectID}`;
  if (taskID) {
    title = `${t("project_management:task_parent")} #${taskID}`;
  }
  return (
    <CContainer
      safeArea={["top", "bottom"]}
      loading={loading.main || loading.startFetch}
      headerComponent={
        <CTopNavigation
          loading={loading.startFetch}
          title={title}
          back
          arrayBackTask={taskID !== null}
          borderBottom
          searchFilter
          onSearch={handleSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isYear={false}
                isSector={true}
                data={data}
                masterData={{
                  users: masterState["users"],
                  status: masterState["projectStatus"],
                  sectors: masterState["projectSector"],
                }}
                onFilter={(year, sector, activeOwner, activeStatus) =>
                  handleFilter(sector, activeOwner, activeStatus, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** Content */}
      {!loading.main && !loading.startFetch && (
        <ListTask
          formatDateView={formatDateView}
          data={data.tasks}
          loadmore={loading.loadmore}
          refreshing={loading.refreshing}
          onRefreshTasks={onRefreshTasks}
          onLoadmore={onLoadmoreTasks}
        />
      )}
    </CContainer>
  );
}

export default ProjectDetail;
