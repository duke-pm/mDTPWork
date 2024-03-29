/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved Assets Damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssetsDamage.js
 **/
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CLoading from '~/components/CLoading';
import ListRequest from '../components/ListRequest';
/* COMMON */
import Routes from '~/navigation/Routes';
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {usePrevious} from '~/utils/hook';
import {LOAD_MORE, REFRESH} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function ApprovedAssetsDamage(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
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
      RequestTypeID: Commons.APPROVED_TYPE.DAMAGED.value + '',
      IsResolveRequest: false,
      RefreshToken: refreshToken,
      Lang: language,
    });
    return dispatch(Actions.fetchListRequestDamage(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true;
    let cRequests = [...data.requests],
      cRequestDetail = [...data.requestsDetail],
      cProcessApproveds = [...data.processApproveds];
    let nRequestsDamage = approvedState.get('requestsDamage'),
      nRequestsDamageDetail = approvedState.get('requestsDamageDetail'),
      nProcessDamageApproved = approvedState.get('processDamageApproved');

    // If count result < perPage => loadmore is unavailable
    if (nRequestsDamage.length < perPage) {
      isLoadmore = false;
    }

    if (type === REFRESH) {
      // Fetch is refresh
      cRequests = nRequestsDamage;
      cRequestDetail = nRequestsDamageDetail;
      cProcessApproveds = nProcessDamageApproved;
    } else if (type === LOAD_MORE) {
      // Fetch is loadmore
      cRequests = [...cRequests, ...nRequestsDamage];
      cRequestDetail = [...cRequestDetail, ...nRequestsDamageDetail];
      cProcessApproveds = [...cProcessApproveds, ...nProcessDamageApproved];
    }
    setData({
      ...data,
      requests: cRequests,
      requestsDetail: cRequestDetail,
      processApproveds: cProcessApproveds,
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
    onFetchData(data.fromDate, data.toDate, data.status, 1, data.search);
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
      if (!approvedState.get('submittingListDamage')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (approvedState.get('successListRequestDamage')) {
          return onPrepareData(type);
        }

        if (approvedState.get('errorListRequestDamage')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    approvedState.get('submittingListDamage'),
    approvedState.get('successListRequestDamage'),
    approvedState.get('errorListRequestDamage'),
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
      <CLoading visible={loading.main || loading.startFetch} />
    </View>
  );
}

ApprovedAssetsDamage.propTypes = {
  navigation: PropTypes.object.isRequired,
  dataRoute: PropTypes.object.isRequired,
};

export default ApprovedAssetsDamage;
