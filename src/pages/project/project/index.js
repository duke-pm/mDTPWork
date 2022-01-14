/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {View} from "react-native";
import {showMessage} from "react-native-flash-message";
import moment from "moment";
import "moment/locale/en-sg";
/** COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import ListProject from "../list/Project";
import Filter from "../components/Filter";
/** COMMON */
import Configs from "~/configs";
import {
  LOAD_MORE,
  REFRESH,
} from "~/configs/constants";
/** REDUX */
import * as Actions from "~/redux/actions";

function Project(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;
  const projectID = route.params?.projectID || null;
  const yearFilter = route.params?.year || moment().year();

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
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    year: yearFilter,
    statusID: null,
    ownerID: null,
    page: 1,
    search: "",
    projects: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFilter = (
    year = moment().year(),
    activeOwner = null,
    activeStatus = null,
    toggle = () => null,
  ) => {
    toggle();
    onFetchData(
      year,
      activeOwner,
      activeStatus,
      perPageMaster,
      1,
      "",
    );
    setLoading({...loading, startFetch: true});
    return setData({
      ...data,
      year,
      ownerID: activeOwner,
      statusID: activeStatus,
    });
  };

  /**********
   ** FUNC **
   **********/
  const onFetchData = (
    year = data.year,
    ownerID = null,
    statusID = null,
    perPage = perPageMaster,
    page = 1,
    search = "",
  ) => {
    let params = {
      ProjectID: projectID,
      Year: year,
      OwnerID: ownerID,
      StatusID: statusID,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    };
    return dispatch(Actions.fetchListProject(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpProjects = [...data.projects];
    // Prepare data projects
    let projects = projectState["projects"];
    let pagesProjects = projectState["pagesProjects"];
    // Check if count result < perPage => loadmore is unavailable
    if (data.page >= pagesProjects) {
      isLoadmore = false;
    }
    // Check type fetch is refresh or loadmore
    if (type === REFRESH) {
      tmpProjects = projects;
    } else if (type === LOAD_MORE) {
      tmpProjects = [...tmpProjects, ...projects];
    }
    setData({...data, projects: tmpProjects});
    return setLoading({
      main: false,
      refreshing: false,
      startFetch: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onError = () => {
    showMessage({
      message: t("common:app_name"),
      description: t("error:list_request"),
      type: "danger",
      icon: "danger",
    });
    return setLoading({
      main: false,
      refreshing: false,
      startFetch: false,
      loadmore: false,
      isLoadmore: false,
    });
  };

  const onRefreshProjects = () => {
    if (!loading.refreshing) {
      onFetchData(
        data.year,
        data.ownerID,
        data.statusID,
        perPageMaster,
        1,
        data.search,
      );
      setLoading({
        ...loading,
        refreshing: true,
        isLoadmore: true,
      });
      return setData({...data, page: 1});
    }
  };

  const onLoadmoreProjects = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      onFetchData(
        data.year,
        data.ownerID,
        data.statusID,
        perPageMaster,
        newPage,
        data.search,
      );
      setLoading({...loading, loadmore: true});
      return setData({...data, page: newPage});
    }
  };

  const onSearch = value => {
    onFetchData(
      data.year,
      data.ownerID,
      data.statusID,
      perPageMaster,
      1,
      value,
    );
    setLoading({...loading, startFetch: true});
    return setData({...data, page: 1});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onFetchData();
    setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!projectState["submittingListProject"]) {
        if (projectState["successListProject"]) {
          let type = REFRESH;
          if (loading.loadmore) {
            type = LOAD_MORE;
          }
          return onPrepareData(type);
        }
        if (projectState["errorListProject"]) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    projectState["submittingListProject"],
    projectState["successListProject"],
    projectState["errorListProject"],
  ]);

  /************
   ** RENDER **
   ************/
  let title = "project_management:title";
  if (projectID) {
    title = `${t("project_management:project_parent")} #${projectID}`;
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
          arrayBackProject={projectID !== null}
          borderBottom
          searchFilter
          onSearch={onSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isYear={true}
                isSector={false}
                data={data}
                masterData={{
                  users: masterState["users"],
                  status: masterState["projectStatus"],
                  sectors: masterState["projectSector"],
                }}
                onFilter={(year, sector, activeOwner, activeStatus) =>
                  handleFilter(year, activeOwner, activeStatus, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** Content */}
      {!loading.main && !loading.startFetch && (
        <ListProject
          formatDateView={formatDateView}
          year={data.year}
          data={data.projects}
          loadmore={loading.loadmore}
          refreshing={loading.refreshing}
          onRefresh={onRefreshProjects}
          onLoadmore={onLoadmoreProjects}
        />
      )}
    </CContainer>
  );
}

export default Project;
