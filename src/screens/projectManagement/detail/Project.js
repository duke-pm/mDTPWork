/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Detail screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListTask from '../list/Task';
import FilterProject from '../components/FilterProject';
/** COMMON */
import {LOAD_MORE, REFRESH, THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectDetail(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {route, navigation} = props;
  const projectID = route.params.data.projectID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
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
  const [showFilter, setShowFilter] = useState({
    status: false,
    activeOwner: [],
    activeStatus: [],
    activeSector: [],
  });
  const [data, setData] = useState({
    year: Number(moment().format('YYYY')),
    statusID: null,
    ownerID: null,
    perPage: 25,
    page: 1,
    search: '',

    tasks: [],
  });

  let prevShowFilter = usePrevious(showFilter);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = value => {
    setLoading({...loading, startFetch: true});
    setData({...data, search: value, page: 1});
    onFetchData(Number(moment().format('YYYY')), null, null, 25, 1, value);
  };

  const handleShowFilter = () => {
    setShowFilter({...showFilter, status: !showFilter.status});
  };

  const handleFilter = (activeOwner, activeStatus, activeSector) => {
    setShowFilter({
      status: !showFilter.status,
      activeOwner,
      activeStatus,
      activeSector,
    });
  };

  /************
   ** FUNC **
   ************/
  const onFetchData = (
    year = Number(moment().format('YYYY')),
    ownerID = null,
    statusID = null,
    perPage = 25,
    page = 1,
    search = '',
  ) => {
    let params = fromJS({
      PrjID: projectID,
      Year: year,
      OwnerID: ownerID,
      StatusID: statusID,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListTask(params, navigation));
    if ((statusID !== null || ownerID !== null) && !isFiltering) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let tmpTasks = [...data.tasks];
    /** Prepare data tasks */
    let tasks = projectState.get('tasks');
    // Check if count result < perPage => loadmore is unavailable
    if (tasks.length < perPageMaster) {
      isLoadmore = false;
    }
    // Check type fetch is refresh or loadmore
    if (type === REFRESH) {
      tmpTasks = tasks;
    } else if (type === LOAD_MORE) {
      tmpTasks = [...tmpTasks, ...tasks];
    }
    setData({...data, tasks: tmpTasks});
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

  const onRefreshTasks = () => {
    if (!loading.refreshing) {
      setData({...data, page: 1});
      onFetchData(
        null,
        data.ownerID,
        data.statusID,
        data.perPage,
        1,
        data.search,
      );
      setLoading({...loading, refreshing: true});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(
        null,
        data.ownerID,
        data.statusID,
        data.perPage,
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
    onFetchData(Number(moment().format('YYYY')), null, null, 25, 1, '');
    setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (prevShowFilter && prevShowFilter.status === true) {
      if (!showFilter.status && !loading.startFetch) {
        if (
          prevShowFilter.activeOwner.join() === showFilter.activeOwner.join() &&
          prevShowFilter.activeStatus.join() === showFilter.activeStatus.join() &&
          prevShowFilter.activeSector.join() === showFilter.activeSector.join()
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
        if (showFilter.activeSector.length > 0) {
          params.statusID = showFilter.activeSector.join();
        }
        onFetchData(null, params.ownerID, params.statusID, 25, 1, data.search);
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
    prevShowFilter,
    loading.startFetch,
    showFilter.status,
    showFilter.activeOwner,
    showFilter.activeStatus,
    showFilter.activeSector,
  ]);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing) {
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
    projectState.get('submittingListTask'),
    projectState.get('successListTask'),
    projectState.get('errorListTask'),
  ]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main}
      title={props.route.params?.data?.projectName || ''}
      subTitle={props.route.params?.data?.projectStatus}
      header
      hasBack
      hasSearch
      onPressSearch={handleSearch}
      headerRight={
        <TouchableOpacity style={cStyles.itemsEnd} onPress={handleShowFilter}>
          <Icon
            style={cStyles.p16}
            name={'filter'}
            color={'white'}
            size={scalePx(3)}
          />
          {isFiltering && (
            <View
              style={[
                cStyles.rounded2,
                cStyles.abs,
                styles.badge,
                cStyles.borderAll,
                isDark && cStyles.borderAllDark,
                {backgroundColor: customColors.red},
              ]}
            />
          )}
        </TouchableOpacity>
      }
      content={
        <CContent>
          {!loading.main && !loading.startFetch && (
            <ListTask
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              data={data.tasks}
              onRefreshTasks={onRefreshTasks}
              onLoadmore={onLoadmore}
            />
          )}
          {!loading.main && (
            <FilterProject
              sector
              visible={showFilter.status}
              onFilter={handleFilter}
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

export default ProjectDetail;
