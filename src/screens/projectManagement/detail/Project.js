/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Detail screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {LayoutAnimation, UIManager} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CText from '~/components/CText';
import CIconHeader from '~/components/CIconHeader';
import ListTask from '../list/Task';
/** COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import Routes from '~/navigation/Routes';
import FieldsAuth from '~/config/fieldsAuth';
import {LOAD_MORE, LOGIN, REFRESH} from '~/config/constants';
import {getSecretInfo, IS_ANDROID, IS_IOS, resetRoute} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {usePrevious} from '~/utils/hook';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ProjectDetail(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {route, navigation} = props;
  let projectID = route.params?.data?.projectID || -1;
  if (projectID === -1) {
    projectID = route.params?.projectID || -1;
  }

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
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
    startFetchLogin: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [showSearchBar, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState({
    activeOwner: [],
    activeStatus: [],
    activeSector: [],
  });
  const [data, setData] = useState({
    ownerID: null,
    statusID: null,
    sectorID: null,
    page: 1,
    search: '',
    tasks: [],
  });

  /** Use prev */
  let prevShowFilter = usePrevious(showFilter);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBack = () => resetRoute(navigation, Routes.ROOT_TAB.name);

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

  const handleShowFilter = () => {
    setShowSearch(false);
    return navigation.navigate(Routes.MAIN.PROJECT_FILTER.name, {
      hasYear: false,
      hasSector: true,
      activeOwner: showFilter.activeOwner,
      activeStatus: showFilter.activeStatus,
      activeSector: showFilter.activeSector,
      onFilter: (y, actOwn, actSta, actSec) =>
        handleFilter(actOwn, actSta, actSec),
    });
  };

  const handleFilter = (
    activeOwner = [],
    activeStatus = [],
    activeSector = [],
  ) => {
    return setShowFilter({
      activeOwner,
      activeStatus,
      activeSector,
    });
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    if (data.search !== '') {
      return handleSearch('');
    }
    return;
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
    search = '',
  ) => {
    let params = fromJS({
      PrjID: projectID,
      OwnerID: ownerID,
      StatusID: statusID,
      SectorID: sectorID,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListTask(params, navigation));
    if (
      (ownerID !== null || statusID !== null || sectorID !== null) &&
      !isFiltering
    ) {
      return setIsFiltering(true);
    } else if (
      statusID === null &&
      ownerID === null &&
      sectorID === null &&
      isFiltering
    ) {
      return setIsFiltering(false);
    }
    return;
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpTasks = [...data.tasks];

    // Prepare data tasks
    let tasks = projectState.get('tasks');
    let pagesTasks = projectState.get('pagesTasks');

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
    let dataLogin = await getSecretInfo(LOGIN);
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
    return resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
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
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          onFetchData();
          return setLoading({
            ...loading,
            startFetch: true,
            startFetchLogin: false,
          });
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
    if (prevShowFilter) {
      if (!loading.startFetch) {
        if (
          prevShowFilter.activeOwner.join() === showFilter.activeOwner.join() &&
          prevShowFilter.activeStatus.join() ===
            showFilter.activeStatus.join() &&
          prevShowFilter.activeSector.join() === showFilter.activeSector.join()
        ) {
          return;
        }
        let params = {ownerID: null, statusID: null, sectorID: null};
        if (showFilter.activeOwner.length > 0) {
          params.ownerID = showFilter.activeOwner.join();
        }
        if (showFilter.activeStatus.length > 0) {
          params.statusID = showFilter.activeStatus.join();
        }
        if (showFilter.activeSector.length > 0) {
          params.sectorID = showFilter.activeSector.join();
        }
        onFetchData(
          params.ownerID,
          params.statusID,
          params.sectorID,
          perPageMaster,
          1,
          data.search,
        );
        setData({
          ...data,
          ownerID: params.ownerID,
          statusID: params.statusID,
          sectorID: params.sectorID,
          page: 1,
        });
        setLoading({...loading, startFetch: true});
      }
    }
  }, [
    loading.startFetch,
    prevShowFilter,
    showFilter.activeOwner,
    showFilter.activeStatus,
    showFilter.activeSector,
  ]);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!projectState.get('submittingListTask')) {
        if (projectState.get('successListTask')) {
          let type = REFRESH;
          if (loading.loadmore) {
            type = LOAD_MORE;
          }
          return onPrepareData(type);
        }

        if (projectState.get('errorListTask')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    projectState.get('submittingListTask'),
    projectState.get('successListTask'),
    projectState.get('errorListTask'),
  ]);

  useLayoutEffect(() => {
    navigation.setOptions(
      Object.assign(
        {
          title: `${t('project_management:list_task')}${projectID}`,
          backButtonInCustomView: true,
          headerLeft: () =>
            (route.params?.projectID !== null ||
              route.params?.projectID !== undefined) && (
              <CIconHeader
                icons={[
                  {
                    show: !navigation.canGoBack(),
                    showRedDot: false,
                    icon: IS_IOS ? Icons.backiOS : Icons.backAndroid,
                    iconColor: customColors.icon,
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
                  showRedDot: data.search !== '',
                  icon: Icons.search,
                  onPress: handleOpenSearch,
                },
                {
                  show: true,
                  showRedDot: isFiltering,
                  icon: Icons.filter,
                  onPress: handleShowFilter,
                },
              ]}
            />
          ),
        },
        IS_ANDROID
          ? {
              headerCenter: () => (
                <CText
                  customStyles={cStyles.textHeadline}
                  customLabel={`${t(
                    'project_management:list_task',
                  )}${projectID}`}
                />
              ),
            }
          : {},
      ),
    );
  }, [
    navigation,
    data.search,
    showFilter.activeOwner,
    showFilter.activeStatus,
    showFilter.activeSector,
    isFiltering,
    navigation.canGoBack,
    route.params?.projectID,
    projectID,
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_PROJECT}
      primaryColorShapesDark={colors.BG_HEADER_PROJECT_DARK}
      content={
        <CContent scrollEnabled={false}>
          <CSearchBar
            loading={loading.startFetch}
            isVisible={showSearchBar}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />
          {!loading.main && !loading.startFetch && (
            <ListTask
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              data={data.tasks}
              onRefreshTasks={onRefreshTasks}
              onLoadmore={onLoadmoreTasks}
            />
          )}
        </CContent>
      }
    />
  );
}

export default ProjectDetail;
