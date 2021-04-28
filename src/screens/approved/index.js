/**
 ** Name: Approved page
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fromJS } from 'immutable';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Filter from './components/Filter';
import ListRequest from './list/Request';
/* COMMON */
import Routes from '~/navigation/Routes';
import { cStyles } from '~/utils/style';
import {
  LOAD_MORE,
  REFRESH,
} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function Approved(props) {
  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);
  const approvedState = useSelector(({ approved }) => approved);

  const [loading, setLoading] = useState({
    main: true,
    search: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(commonState.get('formatDateCustom1')),
    toDate: moment().clone().endOf('month').format(commonState.get('formatDateCustom1')),
    status: '1,2,3,4',
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    page: 1,
    perPage: commonState.get('perPage'),
  });

  /** HANDLE FUNC */
  const handleAddNew = () => {
    props.navigation.navigate(Routes.MAIN.ADD_APPROVED.name);
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

  const handleFilter = (formDate, toDate, status) => {
    setLoading({ ...loading, search: true });
    onFetchData(
      formDate,
      toDate,
      status
    );
    setData({ ...data, page: 1, status, });
  };

  /** FUNC */
  const onFetchData = (
    fromDate = null,
    toDate = null,
    statusId = '1,2,3,4',
    pageSize = data.perPage,
    pageNum = 1,
    search = '',
  ) => {
    let params = fromJS({
      'FromDate': fromDate,
      'ToDate': toDate,
      'StatusID': statusId,
      'PageSize': pageSize,
      'PageNum': pageNum,
      'Search': search,
    });
    dispatch(Actions.fetchListRequestApproved(params));
  };

  const onPrepareData = (type, status) => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;
    if (approvedState.get('requests').length < commonState.get('perPage')) {
      isLoadmore = false;
    }

    if (type === REFRESH) {
      tmpRequests = status ? approvedState.get('requests') : [];
      tmpRequestDetail = status ? approvedState.get('requestsDetail') : [];
      tmpProcessApproveds = status ? approvedState.get('processApproved') : [];
    } else if (type === LOAD_MORE) {
      tmpRequests = status
        ? [...tmpRequests, ...approvedState.get('requests')]
        : tmpRequests;
      tmpRequestDetail = status
        ? [...tmpRequestDetail, ...approvedState.get('requestsDetail')]
        : tmpRequestDetail;
      tmpProcessApproveds = status
        ? [...tmpProcessApproveds, ...approvedState.get('processApproved')]
        : tmpProcessApproveds;
    }

    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestDetail,
      processApproveds: tmpProcessApproveds,
    });
    setError(!status);
    setLoading({
      main: false,
      search: false,
      refreshing: false,
      loadmore: false,
      isLoadmore
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
        '',
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
        '',
      );
    }
  };

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
  }, []);

  useEffect(() => {
    if (loading.main || loading.search || loading.refreshing || loading.loadmore) {
      if (!approvedState.get('submitting')) {
        let type = REFRESH;
        if (loading.loadmore) type = LOAD_MORE;

        if (approvedState.get('successListRequest')) {
          return onPrepareData(type, true);
        }

        if (approvedState.get('errorListRequest')) {
          return onPrepareData(type, false);
        }
      }
    }
  }, [
    loading.main,
    loading.search,
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
      title={'approved:title'}
      header
      hasAddNew
      hasSearch
      hasBack
      onPressAddNew={handleAddNew}
      onPressSearch={handleSearch}
      content={
        <CContent padder contentStyle={cStyles.flex1} scrollEnabled={false}>
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

export default Approved;
