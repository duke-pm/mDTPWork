/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Management screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import ListProject from './list/Project';
/** COMMON */
import Routes from '~/navigation/Routes';
import {LOAD_MORE, REFRESH, THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectManagement(props) {
  const {t} = useTranslation();
  const {navigation} = props;
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const perPageMaster = 25;

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
    year: Number(moment().format('YYYY')),
    statusID: null,
    ownerID: null,
    page: 1,
    search: '',
    projects: [],
  });

  let prevShowFilter = usePrevious(showFilter);
  let prevYear = usePrevious(data.year);

  navigation.setOptions({
    headerRight: () => (
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        <TouchableOpacity onPress={handleOpenSearch}>
          <View style={cStyles.pr32}>
            <Icon
              name={'search'}
              color={
                isDark ? colors.WHITE : IS_ANDROID ? colors.WHITE : colors.BLACK
              }
              size={fS(20)}
            />
            {data.search !== '' && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.rounded2,
                  styles.badge,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  {backgroundColor: customColors.red, top: -5, left: 10},
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShowFilter}>
          <View>
            <Icon
              name={'options'}
              color={
                isDark ? colors.WHITE : IS_ANDROID ? colors.WHITE : colors.BLACK
              }
              size={fS(20)}
            />
            {isFiltering && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.rounded2,
                  styles.badge,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  {backgroundColor: customColors.red, top: -5, left: 10},
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    ),
  });

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
      activeOwner: showFilter.activeOwner,
      activeStatus: showFilter.activeStatus,
      onFilter: (y, actOwn, actSta, actSec) =>
        handleFilter(y, actOwn, actSta, actSec),
    });
  };

  const handleFilter = (year, activeOwner, activeStatus, activeSector) => {
    setData({...data, year});
    setShowFilter({activeOwner, activeStatus});
  };

  const handleOpenSearch = () => {
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  /************
   ** FUNC **
   ************/
  const onFetchMasterData = () => {
    let paramsMaster = {
      ListType: 'Users, PrjSector, PrjStatus, PrjComponent, PrjPriority',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(paramsMaster, navigation));
  };

  const onFetchData = (
    year = Number(moment().format('YYYY')),
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
      (statusID !== null ||
        ownerID !== null ||
        year !== Number(moment().format('YYYY'))) &&
      !isFiltering
    ) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpProjects = [...data.projects];
    /** Prepare data projects */
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
    return done(isLoadmore);
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
    });

    return done(false);
  };

  const done = isLoadmore => {
    return setLoading({
      main: false,
      refreshing: false,
      startFetch: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefresh = () => {
    if (!loading.refreshing) {
      setLoading({...loading, refreshing: true, isLoadmore: true});
      setData({...data, page: 1});
      onFetchData(
        data.year,
        data.ownerID,
        data.statusID,
        perPageMaster,
        1,
        data.search,
      );
    }
  };

  const onLoadmore = () => {
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

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onFetchMasterData();
    onFetchData(data.year, null, null, perPageMaster, 1, '');
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
    projectState.get('submittingListProject'),
    projectState.get('successListProject'),
    projectState.get('errorListProject'),
    masterState.get('users'),
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: !showSearchBar,
    });
  }, [navigation, showSearchBar]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main || loading.startFetch}
      content={
        <CContent refreshing={loading.refreshing} onRefresh={onRefresh}>
          <CSearchBar
            isVisible={showSearchBar}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />
          {!loading.main && !loading.startFetch && (
            <ListProject
              loadmore={loading.loadmore}
              formatDateView={formatDateView}
              data={data.projects}
              onLoadmore={onLoadmore}
            />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  badge: {height: 10, width: 10, top: 16, right: 15},
});

export default ProjectManagement;
