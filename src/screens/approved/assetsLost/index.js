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
import { ActivityIndicator, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import moment from 'moment';
/* COMPONENTS */
import CContent from '~/components/CContent';
import ListRequest from './list/Request';
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigation/Routes';
import { LOAD_MORE, REFRESH } from '~/config/constants';
import { colors, cStyles } from '~/utils/style';
import { usePrevious } from '~/utils/hook';
/* REDUX */
import * as Actions from '~/redux/actions';

function ApprovedAssets(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);
  const approvedState = useSelector(({ approved }) => approved);
  const authState = useSelector(({ auth }) => auth);
  const perPage = commonState.get('perPage');

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
    search: '',
  });

  let prevData = usePrevious(props.dataRoute);

  /** FUNC */
  const onFetchData = (
    fromDate = null,
    toDate = null,
    statusId = '1,2,3,4',
    page = 1,
    search = '',
  ) => {
    let params = fromJS({
      'FromDate': fromDate,
      'ToDate': toDate,
      'StatusID': statusId,
      'PageSize': perPage,
      'PageNum': page,
      'Search': search,
      'RequestTypeID': props.type + '',
      'IsResolveRequest': false,
      'RefreshToken': authState.getIn(['login', 'refreshToken']),
      'Lang': commonState.get('language'),
    });
    dispatch(Actions.fetchListRequestLost(params, props.navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;

    // Check if count result < perPage => loadmore is unavailable
    if (approvedState.get('requestsLost').length < perPage) isLoadmore = false;

    // Check type fetch is refresh or loadmore
    if (type === REFRESH) {
      tmpRequests = approvedState.get('requestsLost');
      tmpRequestDetail = approvedState.get('requestsLostDetail');
      tmpProcessApproveds = approvedState.get('processLostApproved');
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...approvedState.get('requestsLost')];
      tmpRequestDetail = [...tmpRequestDetail, ...approvedState.get('requestsLostDetail')];
      tmpProcessApproveds = [...tmpProcessApproveds, ...approvedState.get('processLostApproved')];
    }

    // Update data
    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestDetail,
      processApproveds: tmpProcessApproveds,
    });

    // Update loading and re-render
    let tmpLoading = {
      main: false,
      search: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    };
    setLoading(tmpLoading);
  };

  const onRefresh = () => {
    if (!loading.refreshing) {
      setLoading({ ...loading, refreshing: true, isLoadmore: true });
      setData({ ...data, page: 1, search: '' });
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
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
        newPage,
        data.search,
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
    );
    setLoading({ ...loading, main: true });
  }, []);

  useEffect(() => {
    if (prevData) {
      let curData = props.dataRoute;
      if ((prevData.fromDate !== curData.fromDate)
        || (prevData.toDate !== curData.toDate)
        || (JSON.stringify(prevData.status) !== JSON.stringify(curData.status))
        || (prevData.search !== curData.search)
        || (prevData.isRefresh !== curData.isRefresh)) {
        setLoading({ ...loading, search: true });
        setData({
          ...data,
          fromDate: curData.fromDate,
          toDate: curData.toDate,
          status: curData.status,
          page: 1,
          search: curData.search,
        });
        return onFetchData(
          curData.fromDate,
          curData.toDate,
          curData.status,
          curData.page,
          curData.search,
        );
      }
    }
  }, [
    setLoading,
    prevData,
    props.dataRoute
  ]);

  useEffect(() => {
    if (loading.main || loading.search || loading.refreshing || loading.loadmore) {
      if (!approvedState.get('submittingListLost')) {
        let type = REFRESH;
        if (loading.loadmore) type = LOAD_MORE;

        if (approvedState.get('successListRequestLost')) {
          return onPrepareData(type);
        }

        if (approvedState.get('errorListRequestLost')) {
          return onError();
        }
      }
    }
  }, [
    loading.main,
    loading.search,
    loading.refreshing,
    loading.loadmore,
    approvedState.get('submittingListLost'),
    approvedState.get('successListRequestLost'),
    approvedState.get('errorListRequestLost')
  ]);

  /** RENDER */
  return (
    <CContent>
      {(!loading.main && !loading.search) &&
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

      {(loading.main || loading.search) &&
        <View style={[cStyles.flexCenter]}>
          <ActivityIndicator color={colors.PRIMARY} />
          <CText styles={'textMeta pt10 textCenter'} label={'loading'} />
        </View>
      }
    </CContent>
  );
};

export default React.memo(ApprovedAssets);
