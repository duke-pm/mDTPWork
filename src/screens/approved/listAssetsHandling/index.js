/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request handling page
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ListHandling.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Filter from '../components/Filter';
import ListRequest from './list/Request';
/* COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

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

  /** Use state */
  const [loading, setLoading] = useState({
    main: false,
    search: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    status: '1,2,3,4',
    type: '1,2,3',
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    search: '',
    page: 1,
  });

  /** HANDLE FUNC */
  const handleSearch = value => {
    setLoading({...loading, search: true});
    setData({...data, search: value});
    onFetchData(
      data.fromDate,
      data.toDate,
      data.status,
      data.page,
      value,
      data.type,
    );
  };

  const handleFilter = (fromDate, toDate, status, type) => {
    setLoading({...loading, search: true});
    setData({
      ...data,
      page: 1,
      status,
      type,
      fromDate,
      toDate,
    });
    onFetchData(fromDate, toDate, status, 1, data.search, type);
  };

  /** FUNC */
  const onFetchData = (
    fromDate = null,
    toDate = null,
    statusId = '1,2,3,4',
    pageNum = 1,
    search = '',
    requestTypeID = '1,2,3',
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      StatusID: statusId,
      PageSize: perPage,
      PageNum: pageNum,
      Search: search,
      RequestTypeID: requestTypeID,
      IsResolveRequest: true,
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
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
      search: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefresh = () => {
    if (!loading.refreshing) {
      setLoading({...loading, refreshing: true, isLoadmore: true});
      setData({...data, page: 1});
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
        1,
        data.search,
        data.type,
      );
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setLoading({...loading, loadmore: true});
      setData({...data, page: newPage});
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
        newPage,
        data.search,
        data.type,
      );
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
      search: false,
      refreshing: false,
      loadmore: false,
      isLoadmore: false,
    });
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData(
      data.fromDate,
      data.toDate,
      data.status,
      data.page,
      data.search,
      data.type,
    );
    setLoading({...loading, main: true});
  }, []);

  useEffect(() => {
    if (
      loading.main ||
      loading.search ||
      loading.refreshing ||
      loading.loadmore
    ) {
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
    loading.main,
    loading.search,
    loading.refreshing,
    loading.loadmore,
    approvedState.get('submitting'),
    approvedState.get('successListRequest'),
    approvedState.get('errorListRequest'),
  ]);

  /** RENDER */
  return (
    <CContainer
      loading={loading.main || loading.search}
      title={'list_request_assets_handling:title'}
      header
      hasBack
      hasSearch
      onPressSearch={handleSearch}
      content={
        <CContent>
          <Filter isResolve onFilter={handleFilter} />

          {!loading.main && (
            <ListRequest
              permissionWrite={isPermissionWrite}
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              data={data.requests}
              dataDetail={data.requestsDetail}
              dataProcess={data.processApproveds}
              customColors={customColors}
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
