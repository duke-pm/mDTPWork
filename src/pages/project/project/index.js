/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CLoading from '~/components/CLoading';
import ListProject from '../list/Project';
import Filter from '../components/Filter';
/** COMMON */
import Configs from '~/configs';
import {LOAD_MORE, REFRESH} from '~/configs/constants';
/** REDUX */
import * as Actions from '~/redux/actions';

function Project(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;
  const projectID = route.params?.projectID || null;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
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
    year: moment().year(),
    statusID: null,
    ownerID: null,
    page: 1,
    search: '',
    projects: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = value => {
    setData({...data, page: 1});
    onFetchData(
      data.year,
      data.ownerID,
      data.statusID,
      perPageMaster,
      1,
      value,
    );
    setLoading({...loading, startFetch: true});
  };

  const handleFilter = (
    year = moment().year(),
    activeOwner = null,
    activeStatus = null,
    toggle = () => null,
  ) => {
    toggle();
    setData({
      ...data,
      year,
      ownerID: activeOwner,
      statusID: activeStatus,
    });
    onFetchData(
      year,
      activeOwner,
      activeStatus,
      perPageMaster,
      1,
      '',
    );
    return setLoading({...loading, startFetch: true});
  };

  /**********
   ** FUNC **
   **********/
  const onFetchMasterData = () => {
    let paramsMaster = {
      ListType: 'Users, PrjSector, PrjStatus',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(paramsMaster, navigation));
  };

  const onFetchData = (
    year = data.year,
    ownerID = null,
    statusID = null,
    perPage = perPageMaster,
    page = 1,
    search = '',
  ) => {
    let params = fromJS({
      ProjectID: projectID,
      Year: year,
      OwnerID: ownerID,
      StatusID: statusID,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListProject(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpProjects = [...data.projects];
    // Prepare data projects
    let projects = projectState.get('projects');
    let pagesProjects = projectState.get('pagesProjects');
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
    return onDone(isLoadmore);
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
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

  const onRefreshProjects = () => {
    if (!loading.refreshing) {
      setData({...data, page: 1});
      onFetchData(
        data.year,
        data.ownerID,
        data.statusID,
        perPageMaster,
        1,
        data.search,
      );
      setLoading({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onLoadmoreProjects = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(
        data.year,
        data.ownerID,
        data.statusID,
        perPageMaster,
        newPage,
        data.search,
      );
      setLoading({...loading, loadmore: true});
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onFetchMasterData();
    onFetchData();
    setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!projectState.get('submittingListProject')) {
        if (projectState.get('successListProject')) {
          if (masterState.get('users').length > 0) {
            let type = REFRESH;
            if (loading.loadmore) {
              type = LOAD_MORE;
            }
            return onPrepareData(type);
          }
        }
        if (projectState.get('errorListProject')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    projectState.get('submittingListProject'),
    projectState.get('successListProject'),
    projectState.get('errorListProject'),
    masterState.get('users'),
  ]);

  /************
   ** RENDER **
   ************/
  let title = 'project_management:title';
  if (projectID) {
    title = `${t('project_management:project_parent')} #${projectID}`;
  }
  return (
    <CContainer
      safeArea={['top', 'bottom']}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          loading={loading.startFetch}
          title={title}
          back
          borderBottom
          searchFilter
          onSearch={handleSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isYear={true}
                isSector={false}
                data={data}
                masterData={{
                  users: masterState.get('users'),
                  status: masterState.get('projectStatus'),
                  sectors: masterState.get('projectSector')
                }}
                onFilter={(year, sector, activeOwner, activeStatus) =>
                  handleFilter(year, activeOwner, activeStatus, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {!loading.main && (
        <ListProject
          data={data.projects}
          loadmore={loading.loadmore}
          refreshing={loading.refreshing}
          onRefresh={onRefreshProjects}
          onLoadmore={onLoadmoreProjects}
        />
      )}

      <CLoading show={loading.startFetch} />
    </CContainer>
  );
}

export default Project;
