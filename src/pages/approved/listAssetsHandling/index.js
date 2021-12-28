/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request handling page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListHandling.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import ListRequest from '../components/ListRequest';
import Filter from '../components/Filter';
/* COMMON */
import {Commons} from '~/utils/common';
import {LOAD_MORE, REFRESH} from '~/configs/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function ListRequestHandling(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const masterState = useSelector(({masterData}) => masterData);
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

  /**********
   ** FUNC **
   **********/
  const resetAllRequests = () => {
    return dispatch(Actions.resetAllApproved());
  };

  const onSearch = valueSearch => {
    onFetchData(data.fromDate, data.toDate, 1, valueSearch, data.type);
    setLoading({...loading, startFetch: true});
    return setData({...data, search: valueSearch, page: 1});
  };

  const onFilter = (fromDate, toDate, status, type, toggle) => {
    toggle();
    onFetchData(fromDate, toDate, 1, data.search, type);
    setLoading({...loading, startFetch: true});
    return setData({...data, type, fromDate, toDate, page: 1});
  };

  const onFetchData = (
    fromDate = data.fromDate,
    toDate = data.toDate,
    pageNum = data.page,
    search = data.search,
    requestTypeID = '1,2,3',
  ) => {
    let params = fromJS({
      IsResolveRequest: true,
      FromDate: fromDate,
      ToDate: toDate,
      Search: search,
      RequestTypeID: requestTypeID,
      PageSize: perPage,
      PageNum: pageNum,
      RefreshToken: refreshToken,
      Lang: language,
    });
    return dispatch(Actions.fetchListRequestApproved(params, navigation));
  };

  const onPrepareMasterData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: refreshToken,
      Lang: language,
    };
    return dispatch(Actions.fetchMasterData(params, navigation));
  };

  const onPrepareData = type => {
    let tmpRequests = [...data.requests],
      tmpRequestDetail = [...data.requestsDetail],
      tmpProcessApproveds = [...data.processApproveds],
      tmpLastRequests = approvedState.get('requests'),
      tmpLastRequestsDetail = approvedState.get('requestsDetail'),
      tmpLastProcessApproved = approvedState.get('processApproved'),
      isLoadmore = true;

    /* *
     * If data result from server have
     * count < perPage => close loadmore
     * */
    if (tmpLastRequests.length < perPage) isLoadmore = false;

    /* * 
     * Check fetch is refresh or loadmore data
     * */
    if (type === REFRESH) {
      tmpRequests = tmpLastRequests;
      tmpRequestDetail = tmpLastRequestsDetail;
      tmpProcessApproveds = tmpLastProcessApproved;
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...tmpLastRequests];
      tmpRequestDetail = [...tmpRequestDetail, ...tmpLastRequestsDetail];
      tmpProcessApproveds = [...tmpProcessApproveds, ...tmpLastProcessApproved];
    }
    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestDetail,
      processApproveds: tmpProcessApproveds,
    });
    return setLoading({
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefresh = () => {
    if (!loading.refreshing) {
      setData({...data, page: 1});
      onFetchData(data.fromDate, data.toDate, 1, data.search, data.type);
      return setLoading({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(data.fromDate, data.toDate, newPage, data.search, data.type);
      return setLoading({...loading, loadmore: true});
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    resetAllRequests();
    onPrepareMasterData();
  }, []);

  useEffect(() => {
    if (loading.main && !loading.startFetch) {
      if (!masterState.get('submitting')) {
        setLoading({...loading, startFetch: true});
        onFetchData();
      }
    }
  }, [
    loading.main,
    loading.startFetch,
    masterState.get('submitting'),
  ]);

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

  /************
   ** RENDER **
   ************/
  let item,
    types = data.type.split(','),
    typesObj = [];
  for (item of types) {
    if (item == Commons.APPROVED_TYPE.ASSETS.value) {
      typesObj.push(Commons.APPROVED_TYPE.ASSETS);
    } else if (item == Commons.APPROVED_TYPE.LOST.value) {
      typesObj.push(Commons.APPROVED_TYPE.LOST);
    } else {
      typesObj.push(Commons.APPROVED_TYPE.DAMAGED);
    }
  }

  return (
    <CContainer
      safeArea={['top', 'bottom']}
      loading={loading.main || loading.startFetch}
      headerComponent={
        <CTopNavigation
          loading={loading.startFetch}
          title="list_request_assets_handling:title"
          back
          searchFilter
          onSearch={onSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isResolve={true}
                data={data}
                onFilter={(fromDate, toDate, status, type) =>
                  onFilter(fromDate, toDate, status, type, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** Content */}
      {!loading.main && !loading.startFetch && (
        <ListRequest
          permissionWrite={isPermissionWrite}
          loadmore={loading.loadmore}
          refreshing={loading.refreshing}
          data={data.requests}
          dataDetail={data.requestsDetail}
          dataProcess={data.processApproveds}
          routeDetail={'auto'}
          onRefresh={onRefresh}
          onLoadmore={onLoadmore}
        />
      )}
    </CContainer>
  );
}

export default ListRequestHandling;
