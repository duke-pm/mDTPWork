/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {LayoutAnimation, UIManager} from 'react-native';
import moment from 'moment';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CIconHeader from '~/components/CIconHeader';
import ListProject from '../list/Project';
/** COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import Routes from '~/navigation/Routes';
import {LOAD_MORE, REFRESH} from '~/config/constants';
import {IS_ANDROID} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
import {colors} from '~/utils/style';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Project(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDateView = commonState.get('formatDateView');
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
  const [isFiltering, setIsFiltering] = useState(false);
  const [showSearchBar, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState({
    activeOwner: [],
    activeStatus: [],
  });
  const [data, setData] = useState({
    year: moment().year(),
    statusID: null,
    ownerID: null,
    page: 1,
    search: '',
    projects: [],
  });

  /** Use prev */
  let prevShowFilter = usePrevious(showFilter);
  let prevYear = usePrevious(data.year);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = value => {
    setData({...data, page: 1, search: value});
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

  const handleShowFilter = () => {
    navigation.navigate(Routes.MAIN.PROJECT_FILTER.name, {
      hasYear: true,
      hasSector: false,
      activeYear: data.year,
      activeOwner: showFilter.activeOwner,
      activeStatus: showFilter.activeStatus,
      onFilter: (y, actOwn, actSta, actSec) =>
        handleFilter(y, actOwn, actSta, actSec),
    });
  };

  const handleFilter = (
    year = moment().year(),
    activeOwner = [],
    activeStatus = [],
  ) => {
    if (year !== data.year) {
      setData({...data, year});
    }
    setShowFilter({activeOwner, activeStatus});
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    if (data.search !== '') {
      handleSearch('');
    }
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
    if (
      (statusID !== null || ownerID !== null || year != moment().year()) &&
      !isFiltering
    ) {
      setIsFiltering(true);
    } else if (
      statusID === null &&
      ownerID === null &&
      year == moment().year() &&
      isFiltering
    ) {
      setIsFiltering(false);
    }
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
    if (prevShowFilter && prevYear) {
      if (!loading.startFetch) {
        if (
          prevShowFilter.activeOwner.join() === showFilter.activeOwner.join() &&
          prevShowFilter.activeStatus.join() ===
            showFilter.activeStatus.join() &&
          prevYear === data.year
        ) {
          return;
        }
        let params = {ownerID: null, statusID: null};
        if (showFilter.activeOwner.length > 0) {
          params.ownerID = showFilter.activeOwner.join();
        }
        if (showFilter.activeStatus.length > 0) {
          params.statusID = showFilter.activeStatus.join();
        }
        onFetchData(
          data.year,
          params.ownerID,
          params.statusID,
          perPageMaster,
          1,
          data.search,
        );
        setData({
          ...data,
          ownerID: params.ownerID,
          statusID: params.statusID,
          page: 1,
        });
        setLoading({...loading, startFetch: true});
      }
    }
  }, [
    loading.startFetch,
    data.year,
    prevYear,
    prevShowFilter,
    showFilter.activeOwner,
    showFilter.activeStatus,
  ]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
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
    });
  }, [navigation, data.search, data.year, showFilter, isFiltering]);

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
          {!loading.startFetch && (
            <ListProject
              formatDateView={formatDateView}
              data={data.projects}
              loadmore={loading.loadmore}
              refreshing={loading.refreshing}
              onRefresh={onRefreshProjects}
              onLoadmore={onLoadmoreProjects}
            />
          )}
        </CContent>
      }
    />
  );
}

export default Project;
