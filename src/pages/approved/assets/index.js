/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved assets page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssets.js
 **/
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {Layout, Spinner, Text} from '@ui-kitten/components';
import moment from 'moment';
/* COMPONENTS */
import ListRequest from '../components/ListRequest';
/* COMMON */
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {usePrevious} from '~/utils/hook';
import {LOAD_MORE, REFRESH} from '~/configs/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function ApprovedAssets(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

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
    status: '1,2,3,4',
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    page: 1,
    search: '',
  });

  /** Use previous */
  const prevDataRoute = usePrevious(props.dataRoute);

  /**********
   ** FUNC **
   **********/
  const onFetchData = (
    page = data.page,
    fromDate = data.fromDate,
    toDate = data.toDate,
    statusId = data.status,
    search = data.search,
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      StatusID: statusId,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value + '',
      IsResolveRequest: false,
      RefreshToken: refreshToken,
      Lang: language,
    });
    return dispatch(Actions.fetchListRequestApproved(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true,
      tmpRequests = [...data.requests],
      tmpRequestsDetail = [...data.requestsDetail],
      tmpProcessApproveds = [...data.processApproveds],
      tmpLastRequests = approvedState.get('requests'),
      tmpLastRequestsDetail = approvedState.get('requestsDetail'),
      tmpLastProcessApproved = approvedState.get('processApproved');

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
      tmpRequestsDetail = tmpLastRequestsDetail;
      tmpProcessApproveds = tmpLastProcessApproved;
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...tmpLastRequests];
      tmpRequestsDetail = [...tmpRequestsDetail, ...tmpLastRequestsDetail];
      tmpProcessApproveds = [...tmpProcessApproveds, ...tmpLastProcessApproved];
    }
    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestsDetail,
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
      onFetchData(1);
      setLoading({...loading, refreshing: true, isLoadmore: true});
      return setData({...data, page: 1});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      onFetchData(newPage);
      setLoading({...loading, loadmore: true});
      return setData({...data, page: newPage});
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
    onFetchData();
    return setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (prevDataRoute) {
      let curData = props.dataRoute;
      if (
        prevDataRoute.fromDate !== curData.fromDate ||
        prevDataRoute.toDate !== curData.toDate ||
        JSON.stringify(prevDataRoute.status) !==
          JSON.stringify(curData.status) ||
        prevDataRoute.search !== curData.search ||
        prevDataRoute.isRefresh !== curData.isRefresh
      ) {
        onFetchData(
          1,
          curData.fromDate,
          curData.toDate,
          curData.status,
          curData.search,
        );
        setLoading({...loading, startFetch: true});
        return setData({
          ...data,
          fromDate: curData.fromDate,
          toDate: curData.toDate,
          status: curData.status,
          page: 1,
          search: curData.search,
        });
      }
    }
  }, [setLoading, prevDataRoute, props.dataRoute]);

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
  return (
    <Layout style={cStyles.flex1}>
      {!loading.main && !loading.startFetch && (
        <ListRequest
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
      {(loading.main || loading.startFetch) &&
        <Layout style={cStyles.flexCenter} level="3">
          <Spinner />
        </Layout>
      }
    </Layout>
  );
}

ApprovedAssets.propTypes = {
  navigation: PropTypes.object.isRequired,
  dataRoute: PropTypes.object.isRequired,
};

export default ApprovedAssets;
