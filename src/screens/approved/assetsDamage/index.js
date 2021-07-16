/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved assets damage page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssetsDamage.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
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

function ApprovedAssetsDamage(props) {
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
  let prevData = usePrevious(props.dataRoute);

  /**********
   ** FUNC **
   **********/
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
      Lang: commonState.get('language'),
    });
    return dispatch(Actions.fetchListRequestDamage(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let tmpRequests = [...data.requests];
    let tmpRequestDetail = [...data.requestsDetail];
    let tmpProcessApproveds = [...data.processApproveds];
    let isLoadmore = true;

    // Check if count result < perPage => loadmore is unavailable
    if (approvedState.get('requestsDamage').length < perPage) {
      isLoadmore = false;
    }

    // Check type fetch is refresh or loadmore
    if (type === REFRESH) {
      tmpRequests = approvedState.get('requestsDamage');
      tmpRequestDetail = approvedState.get('requestsDamageDetail');
      tmpProcessApproveds = approvedState.get('processDamageApproved');
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...approvedState.get('requestsDamage')];
      tmpRequestDetail = [
        ...tmpRequestDetail,
        ...approvedState.get('requestsDamageDetail'),
      ];
      tmpProcessApproveds = [
        ...tmpProcessApproveds,
        ...approvedState.get('processDamageApproved'),
      ];
    }

    // Update data
    setData({
      ...data,
      requests: tmpRequests,
      requestsDetail: tmpRequestDetail,
      processApproveds: tmpProcessApproveds,
    });

    // Update loading and re-render
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
      onFetchData(data.fromDate, data.toDate, data.status, 1, data.search);
      return setLoading({...loading, refreshing: true, isLoadmore: true});
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
    onFetchData(data.fromDate, data.toDate, data.status, 1, data.search);
    return setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (prevData) {
      let curData = props.dataRoute;
      if (
        prevData.fromDate !== curData.fromDate ||
        prevData.toDate !== curData.toDate ||
        JSON.stringify(prevData.status) !== JSON.stringify(curData.status) ||
        prevData.search !== curData.search ||
        prevData.isRefresh !== curData.isRefresh
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
        return setLoading({...loading, startFetch: true});
      }
    }
  }, [setLoading, prevData, props.dataRoute]);

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
          data={data.requests}
          dataDetail={data.requestsDetail}
          dataProcess={data.processApproveds}
          customColors={customColors}
          routeDetail={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
          onRefresh={onRefresh}
          onLoadmore={onLoadmore}
        />
      )}
      <TabbarLoading show={loading.main || loading.startFetch} />
    </View>
  );
}

export default ApprovedAssetsDamage;
