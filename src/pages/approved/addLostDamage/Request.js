/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request lost damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import React, {createRef, useRef, useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {
  TopNavigationAction, Card, Icon, Text,
} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import {showMessage} from "react-native-flash-message";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
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
  checkEmpty,
  resetRoute,
} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
  AST_LOGIN,
} from "~/configs/constants";
/* REDUX */
import * as Actions from "~/redux/actions";

/** All ref */
const asProcessRef = createRef();

/** All init */
const DATA_TYPE = [
  {
    value: Commons.APPROVED_TYPE.DAMAGED.value,
    label: "add_approved_lost_damaged:damage_assets",
  },
  {
    value: Commons.APPROVED_TYPE.LOST.value,
    label: "add_approved_lost_damaged:lost_assets",
  },
];
const INPUT_NAME = {
  DATE_REQUEST: "dateRequest",
  ASSETID: "assetID",
  REASON: "reason",
  TYPE_UPDATE: "typeUpdate",
  FILE: "file",
};

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
  const refreshToken = authState["login"]["refreshToken"];
  const formatDate = commonState["formatDate"];
  const language = commonState["language"];
  moment.locale(language);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    startFetchDetails: false,
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
    name: authState["login"]["fullName"],
    dateRequest: moment().format(formatDate),
    typeUpdate: Commons.APPROVED_TYPE.DAMAGED.value, // 2: Damage, 3: Lost
    assetID: "",
    file: null,
    fileBase64: "",
    personRequestId: "",
    reason: "",
    status: 1,
    isAllowApproved: false,
    department: authState["login"]["deptCode"],
    region: authState["login"]["regionCode"],
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
  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onPrepareData = () => {
    let params2 = {
      listType: "Department, Region",
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params2, navigation));
  };

  const onGetAssetsByUser = () => {
    let params = {
      EmpCode: authState["login"]["empCode"],
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchAssetByUser(params, navigation));
  };

  const onSendRequest = () => {
    setLoading({...loading, submitAdd: true});
    /** Set values for input */
    let tmpCallback = formRef.current?.onCallbackValue();
    /** prepare assets */
    let formData = new FormData();
    formData.append("EmpCode", authState["login"]["empCode"]);
    formData.append("DeptCode", authState["login"]["deptCode"]);
    formData.append("RegionCode", authState["login"]["regionCode"]);
    formData.append("JobTitle", authState["login"]["jobTitle"]);
    formData.append("RequestDate", tmpCallback.valuesAll[0].value);
    formData.append("Reasons", tmpCallback.valuesAll[2].value);
    formData.append(
      "TypeUpdate",
      tmpCallback.valuesAll[3].values[tmpCallback.valuesAll[3].value].value === Commons.APPROVED_TYPE.DAMAGED.value
        ? "Damage"
        : "Lost",
    );
    if (tmpCallback.valuesAll[1].value !== "") {
      formData.append("AssetID", tmpCallback.valuesAll[1].values[tmpCallback.valuesAll[1].value]["assetID"]);
    } else {
      return setLoading({...loading, submitAdd: false});
    }
    formData.append("Lang", language);
    if (form.file) {
      formData.append("FileUpload", {
        uri: form.file.path,
        type: form.file.type,
        name: form.file.name,
      });
    }
    let params = {RefreshToken: refreshToken, Lang: language};
    dispatch(Actions.fetchAddRequestLostDamage(params, formData, navigation));
  };

  const onPrepareDetail = (dataRequest, dataProcess) => {
    let tmp = {
      id: dataRequest ? dataRequest?.requestID : "",
      personRequestId: dataRequest
        ? dataRequest?.personRequestID
        : Number(authState["login"]["userId"]),
      name: dataRequest
        ? dataRequest?.personRequest
        : authState["login"]["fullName"],
      dateRequest: dataRequest
        ? moment(dataRequest?.requestDate, DEFAULT_FORMAT_DATE_4).format(formatDate)
        : moment().format(formatDate),
      department: dataRequest
        ? dataRequest?.deptCode
        : authState["login"]["deptCode"],
      region: dataRequest
        ? dataRequest?.regionCode
        : authState["login"]["regionCode"],
      assetID: dataRequest ? dataRequest?.assetID : "",
      reason: dataRequest ? dataRequest?.reason : "",
      typeUpdate: dataRequest
        ? dataRequest?.requestTypeID
        : Commons.APPROVED_TYPE.DAMAGED.value,
      status: dataRequest ? dataRequest?.statusID : 1,
      isAllowApproved: dataRequest ? dataRequest?.isAllowApproved : false,
      file: dataRequest ? dataRequest?.attachFiles : null,
    };

    // If data have any more process
    if (dataProcess && dataProcess.length > 0) {
      setProcess(dataProcess);
    }
    // Apply to form
    setForm(tmp);
    if (dataRequest) {
      setLoading({
        ...loading,
        main: false,
        startFetchLogin: false,
        startFetch: false,
        startFetchDetails: false,
      });
    }
  };

  const onApproved = () => {
    let params = {
      RequestID: form.id,
      RequestTypeID: form.typeUpdate,
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
      RequestTypeID: form.typeUpdate,
      PersonRequestID: form.personRequestId,
      Status: false,
      Reason: reason,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchRejectRequest(params, navigation));
    return setLoading({...loading, submitReject: true});
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
  };

  const onCheckDeeplink = () => {
    onPrepareData();
    if (typeof requestParam === "object" || requestParam === -1) {
      setCurrentProcess({
        statusID: route.params?.currentProcess?.statusID,
        statusName: route.params?.currentProcess?.statusName,
      });
      onPrepareDetail(
        route.params?.data,
        route.params?.dataProcess,
      );
    }
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
        if (masterState["department"].length > 0) {
          dispatch(Actions.resetStatusMasterData());
          setLoading({...loading, main: false, startFetch: true});
          onGetAssetsByUser();
        }
      }
    }
  }, [
    loading.main,
    masterState["submitting"],
    masterState["department"],
  ]);

  useEffect(() => {
    if (loading.startFetch && !loading.startFetchDetails) {
      if (!masterState["submitting"]) {
        if (masterState["success"] && !masterState["error"]) {
          if (isDetail) {
            onPrepareDetail(route.params?.data, route.params?.dataProcess);
            setCurrentProcess({
              statusID: route.params?.currentProcess?.statusID,
              statusName: route.params?.currentProcess?.statusName,
            });
          } else {
            if (requestParam === -1) {
              setLoading({...loading, startFetch: false, startFetchLogin: false});
            } else {
              onFetchRequestDetail(requestParam);
              setLoading({...loading, startFetchDetails: true});
            }
          }
        }
      }
    }
  }, [
    loading.startFetch,
    masterState["submitting"],
    masterState["success"],
    masterState["error"],
    approvedState["requestDetail"],
  ]);

  useEffect(() => {
    if (loading.startFetchDetails) {
      if (!approvedState["submittingRequestDetail"]) {
        if (approvedState["successRequestDetail"]) {
          let tmp = approvedState["requestDetail"];
          if (tmp) {
            setRequestDetail(tmp);
            setCurrentProcess({statusID: tmp.statusID, statusName: tmp.statusName});
            onPrepareDetail(
              tmp,
              approvedState["requestProcessDetail"],
            );
          }
        }
      }
    }
  }, [
    loading.startFetchDetails,
    approvedState["submittingRequestDetail"],
    approvedState["successRequestDetail"],
    approvedState["requestDetail"],
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState["submittingAdd"]) {
        if (approvedState["successAddRequest"]) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t("success:send_request"),
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
            tmpMsg = t("error:add_request_lost_damage");
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
            tmpMsg = t("error:approved_request_lost_damage");
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
            tmpMsg = t("error:reject_request_lost_damage");
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
    title = t("add_approved_lost_damaged:title");
  } else {
    let tmpID =
    isDetail && !requestDetail
    ? route.params?.data?.requestID
    : requestParam;
    if (form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value) {
      title = t("add_approved_lost_damaged:detail_damage") + " #" + tmpID;
    } else {
      title = t("add_approved_lost_damaged:detail_lost") + " #" + tmpID;
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

        {/** Asset information */}
        {(isDetail || requestDetail) && (
          <Card disabled
            style={cStyles.mt10}
            status="basic"
            header={<Text category="s1">{t("add_approved_lost_damaged:request_asset")}</Text>}>
            <View>
              <Text style={cStyles.fontBold}>{isDetail
                ? route.params?.data?.assetName
                : requestDetail.assetName}
              </Text>
              <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween, cStyles.mt10]}>
                <View style={[cStyles.itemsStart, styles.con_asset_left]}>
                  {((isDetail && route.params?.data?.assetCode)
                    || requestDetail?.assetCode) && (
                      <View>
                        <Text>{isDetail
                          ? route.params?.data?.assetCode
                          : requestDetail?.assetCode}
                        </Text>
                        <Text style={cStyles.mt5} category="c1" appearance="hint">
                          {t("add_approved_lost_damaged:code_asset")}
                        </Text>
                      </View>
                    )}
                  <View style={((isDetail && route.params?.data?.assetCode)
                    || requestDetail?.assetCode) ? cStyles.mt10 : {}}>
                    <Text>{moment(
                        isDetail
                          ? route.params?.data?.purchaseDate
                          : requestDetail.purchaseDate,
                        DEFAULT_FORMAT_DATE_4,
                      ).format(DEFAULT_FORMAT_DATE_9)}
                    </Text>
                    <Text style={cStyles.mt5} category="c1" appearance="hint">
                      {t("add_approved_lost_damaged:purchase_date_asset")}
                    </Text>
                  </View>
                  {((isDetail && route.params?.data?.assetGroupName) 
                    || requestDetail.assetGroupName) && (
                    <View style={cStyles.mt10}>
                      <Text>{isDetail
                        ? route.params?.data?.assetGroupName
                        : requestDetail.assetGroupName}
                      </Text>
                      <Text style={cStyles.mt5} category="c1" appearance="hint">
                        {t("add_approved_lost_damaged:group_asset")}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[cStyles.itemsStart, styles.con_asset_right]}>
                  <View>
                    <Text>{isDetail
                      ? route.params?.data?.assetStatusName
                      : requestDetail.assetStatusName}
                    </Text>
                    <Text style={cStyles.mt5} category="c1" appearance="hint">
                      {t("add_approved_lost_damaged:status_asset")}
                    </Text>
                  </View>
                  <View style={cStyles.mt10}>
                    <Text>{checkEmpty(
                      isDetail
                        ? route.params?.data?.originalPrice
                        : requestDetail.originalPrice,
                      null,
                      true)}
                    </Text>
                    <Text style={cStyles.mt5} category="c1" appearance="hint">
                      {t("add_approved_lost_damaged:price_asset")}
                    </Text>
                  </View>
                  <View style={cStyles.mt10}>
                    <Text>{isDetail
                      ? route.params?.data?.assetTypeName
                      : requestDetail.assetTypeName}
                    </Text>
                    <Text style={cStyles.mt5} category="c1" appearance="hint">
                      {t("add_approved_lost_damaged:type_asset")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        )}
        {/** Form request */}
        <Card disabled
          style={cStyles.mt10}
          status="basic"
          header={propsH =>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, propsH.style]}>
              <View style={currentProcess ? styles.con_header_left : {}}>
                <Text category="s1">{t("add_approved_lost_damaged:request_info")}</Text>
              </View>
              {currentProcess && (
                <View style={styles.con_header_right}>
                  <CStatus
                    type="approved"
                    value={currentProcess.statusID}
                    label={currentProcess.statusName}
                  />
                </View>
              )}
            </View>
          }>
          {!loading.main &&
            !loading.startFetch &&
            !loading.startFetchLogin && (
            <CForm
              ref={formRef}
              loading={loading.submitAdd}
              inputs={[
                {
                  id: INPUT_NAME.DATE_REQUEST,
                  style: cStyles.mt5,
                  type: "datePicker",
                  label: "add_approved_lost_damaged:date_request",
                  holder: "add_approved_lost_damaged:date_request",
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
                  id: INPUT_NAME.ASSETID,
                  type: !isDetail ? "select" : "none",
                  label: "add_approved_lost_damaged:assets",
                  holder: "add_approved_lost_damaged:holder_assets",
                  value: form.assetID,
                  values: masterState["assetByUser"],
                  keyToCompare: "assetID",
                  keyToShow: "assetName",
                  disabled: isDetail || requestDetail,
                  hide: isDetail || requestDetail,
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
                  label: "add_approved_lost_damaged:reason",
                  holder: "add_approved_lost_damaged:holder_reason",
                  value: form.reason,
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
                  id: INPUT_NAME.TYPE_UPDATE,
                  type: "radio",
                  label: "add_approved_lost_damaged:type_update",
                  holder: null,
                  value: form.typeUpdate,
                  values: DATA_TYPE,
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
              disabledButton={
                loading.main ||
                loading.submitAdd ||
                loading.submitApproved ||
                loading.submitReject
              }
              labelButton={(isDetail || requestDetail) ? "" : "add_approved_lost_damaged:send"}
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

      {isShowApprovedReject && (
        <RejectModal
          showReject={showReject}
          description={
            form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
              ? "add_approved_lost_damaged:message_confirm_reject_damage"
              : "add_approved_lost_damaged:message_confirm_reject_lost"
          }
          onReject={onReject}
          onCloseReject={handleReject}
        />
      )}

      {isShowApprovedReject && (
        <CAlert
          loading={loading.submitApproved}
          show={showConfirm}
          cancel
          label="add_approved_lost_damaged:label_confirm"
          message={
            form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
              ? "add_approved_lost_damaged:message_confirm_approved_damage"
              : "add_approved_lost_damaged:message_confirm_approved_lost"
          }
          iconOk={RenderApprovedIcon}
          textOk="add_approved_lost_damaged:approved_now"
          statusOk="primary"
          onCancel={toggleApproved}
          onOk={onApproved}
        />
      )}

      {/** Loading of page */}
      <CLoading show={
        loading.main ||
        loading.startFetch ||
        loading.startFetchDetails ||
        loading.startFetchLogin ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      } />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  con_asset_left: {flex: 0.5},
  con_asset_right: {flex: 0.5},
  con_header_left: {flex: 0.7},
  con_header_right: {flex: 0.3},
});

export default AddRequest;
