/**
 ** Name: Approved assets page
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssets.js
 **/
import { fromJS } from 'immutable';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showMessage } from "react-native-flash-message";
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Filter from './components/Filter';
import ListRequest from './list/Request';
/* COMMON */
import Routes from '~/navigation/Routes';
import { LOAD_MORE, REFRESH } from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function ApprovedAssets(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);
  const approvedState = useSelector(({ approved }) => approved);
  const authState = useSelector(({ auth }) => auth);

  const [loading, setLoading] = useState({
    main: false,
    search: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(commonState.get('formatDate')),
    toDate: moment().clone().endOf('month').format(commonState.get('formatDate')),
    status: '1,2,3,4',
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    page: 1,
    perPage: commonState.get('perPage'),
    showResolveRequest: false,
  });

  /** HANDLE FUNC */
  const handleAddNew = () => {
    props.navigation.navigate(
      Routes.MAIN.ADD_APPROVED_ASSETS.name,
      {
        onRefresh: () => onRefresh(),
      }
    );
  };

  const handleSearch = (value) => {
    setLoading({ ...loading, search: true });
    onFetchData(
      data.fromDate,
      data.toDate,
      data.status,
      data.perPage,
      data.page,
      value,
    );
  };

  const handleFilter = (fromDate, toDate, status, showResolveRequest) => {
    setLoading({ ...loading, search: true });
    setData({ ...data, page: 1, status, fromDate, toDate, showResolveRequest });
    onFetchData(
      fromDate,
      toDate,
      status,
      null,
      null,
      null,
      null,
      showResolveRequest
    );
  };

  /** FUNC */
  const onFetchData = (
    fromDate = null,
    toDate = null,
    statusId = '1,2,3,4',
    pageSize = data.perPage,
    pageNum = 1,
    search = '',
    requestTypeID = 1,
    showResolveRequest = false,
  ) => {
    let params = fromJS({
      'FromDate': fromDate,
      'ToDate': toDate,
      'StatusID': statusId,
      'PageSize': pageSize,
      'PageNum': pageNum,
      'Search': search,
      'RequestTypeID': requestTypeID,
      'IsResolveRequest': showResolveRequest,
      'RefreshToken': authState.getIn(['login', 'refreshToken']),
      'Lang': commonState.get('language'),
    });
    dispatch(Actions.fetchListRequestApproved(params, props.navigation));
  };

  const onPrepareData = (type) => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;
    if (approvedState.get('requests').length < commonState.get('perPage')) {
      isLoadmore = false;
    }
    if (type === REFRESH) {
      tmpRequests = approvedState.get('requests');
      tmpRequestDetail = approvedState.get('requestsDetail');
      tmpProcessApproveds = approvedState.get('processApproved');
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...approvedState.get('requests')];
      tmpRequestDetail = [...tmpRequestDetail, ...approvedState.get('requestsDetail')];
      tmpProcessApproveds = [...tmpProcessApproveds, ...approvedState.get('processApproved')];
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
      setLoading({ ...loading, refreshing: true, isLoadmore: true });
      setData({ ...data, page: 1 });
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
        data.perPage,
        1,
      );
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setLoading({ ...loading, loadmore: true });
      setData({ ...data, page: newPage });
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
        data.perPage,
        newPage,
      );
    }
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: approvedState.getIn(['errorHelperListRequest', 'message'])
        || t('error:list_request'),
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
  }

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData(
      data.fromDate,
      data.toDate,
      data.status,
      data.perPage,
      data.page,
      '',
    );
    setLoading({
      ...loading,
      main: true,
    });
  }, []);

  useEffect(() => {
    if (loading.main || loading.search || loading.refreshing || loading.loadmore) {
      if (!approvedState.get('submittingList')) {
        let type = REFRESH;
        if (loading.loadmore) type = LOAD_MORE;

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
    approvedState.get('errorListRequest')
  ]);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading.main || loading.search}
      title={'approved_assets:title'}
      header
      hasAddNew
      hasSearch
      hasBack
      onPressAddNew={handleAddNew}
      onPressSearch={handleSearch}
      content={
        <CContent>
          <Filter onFilter={handleFilter} />

          {!loading.main &&
            <ListRequest
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              data={data.requests}
              dataDetail={data.requestsDetail}
              dataProcess={data.processApproveds}
              onRefresh={onRefresh}
              onLoadmore={onLoadmore}
            />
          }
        </CContent>
      }
    />
  );
};

export default ApprovedAssets;
