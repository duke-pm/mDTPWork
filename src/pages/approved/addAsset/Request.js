/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request assets
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import React, {createRef, useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {
  KeyboardAwareScrollView
} from "react-native-keyboard-aware-scroll-view";
import {
  Card, Icon, TopNavigationAction, Text,
} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CForm from "~/components/CForm";
import CLoading from "~/components/CLoading";
import CAlert from "~/components/CAlert";
import CStatus from "~/components/CStatus";
import CActionSheet from "~/components/CActionSheet";
import RequestProcess from "../components/RequestProcess";
import AssetsTable, {WIDTH_ITEM_TABLE} from "../components/AssetsTable";
import RejectModal from "../components/RejectModal";
import FooterFormRequest from "../components/FooterFormRequest";
import UserRequest from "../components/UserRequest";
/* COMMON */
import Routes from "~/navigator/Routes";
import FieldsAuth from "~/configs/fieldsAuth";
import {cStyles} from "~/utils/style";
import {Commons} from "~/utils/common";
import {
  getSecretInfo,
  resetRoute,
} from "~/utils/helper";
import {
  AST_LOGIN,
  DEFAULT_FORMAT_DATE_4,
} from "~/configs/constants";
/* REDUX */
import * as Actions from "~/redux/actions";

/** All ref */
const asProcessRef = createRef();

/** All init */
const INPUT_NAME = {
  DATE_REQUEST: "dateRequest",
  NAME: "name",
  DEPARTMENT: "department",
  REGION: "region",
  ASEETS: "assets",
  WHERE_USE: "whereUse",
  REASON: "reason",
  TYPE_ASSETS: "typeAssets",
  IN_PLANNING: "inPlanning",
  SUPPLIER: "supplier",
};
const DATA_TYPE_ASSET = [
  {
    value: "N",
    label: "add_approved_assets:buy_new",
  },
  {
    value: "A",
    label: "add_approved_assets:additional",
  },
];
const DATA_IN_PLANNING = [
  {
    value: true,
    label: "add_approved_assets:yes",
  },
  {
    value: false,
    label: "add_approved_assets:no",
  },
];

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderProcessIcon = props => (
  <Icon {...props} name="list-outline" />
);

const RenderApprovedIcon = props => (
  <Icon {...props} name="checkmark-outline" />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function AddRequest(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;
  let requestParam = route.params?.data || -1;
  if (requestParam === -1) {
    requestParam = route.params?.requestID || -1;
  }

  /** Use ref */
  const formRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const formatDate = commonState["formatDate"];
  const language = commonState["language"];
  const refreshToken = authState["login"]["refreshToken"];

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    startFetchLogin: false,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetail] = useState(route.params?.data ? true : false);
  const [requestDetail, setRequestDetail] = useState(null); // NOTE: just use for deep linking
  const [currentProcess, setCurrentProcess] = useState(null); // NOTE: just use for deep linking
  const [process, setProcess] = useState([]);
  const [form, setForm] = useState({
    id: "",
    personRequestId: "",
    dateRequest: moment().format(formatDate),
    name: authState["login"]["fullName"],
    department: authState["login"]["deptCode"],
    region: authState["login"]["regionCode"],
    assets: {
      width: WIDTH_ITEM_TABLE,
      header: [
        "",
        t("add_approved_assets:description"),
        t("add_approved_assets:amount"),
        t("add_approved_assets:price"),
        t("add_approved_assets:total"),
      ],
      data: [[null, "", "", "", ""]],
    },
    whereUse: authState["login"]["deptCode"],
    reason: "",
    typeAssets: "N",
    inPlanning: false,
    supplier: "",
    status: 1,
    isAllowApproved: false,
    refsAssets: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleShowProcess = () => asProcessRef.current?.show();

  const handleReject = () => setShowReject(!showReject);

  const toggleApproved = () => setShowConfirm(!showConfirm);

  /**********
   ** FUNC **
   **********/
  const onSendRequest = () => setLoading({...loading, submitAdd: true});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onPrepareData = () => {
    let params = {
      listType: "Department, Region",
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
    dispatch(Actions.resetAllApproved());
    setLoading({...loading, startFetch: true});
  };

  const onPrepareDetail = (dataRequest, dataAssets, dataProcess) => {
    let tmp = {
      id: dataRequest ? dataRequest?.requestID : "",
      personRequestId: dataRequest
        ? dataRequest?.personRequestID
        : Number(authState["login"]["userId"]),
      dateRequest: dataRequest
        ? moment(dataRequest?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : moment().format(formatDate),
      name: dataRequest
        ? dataRequest?.personRequest
        : authState["login"]["fullName"],
      department: dataRequest
        ? dataRequest?.deptCode
        : authState["login"]["deptCode"],
      region: dataRequest
        ? dataRequest?.regionCode
        : authState["login"]["regionCode"],
      assets: {
        width: WIDTH_ITEM_TABLE,
        header: [
          "",
          t("add_approved_assets:description"),
          t("add_approved_assets:amount"),
          t("add_approved_assets:price"),
          t("add_approved_assets:total"),
        ],
        data: [[null, "", "", "", ""]],
      },
      whereUse: dataRequest ? dataRequest?.locationCode : "",
      reason: dataRequest ? dataRequest?.reason : "",
      typeAssets: dataRequest ? dataRequest?.docType : "N",
      inPlanning: dataRequest ? dataRequest?.isBudget : false,
      supplier: dataRequest ? dataRequest?.supplierName : "",
      status: dataRequest ? dataRequest?.statusID : 1,
      isAllowApproved: dataRequest ? dataRequest?.isAllowApproved : false,
    };

    // If data have any more assets
    if (dataAssets && dataAssets.length > 0) {
      tmp.assets.data = [];
      let item = null,
        choosesRef = [];
      for (item of dataAssets) {
        tmp.assets.data.push([
          "",
          item.descr,
          item.qty,
          item.unitPrice,
          item.totalAmt,
        ]);
        let handleRef = createRef();
        choosesRef.push(handleRef);
      }
      tmp.refsAssets = choosesRef;
    }

    // If data have any more process
    if (dataProcess && dataProcess.length > 0) {
      setProcess(dataProcess);
    }

    // Apply to form
    setForm(tmp);
    return setLoading({
      ...loading,
      main: false,
      startFetchLogin: false,
      startFetch: false,
    });
  };

  const onApproved = () => {
    let params = {
      RequestID: form.id,
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value,
      PersonRequestID: form.personRequestId,
      Status: true,
      Reason: "",
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchApprovedRequest(params, navigation));
    return setLoading({...loading, submitApproved: true});
  };

  const onReject = reason => {
    let params = {
      RequestID: form.id,
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value,
      PersonRequestID: form.personRequestId,
      Status: false,
      Reason: reason,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchRejectRequest(params, navigation));
    return setLoading({...loading, submitReject: true});
  };

  const onCallbackValidate = data => {
    if (!data.status) {
      /** Set values for input */
      let tmpCallback = formRef.current?.onCallbackValue();
      /** prepare assets */
      let assets = [],
        item = null;
      for (item of data.data) {
        assets.push({
          Descr: item[1],
          Qty: Number(item[2]),
          UnitPrice: item[3] === "" ? 0 : Number(item[3]),
          TotalAmt: item[4] === "" ? 0 : Number(item[4]),
        });
      }
      console.log("[LOG] ===  ===> ", tmpCallback.valuesAll);
      let params = {
        EmpCode: authState["login"]["empCode"],
        DeptCode: authState["login"]["deptCode"],
        RegionCode: authState["login"]["regionCode"],
        JobTitle: authState["login"]["jobTitle"],
        RequestDate: tmpCallback.valuesAll[0].value,
        Location: tmpCallback.valuesAll[1].values[tmpCallback.valuesAll[1].value]["deptCode"],
        Reason: tmpCallback.valuesAll[2].value.trim(),
        DocType: tmpCallback.valuesAll[4].values[tmpCallback.valuesAll[4].value]["value"],
        IsBudget: tmpCallback.valuesAll[5].values[tmpCallback.valuesAll[5].value]["value"],
        SupplierName: tmpCallback.valuesAll[3].value.trim(),
        ListAssets: assets,
        RefreshToken: refreshToken,
        Lang: language,
      };
      dispatch(Actions.fetchAddRequestApproved(params, navigation));
    } else {
      setLoading({...loading, submitAdd: false});
    }
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(AST_LOGIN);
    if (dataLogin) {
      console.log("[LOG] === SignIn Local === ", dataLogin);
      let i,
        tmpDataLogin = {tokenInfo: {}, lstMenu: {}};
      for (i = 0; i < FieldsAuth.length; i++) {
        if (i === 0) {
          tmpDataLogin[FieldsAuth[i].key] = dataLogin[FieldsAuth[i].key];
        } else {
          tmpDataLogin.tokenInfo[FieldsAuth[i].key] =
            dataLogin[FieldsAuth[i].value];
        }
      }
      dispatch(Actions.loginSuccess(tmpDataLogin));
    } else {
      onGoToSignIn();
    }
  };

  const onFetchRequestDetail = requestID => {
    let params = {
      RequestID: requestID,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchRequestDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onCheckDeeplink = () => {
    onPrepareData();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    dispatch(Actions.resetStatusMasterData());
    let isLogin = authState["successLogin"];
    if (isLogin) {
      onCheckDeeplink();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState["submitting"]) {
        if (authState["successLogin"]) {
          return onCheckDeeplink();
        }
        if (authState["errorLogin"]) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetchLogin,
    authState["submitting"],
    authState["successLogin"],
    authState["errorLogin"],
  ]);

  useEffect(() => {
    if (loading.main) {
      if (!masterState["submitting"]) {
        if (masterState["success"]) {
          if (masterState["department"].length > 0) {
            if (typeof requestParam === "object" || requestParam === -1) {
              onPrepareDetail(
                route.params?.data,
                route.params?.dataDetail,
                route.params?.dataProcess,
              );
              setCurrentProcess({
                statusID: route.params?.currentProcess?.statusID,
                statusName: route.params?.currentProcess?.statusName,
              });
            } else {
              onFetchRequestDetail(requestParam);
            }
          }
        }
      }
    }
  }, [
    loading.main,
    masterState["submitting"],
    masterState["success"],
    masterState["department"],
  ]);

  useEffect(() => {
    if (loading.main && loading.startFetch) {
      if (!approvedState["submittingRequestDetail"]) {
        if (approvedState["successRequestDetail"]) {
          if (approvedState["requestDetail"]) {
            let reqDetails = approvedState["requestDetail"];
            setRequestDetail(reqDetails);
            setCurrentProcess({
              statusID: reqDetails.statusID,
              statusName: reqDetails.statusName,
            });
            onPrepareDetail(
              approvedState["requestDetail"],
              approvedState["requestAssetsDetail"],
              approvedState["requestProcessDetail"],
            );
          } else {
            if (isDetail) {
              onPrepareDetail(
                route.params?.data,
                route.params?.dataDetail,
                route.params?.dataProcess,
              );
              setCurrentProcess({
                statusID: route.params?.currentProcess?.statusID,
                statusName: route.params?.currentProcess?.statusName,
              });
            } else {
              // do nothing
            }
          }
        }
        if (approvedState["errorRequestDetail"]) {
          setLoading({...loading, main: false, startFetch: false});
          showMessage({
            message: t("common:app_name"),
            description: approvedState["errorHelperRequestDetail"],
            type: "danger",
            icon: "danger",
          });
        }
      }
    }
  }, [
    loading.main,
    loading.startFetch,
    approvedState["submittingRequestDetail"],
    approvedState["successRequestDetail"],
    approvedState["errorRequestDetail"],
    approvedState["requestDetail"],
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState["submittingAdd"]) {
        if (approvedState["successAddRequest"]) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t("common:app_name"),
            description: t("success:send_request"),
            type: "success",
            icon: "success",
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState["errorAddRequest"]) {
          let tmpMsg = approvedState["errorHelperAddRequest"];
          if (typeof tmpMsg !== "string") {
            tmpMsg = t("error:add_request_assets");
          }
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t("common:app_name"),
            description: tmpMsg,
            type: "danger",
            icon: "danger",
          });
        }
      }
    }
  }, [
    loading.submitAdd,
    approvedState["submittingAdd"],
    approvedState["successAddRequest"],
    approvedState["errorAddRequest"],
  ]);

  useEffect(() => {
    if (loading.submitApproved) {
      if (!approvedState["submittingApproved"]) {
        if (approvedState["successApprovedRequest"]) {
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t("common:app_name"),
            description: t("success:approved_request"),
            type: "success",
            icon: "success",
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState["errorApprovedRequest"]) {
          let tmpMsg = approvedState["errorHelperApprovedRequest"];
          if (typeof tmpMsg !== "string") {
            tmpMsg = t("error:approved_request_assets");
          }
          toggleApproved();
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t("common:app_name"),
            description: tmpMsg,
            type: "danger",
            icon: "danger",
          });
        }
      }
    }
  }, [
    loading.submitApproved,
    approvedState["submittingApproved"],
    approvedState["successApprovedRequest"],
    approvedState["errorApprovedRequest"],
  ]);

  useEffect(() => {
    if (loading.submitReject) {
      if (!approvedState["submittingReject"]) {
        setShowReject(false);
        if (approvedState["successRejectRequest"]) {
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t("common:app_name"),
            description: t("success:reject_request"),
            type: "success",
            icon: "success",
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState["errorRejectRequest"]) {
          let tmpMsg = approvedState["errorHelperRejectRequest"];
          if (typeof tmpMsg !== "string") {
            tmpMsg = t("error:reject_request_assets");
          }
          handleReject();
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t("common:app_name"),
            description: tmpMsg,
            type: "danger",
            icon: "danger",
          });
        }
      }
    }
  }, [
    loading.submitReject,
    approvedState["submittingReject"],
    approvedState["successRejectRequest"],
    approvedState["errorRejectRequest"],
  ]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  let userRegion = "", userDepartment = "",
    masterRegion = masterState["region"],
    masterDepartment = masterState["department"];
  userRegion = masterRegion.find(f => f.regionCode == form.region);
  userDepartment = masterDepartment.find(f => f.deptCode == form.department);
  let title = "";
  if (!isDetail && !requestDetail) {
    title = t("add_approved_assets:title");
  } else {
    if (isDetail && !requestDetail) {
      title =
        t("add_approved_assets:detail") +
        " #" +
        route.params?.data?.requestID;
    }
    if (!isDetail && requestDetail) {
      title = t("add_approved_assets:detail") + " #" + requestParam;
    }
  }
  return (
    <CContainer
      safeArea={["top", "bottom"]}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          title={title}
          back
          borderBottom
          customRightComponent={isDetail
            ? (
              <TopNavigationAction
                icon={RenderProcessIcon}
                onPress={handleShowProcess}
              />
            ) : undefined
          }
        />
      }>
      <KeyboardAwareScrollView contentContainerStyle={cStyles.p10}>
        <UserRequest
          avatar={null}
          fullName={form.name}
          job={authState["login"]["jobTitle"]}
          region={userRegion ? userRegion.regionName : ""}
          department={userDepartment ? userDepartment.deptName : ""}
        />

        <Card disabled
          style={cStyles.mt10}
          status="basic"
          header={propsH =>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, propsH.style]}>
              <View style={currentProcess ? styles.con_left : {}}>
                <Text category="s1">{t("add_approved_assets:request_info")}</Text>
              </View>
              {currentProcess && (
                <View style={styles.con_right}>
                  <CStatus
                    type="approved"
                    value={currentProcess.statusID}
                    label={currentProcess.statusName}
                  />
                </View>
              )}
            </View>
          }>
          {!loading.main && !loading.startFetch && !loading.startFetchLogin && (
            <CForm
              ref={formRef}
              loading={loading.submitAdd}
              inputs={[
                {
                  id: INPUT_NAME.DATE_REQUEST,
                  style: cStyles.mt5,
                  type: "datePicker",
                  label: "add_approved_assets:date_request",
                  holder: "add_approved_assets:date_request",
                  value: form.dateRequest,
                  disabled: true,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: "next",
                },
                {
                  id: INPUT_NAME.WHERE_USE,
                  type: "select",
                  label: "add_approved_assets:where_use",
                  holder: "add_approved_assets:holder_where_use",
                  value: form.whereUse,
                  values: masterState["department"],
                  keyToCompare: "deptCode",
                  keyToShow: "deptName",
                  disabled: isDetail || requestDetail,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
                {
                  id: INPUT_NAME.REASON,
                  type: "text",
                  label: "add_approved_assets:reason",
                  holder: "add_approved_assets:holder_reason",
                  value: form.reason,
                  disabled: isDetail || requestDetail,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
                {
                  id: INPUT_NAME.SUPPLIER,
                  type: "text",
                  label: "add_approved_assets:supplier",
                  holder: "add_approved_assets:holder_supplier",
                  value: form.supplier,
                  disabled: isDetail || requestDetail,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
                {
                  id: INPUT_NAME.TYPE_ASSETS,
                  type: "radio",
                  label: "add_approved_assets:type_assets",
                  holder: null,
                  value: form.typeAssets,
                  values: DATA_TYPE_ASSET,
                  keyToCompare: "value",
                  keyToShow: "label",
                  horizontal: true,
                  disabled: isDetail || requestDetail,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
                {
                  id: INPUT_NAME.IN_PLANNING,
                  type: "radio",
                  label: "add_approved_assets:in_planning",
                  holder: null,
                  value: form.inPlanning,
                  values: DATA_IN_PLANNING,
                  keyToCompare: "value",
                  keyToShow: "label",
                  horizontal: true,
                  disabled: isDetail || requestDetail,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
              ]}
              customAddingForm={
                <AssetsTable
                  style={cStyles.mt16}
                  loading={
                    loading.main ||
                    loading.submitAdd ||
                    loading.submitApproved ||
                    loading.submitReject
                  }
                  checking={loading.submitAdd}
                  isDetail={isDetail || requestDetail !== null}
                  assets={form.assets}
                  onCallbackValidate={onCallbackValidate}
                />
              }
              disabledButton={
                loading.main ||
                loading.submitAdd ||
                loading.submitApproved ||
                loading.submitReject
              }
              labelButton={(isDetail || requestDetail) ? "" : "add_approved_assets:send"}
              onSubmit={onSendRequest}
            />
          )}
        </Card>
      </KeyboardAwareScrollView>

      {/** Actions show approved/reject of request */}
      {isShowApprovedReject && (
        <FooterFormRequest
          loading={loading.main || loading.submitAdd}
          isDetail={
            isDetail ||
            (typeof requestParam !== "object" && requestParam !== -1)
          }
          onReject={handleReject}
          onApproved={toggleApproved}
        />
      )}

      {isShowApprovedReject && (
        <RejectModal
          showReject={showReject}
          description="add_approved_assets:message_confirm_reject"
          onReject={onReject}
          onCloseReject={handleReject}
        />
      )}

      {isShowApprovedReject && (
        <CAlert
          loading={loading.submitApproved}
          show={showConfirm}
          cancel
          label="add_approved_assets:label_confirm"
          message="add_approved_assets:message_confirm_approved"
          iconOk={RenderApprovedIcon}
          textOk="add_approved_assets:approved_now"
          statusOk="primary"
          onCancel={toggleApproved}
          onOk={onApproved}
        />
      )}

      {/** Actions show process of request */}
      {isDetail && (
        <CActionSheet actionRef={asProcessRef}>
          <RequestProcess data={process} />
        </CActionSheet>
      )}

      {!isDetail &&
        currentProcess &&
        typeof requestParam !== "object" &&
        requestParam !== -1 && (
        <CActionSheet actionRef={asProcessRef}>
          <RequestProcess data={process} />
        </CActionSheet>
      )}

      {/** Loading of page */}
      <CLoading
        show={
          loading.main ||
          loading.startFetch ||
          loading.startFetchLogin ||
          loading.submitAdd ||
          loading.submitApproved ||
          loading.submitReject
        }
        description={
          (loading.submitAdd || loading.submitApproved || loading.submitReject)
            ? "common:doing_send"
            : undefined}
      />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.7},
  con_right: {flex: 0.3},
});

export default AddRequest;
