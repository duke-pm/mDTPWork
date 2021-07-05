/* eslint-disable react-native/no-inline-styles */
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
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CText from '~/components/CText';
import ListTask from '../list/Task';
/** COMMON */
import Routes from '~/navigation/Routes';
import {LOAD_MORE, LOGIN, REFRESH, THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {
  fS,
  getSecretInfo,
  IS_ANDROID,
  IS_IOS,
  resetRoute,
} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectDetail(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
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
  const perPageMaster = 25;

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

  let prevShowFilter = usePrevious(showFilter);

  navigation.setOptions({
    backButtonInCustomView: true,
    title: `${t('project_management:list_task')}${projectID}`,
    headerLeft: () =>
      (route.params?.projectID !== null ||
        route.params?.projectID !== undefined) &&
      !navigation.canGoBack() ? (
        <TouchableOpacity onPress={handleBack}>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyStart,
              styles.left,
            ]}>
            <Icon
              name={IS_IOS ? 'chevron-back' : 'arrow-back'}
              color={IS_ANDROID ? colors.WHITE : customColors.blue}
              size={IS_IOS ? fS(30) : fS(25)}
            />
            <CText
              customStyles={[
                {color: IS_ANDROID ? colors.WHITE : customColors.blue},
              ]}
              label={'dashboard:title'}
            />
          </View>
        </TouchableOpacity>
      ) : undefined,
    headerRight: () => (
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        <TouchableOpacity onPress={handleOpenSearch}>
          <View style={cStyles.pr24}>
            <Icon
              name={'search'}
              color={IS_ANDROID ? colors.WHITE : customColors.icon}
              size={fS(23)}
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
              color={IS_ANDROID ? colors.WHITE : customColors.icon}
              size={fS(23)}
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
  const handleBack = () => {
    resetRoute(navigation, Routes.ROOT_TAB.name);
  };

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
    setLoading({...loading, startFetch: true});
  };

  const handleShowFilter = () => {
    navigation.navigate(Routes.MAIN.PROJECT_FILTER.name, {
      hasYear: false,
      hasSector: true,
      activeOwner: showFilter.activeOwner,
      activeStatus: showFilter.activeStatus,
      activeSector: showFilter.activeSector,
      onFilter: (y, actOwn, actSta, actSec) =>
        handleFilter(y, actOwn, actSta, actSec),
    });
  };

  const handleFilter = (year, activeOwner, activeStatus, activeSector) => {
    setShowFilter({
      activeOwner,
      activeStatus,
      activeSector,
    });
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

    return done(isLoadmore);
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
      setLoading({...loading, refreshing: true, isLoadmore: true});
      setData({...data, page: 1});
      onFetchData(
        data.ownerID,
        data.statusID,
        data.sectorID,
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
        data.ownerID,
        data.statusID,
        data.sectorID,
        perPageMaster,
        newPage,
        data.search,
      );
      setLoading({...loading, loadmore: true});
    }
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      dataLogin = {
        tokenInfo: {
          access_token: dataLogin.accessToken,
          token_type: dataLogin.tokenType,
          expires_in: dataLogin.expiresIn,
          refresh_token: dataLogin.refreshToken,
          userName: dataLogin.userName,
          userID: dataLogin.userID,
          empCode: dataLogin.empCode,
          fullName: dataLogin.fullName,
          regionCode: dataLogin.regionCode,
          deptCode: dataLogin.deptCode,
          jobTitle: dataLogin.jobTitle,
          '.expires': dataLogin.expired,
          groupID: dataLogin.groupID,
        },
        lstMenu: dataLogin.lstMenu,
      };
      dispatch(Actions.loginSuccess(dataLogin));
    } else {
      onGoToSignIn();
    }
  };

  const onGoToSignIn = () => {
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      onFetchData(null, null, null, perPageMaster, 1, '');
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
          onFetchData(null, null, null, perPageMaster, 1, '');
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
    projectState.get('submittingListTask'),
    projectState.get('successListTask'),
    projectState.get('errorListTask'),
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
      loading={loading.main}
      content={
        <CContent refreshing={loading.refreshing} onRefresh={onRefreshTasks}>
          <CSearchBar
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
              onLoadmore={onLoadmore}
            />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  left: {left: -10},
  badge: {height: 10, width: 10, top: 16, right: 15},
});

export default ProjectDetail;
