/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request handling page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListHandling.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {View, LayoutAnimation, UIManager} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CIconHeader from '~/components/CIconHeader';
import Filter from '../components/Filter';
import ListRequest from '../components/ListRequest';
/* COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import Icons from '~/config/Icons';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ListRequestHandling(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [showSearchBar, setShowSearch] = useState(false);
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    type: '1,2,3',
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    search: '',
    page: 1,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = value => {
    setData({...data, search: value, page: 1});
    onFetchData(data.fromDate, data.toDate, 1, value, data.type);
    setLoading({...loading, startFetch: true});
    setShowSearch(false);
  };

  const handleFilter = (fromDate, toDate, status, type) => {
    setLoading({...loading, startFetch: true});
    setData({
      ...data,
      page: 1,
      type,
      fromDate,
      toDate,
    });
    onFetchData(fromDate, toDate, 1, data.search, type);
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  /************
   ** FUNC **
   ************/
  const onFetchData = (
    fromDate = null,
    toDate = null,
    pageNum = 1,
    search = '',
    requestTypeID = '1,2,3',
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      PageSize: perPage,
      PageNum: pageNum,
      Search: search,
      RequestTypeID: requestTypeID,
      IsResolveRequest: true,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListRequestApproved(params, navigation));
  };

  const onPrepareData = type => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;
    if (approvedState.get('requests').length < perPage) {
      isLoadmore = false;
    }
    if (type === REFRESH) {
      tmpRequests = approvedState.get('requests');
      tmpRequestDetail = approvedState.get('requestsDetail');
      tmpProcessApproveds = approvedState.get('processApproved');
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...approvedState.get('requests')];
      tmpRequestDetail = [
        ...tmpRequestDetail,
        ...approvedState.get('requestsDetail'),
      ];
      tmpProcessApproveds = [
        ...tmpProcessApproveds,
        ...approvedState.get('processApproved'),
      ];
    }
    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestDetail,
      processApproveds: tmpProcessApproveds,
    });
    setLoading({
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefresh = () => {
    if (!loading.refreshing) {
      setLoading({...loading, refreshing: true, isLoadmore: true});
      setData({...data, page: 1});
      onFetchData(data.fromDate, data.toDate, 1, data.search, data.type);
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setLoading({...loading, loadmore: true});
      setData({...data, page: newPage});
      onFetchData(data.fromDate, data.toDate, newPage, data.search, data.type);
    }
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore: false,
    });
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onFetchData(data.fromDate, data.toDate, data.page, data.search, data.type);
    setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!approvedState.get('submittingList')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (approvedState.get('successListRequest')) {
          return onPrepareData(type);
        }

        if (approvedState.get('errorListRequest')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    approvedState.get('submittingList'),
    approvedState.get('successListRequest'),
    approvedState.get('errorListRequest'),
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
          ]}
        />
      ),
    });
  }, [navigation, data.search]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main || loading.startFetch}
      content={
        <CContent>
          <View style={cStyles.itemsCenter}>
            <Filter isResolve data={data} onFilter={handleFilter} />
          </View>

          <CSearchBar
            loading={loading.startFetch}
            isVisible={showSearchBar}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />

          {!loading.main && (
            <ListRequest
              permissionWrite={isPermissionWrite}
              loadmore={loading.loadmore}
              refreshing={loading.refreshing}
              data={data.requests}
              dataDetail={data.requestsDetail}
              dataProcess={data.processApproveds}
              customColors={customColors}
              routeDetail={'auto'}
              onRefresh={onRefresh}
              onLoadmore={onLoadmore}
            />
          )}
        </CContent>
      }
    />
  );
}

export default ListRequestHandling;
