/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved Assets Lost
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssetsLost.js
 **/
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme, useNavigation} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import ListRequest from '../components/ListRequest';
import TabbarLoading from '../components/TabbarLoading';
/* COMMON */
import Routes from '~/navigation/Routes';
import {LOAD_MORE, REFRESH} from '~/config/constants';
import {usePrevious} from '~/utils/hook';
import {cStyles} from '~/utils/style';
import Commons from '~/utils/common/Commons';
/* REDUX */
import * as Actions from '~/redux/actions';

ApprovedAssetsLost.propTypes = {
  dataRoute: PropTypes.object,
};

function ApprovedAssetsLost(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const navigation = useNavigation();

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
  const onDone = curLoading => setLoading(curLoading);

  const onFetchData = (
    fromDate = null,
    toDate = null,
    statusId = '1,2,3,4',
    page = 1,
    search = '',
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      StatusID: statusId,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RequestTypeID: Commons.APPROVED_TYPE.LOST.value + '',
      IsResolveRequest: false,
      RefreshToken: refreshToken,
      Lang: language,
    });
    return dispatch(Actions.fetchListRequestLost(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;

    // If count result < perPage => loadmore is unavailable
    if (approvedState.get('requestsLost').length < perPage) {
      isLoadmore = false;
    }

    if (type === REFRESH) {
      // Fetch is refresh
      tmpRequests = approvedState.get('requestsLost');
      tmpRequestDetail = approvedState.get('requestsLostDetail');
      tmpProcessApproveds = approvedState.get('processLostApproved');
    } else if (type === LOAD_MORE) {
      // Fetch is loadmore
      tmpRequests = [...tmpRequests, ...approvedState.get('requestsLost')];
      tmpRequestDetail = [
        ...tmpRequestDetail,
        ...approvedState.get('requestsLostDetail'),
      ];
      tmpProcessApproveds = [
        ...tmpProcessApproveds,
        ...approvedState.get('processLostApproved'),
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
      onFetchData(data.fromDate, data.toDate, data.status, 1, data.search);
      return onDone({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = data.page + 1;
      setData({...data, page: newPage});
      onFetchData(
        data.fromDate,
        data.toDate,
        data.status,
        newPage,
        data.search,
      );
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
    return onDone({
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
    onFetchData(
      data.fromDate,
      data.toDate,
      data.status,
      data.page,
      data.search,
    );
    return onDone({...loading, startFetch: true});
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
        setData({
          ...data,
          fromDate: curData.fromDate,
          toDate: curData.toDate,
          status: curData.status,
          page: 1,
          search: curData.search,
        });
        onFetchData(
          curData.fromDate,
          curData.toDate,
          curData.status,
          curData.page,
          curData.search,
        );
        return onDone({...loading, startFetch: true});
      }
    }
  }, [setLoading, prevDataRoute, props.dataRoute]);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!approvedState.get('submittingListLost')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (approvedState.get('successListRequestLost')) {
          return onPrepareData(type);
        }

        if (approvedState.get('errorListRequestLost')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    approvedState.get('submittingListLost'),
    approvedState.get('successListRequestLost'),
    approvedState.get('errorListRequestLost'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.flex1}>
      {!loading.main && !loading.startFetch && (
        <ListRequest
          refreshing={loading.refreshing}
          loadmore={loading.loadmore}
          routeDetail={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
          data={data.requests}
          dataDetail={data.requestsDetail}
          dataProcess={data.processApproveds}
          customColors={customColors}
          onRefresh={onRefresh}
          onLoadmore={onLoadmore}
        />
      )}
      <TabbarLoading show={loading.main || loading.startFetch} />
    </View>
  );
}

export default ApprovedAssetsLost;
