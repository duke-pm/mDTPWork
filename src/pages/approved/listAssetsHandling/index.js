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
import { Layout, Spinner } from '@ui-kitten/components';
import { cStyles } from '~/utils/style';

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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = value => {
    setData({...data, search: value, page: 1});
    onFetchData(data.fromDate, data.toDate, 1, value, data.type);
    return setLoading({...loading, startFetch: true});
  };

  const handleFilter = (fromDate, toDate, status, type, toggle) => {
    toggle();
    setData({...data, page: 1, type, fromDate, toDate});
    onFetchData(fromDate, toDate, 1, data.search, type);
    return setLoading({...loading, startFetch: true});
  };

  /**********
   ** FUNC **
   **********/
  const onDone = curLoading => setLoading(curLoading);

  const onFetchData = (
    fromDate = data.fromDate,
    toDate = data.toDate,
    pageNum = data.page,
    search = data.search,
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
    return dispatch(Actions.fetchListRequestApproved(params, navigation));
  };

  const onPrepareMasterData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
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
    return onDone({
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
      return onDone({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(data.fromDate, data.toDate, newPage, data.search, data.type);
      return onDone({...loading, loadmore: true});
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
    onPrepareMasterData();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (!masterState.get('submitting')) {
        onFetchData();
      }
    }
  }, [
    loading.main,
    masterState.get('submitting'),
  ]);

  useEffect(() => {
    if (loading.main || loading.startFetch || loading.refreshing || loading.loadmore) {
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
          onSearch={handleSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isResolve={true}
                data={data}
                onFilter={(fromDate, toDate, status, type) =>
                  handleFilter(fromDate, toDate, status, type, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** List all approved */}
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
