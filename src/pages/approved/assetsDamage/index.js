/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved Assets Damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ApprovedAssetsDamage.js
 **/
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {Layout, Spinner, Text} from "@ui-kitten/components";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import ListRequest from "../components/ListRequest";
/* COMMON */
import Routes from "~/navigator/Routes";
import {Commons} from "~/utils/common";
import {cStyles} from "~/utils/style";
import {usePrevious} from "~/utils/hook";
import {
  LOAD_MORE,
  REFRESH,
  REDUX_LOGIN,
} from "~/configs/constants";
/* REDUX */
import * as Actions from "~/redux/actions";

function ApprovedAssetsDamage(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const perPage = commonState["perPage"];
  const formatDate = commonState["formatDate"];
  const formatDateView = commonState["formatDateView"];
  const refreshToken = authState[REDUX_LOGIN]["refreshToken"];
  const language = commonState["language"];

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf("month").format(formatDate),
    toDate: moment().clone().endOf("month").format(formatDate),
    status: "1,2,3,4",
    requests: [],
    requestsDetail: [],
    processApproveds: [],
    page: 1,
    search: "",
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
    let params = {
      FromDate: fromDate,
      ToDate: toDate,
      StatusID: statusId,
      PageSize: perPage,
      PageNum: page,
      Search: search,
      RequestTypeID: Commons.APPROVED_TYPE.DAMAGED.value + "",
      IsResolveRequest: false,
      RefreshToken: refreshToken,
      Lang: language,
    };
    return dispatch(Actions.fetchListRequestDamage(params, navigation));
  };

  const onPrepareData = (type = REFRESH) => {
    let isLoadmore = true,
      tmpRequests = [...data.requests],
      tmpRequestDetail = [...data.requestsDetail],
      tmpProcessApproveds = [...data.processApproveds],
      tmpLastRequestsDamage = approvedState["requestsDamage"],
      tmpLastRequestsDamageDetail = approvedState["requestsDamageDetail"],
      tmpLastProcessDamageApproved = approvedState["processDamageApproved"];

    /* *
     * If data result from server have
     * count < perPage => close loadmore
     * */
    if (tmpLastRequestsDamage.length < perPage) isLoadmore = false;

    /* * 
     * Check fetch is refresh or loadmore data
     * */
    if (type === REFRESH) {
      tmpRequests = tmpLastRequestsDamage;
      tmpRequestDetail = tmpLastRequestsDamageDetail;
      tmpProcessApproveds = tmpLastProcessDamageApproved;
    } else if (type === LOAD_MORE) {
      tmpRequests = [...tmpRequests, ...tmpLastRequestsDamage];
      tmpRequestDetail = [...tmpRequestDetail, ...tmpLastRequestsDamageDetail];
      tmpProcessApproveds = [...tmpProcessApproveds, ...tmpLastProcessDamageApproved];
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
      message: t("common:app_name"),
      description: t("error:list_request"),
      type: "danger",
      icon: "danger",
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
    if (data.requests.length === 0) {
      onFetchData(
        data.page,
        props.dataRoute.fromDate,
        props.dataRoute.toDate,
        props.dataRoute.status,
        props.dataRoute.search,
      );
      return setLoading({...loading, startFetch: true});
    }
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
      if (!approvedState["submittingListDamage"]) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (approvedState["successListRequestDamage"]) {
          return onPrepareData(type);
        }

        if (approvedState["errorListRequestDamage"]) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    approvedState["submittingListDamage"],
    approvedState["successListRequestDamage"],
    approvedState["errorListRequestDamage"],
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
          formatDateView={formatDateView}
          data={data.requests}
          dataDetail={data.requestsDetail}
          dataProcess={data.processApproveds}
          routeDetail={Routes.ADD_APPROVED_LOST_DAMAGED.name}
          onRefresh={onRefresh}
          onLoadmore={onLoadmore}
        />
      )}
      {(loading.main || loading.startFetch) &&
        <Layout style={cStyles.flexCenter} level="3">
          <Spinner />
          <Text style={cStyles.mt10} category="c1" appearance="hint">
            {t("common:loading")}
          </Text>
        </Layout>
      }
    </Layout>
  );
}

ApprovedAssetsDamage.propTypes = {
  navigation: PropTypes.object.isRequired,
  dataRoute: PropTypes.object.isRequired,
};

export default ApprovedAssetsDamage;
