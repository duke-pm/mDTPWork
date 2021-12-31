/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request lost damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  TopNavigationAction, Avatar, Card, Icon, Text,
} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CLoading from '~/components/CLoading';
import CAlert from '~/components/CAlert';
import CStatus from '~/components/CStatus';
import CActionSheet from '~/components/CActionSheet';
import RequestProcess from '../components/RequestProcess';
import RejectModal from '../components/RejectModal';
import FooterFormRequest from '../components/FooterFormRequest';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {Commons} from '~/utils/common';
import {getSecretInfo, checkEmpty, resetRoute} from '~/utils/helper';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
  AST_LOGIN,
} from '~/configs/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

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

const RenderProcessIcon = props => (
  <Icon {...props} name="list-outline" />
);

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
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const formatDate = commonState.get('formatDate');
  const language = commonState.get('language');
  moment.locale(language);

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
    id: '',
    name: authState.getIn(['login', 'fullName']),
    dateRequest: moment().format(formatDate),
    typeUpdate: Commons.APPROVED_TYPE.DAMAGED.value, // 2: Damage, 3: Lost
    assetID: '',
    file: null,
    fileBase64: '',
    personRequestId: '',
    reason: '',
    status: 1,
    isAllowApproved: false,
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
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
  const onBackToHome = () => resetRoute(navigation, Routes.TAB.name);

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onPrepareData = () => {
    let type = route.params?.type;
    if (type) setForm({...form, typeUpdate: type});
    let params = {
      EmpCode: authState.getIn(['login', 'empCode']),
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchAssetByUser(params));
    dispatch(Actions.resetAllApproved());
    setLoading({...loading, startFetch: true});
  };

  const onSendRequest = () => {
    setLoading({...loading, submitAdd: true});
    /** Set values for input */
    let tmpCallback = formRef.current?.onCallbackValue();
    console.log('[LOG] ===  ===> ', tmpCallback.valuesAll);
    /** prepare assets */
    let formData = new FormData();
    formData.append('EmpCode', authState.getIn(['login', 'empCode']));
    formData.append('DeptCode', authState.getIn(['login', 'deptCode']));
    formData.append('RegionCode', authState.getIn(['login', 'regionCode']));
    formData.append('JobTitle', authState.getIn(['login', 'jobTitle']));
    formData.append('RequestDate', tmpCallback.valuesAll[0].value);
    formData.append('Reasons', tmpCallback.valuesAll[2].value);
    formData.append(
      'TypeUpdate',
      form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
        ? 'Damage'
        : 'Lost',
    );
    if (tmpCallback.valuesAll[1].value !== '') {
      formData.append('AssetID', tmpCallback.valuesAll[1].values[tmpCallback.valuesAll[1].value]['assetID']);
    } else {
      return setLoading({...loading, submitAdd: false});
    }
    formData.append('Lang', language);
    if (form.file) {
      formData.append('FileUpload', {
        uri: form.file.path,
        type: form.file.type,
        name: form.file.name,
      });
    }
    let params = {RefreshToken: refreshToken, Lang: language};
    console.log('[LOG] === formData ===> ', formData);
    dispatch(Actions.fetchAddRequestLostDamage(params, formData, navigation));
  };

  const onPrepareDetail = (dataRequest, dataProcess) => {
    let tmp = {
      id: dataRequest ? dataRequest?.requestID : '',
      personRequestId: dataRequest ? dataRequest?.personRequestID : '',
      name: dataRequest ? dataRequest?.personRequest : '',
      dateRequest: dataRequest
        ? moment(dataRequest?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : moment().format(formatDate),
      department: dataRequest ? dataRequest?.deptCode : '',
      region: dataRequest ? dataRequest?.regionCode : '',
      assetID: dataRequest ? dataRequest?.assetID : '',
      reason: dataRequest ? dataRequest?.reason : '',
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
    setLoading({
      ...loading,
      main: false,
      startFetchLogin: false,
      startFetch: false,
    });
  };

  const onApproved = () => {
    let params = {
      RequestID: form.id,
      RequestTypeID: form.typeUpdate,
      PersonRequestID: form.personRequestId,
      Status: true,
      Reason: '',
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
      console.log('[LOG] === SignIn Local === ', dataLogin);
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
    let params = fromJS({
      RequestID: requestID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchRequestDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onCheckDeeplink = () => {
    if (typeof requestParam === 'object' || requestParam === -1) {
      onPrepareDetail(
        route.params?.data,
        route.params?.dataProcess,
      );
      setCurrentProcess({
        statusID: route.params?.currentProcess?.statusID,
        statusName: route.params?.currentProcess?.statusName,
      });
    } else {
      onPrepareData();
      onFetchRequestDetail(requestParam);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      onCheckDeeplink();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return onCheckDeeplink();
        }
        if (authState.get('errorLogin')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetchLogin,
    authState.get('submitting'),
    authState.get('successLogin'),
    authState.get('errorLogin'),
  ]);

  useEffect(() => {
    if (loading.startFetch) {
      if (!approvedState.get('submittingRequestDetail')) {
        if (approvedState.get('successRequestDetail')) {
          return onPrepareData();
        }

        if (approvedState.get('errorRequestDetail')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetch,
    approvedState.get('submittingRequestDetail'),
    approvedState.get('successRequestDetail'),
    approvedState.get('errorRequestDetail'),
  ]);

  useEffect(() => {
    if (loading.main && loading.startFetch) {
      if (!masterState.get('submitting')) {
        if (masterState.get('success')) {
          if (approvedState.get('requestDetail')) {
            let tmp = approvedState.get('requestDetail');
            setRequestDetail(tmp);
            setCurrentProcess({statusID: tmp.statusID, statusName: tmp.statusName});
            onPrepareDetail(
              approvedState.get('requestDetail'),
              approvedState.get('requestProcessDetail'),
            );
          } else {
            if (isDetail) {
              onPrepareDetail(route.params?.data, route.params?.dataProcess);
              setCurrentProcess({
                statusID: route.params?.currentProcess?.statusID,
                statusName: route.params?.currentProcess?.statusName,
              });
            } else {
              // do nothing
            }
          }
        }
      }
    }
  }, [
    loading.main,
    loading.startFetch,
    masterState.get('assetByUser'),
    masterState.get('submitting'),
    approvedState.get('requestDetail'),
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState.get('submittingAdd')) {
        if (approvedState.get('successAddRequest')) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('success:send_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorAddRequest')) {
          let tmpMsg = approvedState.get('errorHelperAddRequest');
          if (typeof tmpMsg !== 'string') {
            tmpMsg = t('error:add_request_lost_damage');
          }
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('common:app_name'),
            description: tmpMsg,
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitAdd,
    approvedState.get('submittingAdd'),
    approvedState.get('successAddRequest'),
    approvedState.get('errorAddRequest'),
  ]);

  useEffect(() => {
    if (loading.submitApproved) {
      if (!approvedState.get('submittingApproved')) {
        if (approvedState.get('successApprovedRequest')) {
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:approved_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorApprovedRequest')) {
          let tmpMsg = approvedState.get('errorHelperApprovedRequest');
          if (typeof tmpMsg !== 'string') {
            tmpMsg = t('error:approved_request_lost_damage');
          }
          toggleApproved();
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t('common:app_name'),
            description: tmpMsg,
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitApproved,
    approvedState.get('submittingApproved'),
    approvedState.get('successApprovedRequest'),
    approvedState.get('errorApprovedRequest'),
  ]);

  useEffect(() => {
    if (loading.submitReject) {
      if (!approvedState.get('submittingReject')) {
        setShowReject(false);
        if (approvedState.get('successRejectRequest')) {
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:reject_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorRejectRequest')) {
          let tmpMsg = approvedState.get('errorHelperRejectRequest');
          if (typeof tmpMsg !== 'string') {
            tmpMsg = t('error:reject_request_lost_damage');
          }
          handleReject();
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t('common:app_name'),
            description: tmpMsg,
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitReject,
    approvedState.get('submittingReject'),
    approvedState.get('successRejectRequest'),
    approvedState.get('errorRejectRequest'),
  ]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  let userRegion = '', userDepartment = '',
    masterRegion = masterState.get('region'),
    masterDepartment = masterState.get('department');
  userRegion = masterRegion.find(f => f.regionCode === form.region);
  userDepartment = masterDepartment.find(f => f.deptCode === form.department);
  let title = '';
  if (!isDetail && !requestDetail) {
    title = t('add_approved_lost_damaged:title');
  } else {
    let tmpID =
      isDetail && !requestDetail
        ? route.params?.data?.requestID
        : requestParam;
    if (form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value) {
      title = t('add_approved_lost_damaged:detail_damage') + ' #' + tmpID;
    } else {
      title = t('add_approved_lost_damaged:detail_lost') + ' #' + tmpID;
    }
  }
  return (
    <CContainer
      safeArea={['top', 'bottom']}
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
        <Card disabled
          status="primary"
          header={<Text category="s1">{t('add_approved_lost_damaged:request_user')}</Text>}>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <Avatar size="small" source={Assets.iconUser} />
              <View style={cStyles.ml10}>
                <Text>{form.name}</Text>
                <Text style={cStyles.mt5} category="c1" appearance="hint">
                  {userDepartment ? userDepartment.deptName : ''}
                </Text>
              </View>
            </View>
            <View style={cStyles.itemsEnd}>
              <Text>{userRegion ? userRegion.regionName : ''}</Text>
              <Text style={cStyles.mt5} category="c1" appearance="hint">
                {t('add_approved_lost_damaged:region')}
              </Text>
            </View>
          </View>
        </Card>
        {/** Asset information */}
        {(isDetail || requestDetail) && (
          <Card disabled
            style={cStyles.mt10}
            header={<Text category="s1">{t('add_approved_lost_damaged:request_asset')}</Text>}>
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
                          {t('add_approved_lost_damaged:code_asset')}
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
                      {t('add_approved_lost_damaged:purchase_date_asset')}
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
                        {t('add_approved_lost_damaged:group_asset')}
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
                      {t('add_approved_lost_damaged:status_asset')}
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
                      {t('add_approved_lost_damaged:price_asset')}
                    </Text>
                  </View>
                  <View style={cStyles.mt10}>
                    <Text>{isDetail
                      ? route.params?.data?.assetTypeName
                      : requestDetail.assetTypeName}
                    </Text>
                    <Text style={cStyles.mt5} category="c1" appearance="hint">
                      {t('add_approved_lost_damaged:type_asset')}
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
          header={propsH =>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, propsH.style]}>
              <View style={currentProcess ? styles.con_header_left : {}}>
                <Text category="s1">{t('add_approved_lost_damaged:request_info')}</Text>
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
          {!loading.main && (
            <CForm
              ref={formRef}
              loading={
                loading.main ||
                loading.startFetch ||
                loading.startFetchLogin ||
                loading.submitAdd
              }
              inputs={[
                {
                  id: INPUT_NAME.DATE_REQUEST,
                  style: cStyles.mt5,
                  type: 'datePicker',
                  label: 'add_approved_lost_damaged:date_request',
                  holder: 'add_approved_lost_damaged:date_request',
                  value: form.dateRequest,
                  disabled: true,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
                {
                  id: INPUT_NAME.ASSETID,
                  type: !isDetail ? 'select' : 'none',
                  label: 'add_approved_assets:assets',
                  holder: 'add_approved_assets:holder_assets',
                  value: form.assetID,
                  values: masterState.get('assetByUser'),
                  keyToCompare: 'assetID',
                  keyToShow: 'assetName',
                  disabled: isDetail || requestDetail,
                  hide: isDetail || requestDetail,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: 'done',
                },
                {
                  id: INPUT_NAME.REASON,
                  type: 'text',
                  label: 'add_approved_lost_damaged:reason',
                  holder: 'add_approved_lost_damaged:holder_reason',
                  value: form.reason,
                  disabled: isDetail || requestDetail,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: 'done',
                },
                {
                  id: INPUT_NAME.TYPE_UPDATE,
                  type: 'radio',
                  label: 'add_approved_lost_damaged:type_update',
                  holder: null,
                  value: form.typeUpdate,
                  values: DATA_TYPE,
                  keyToCompare: 'value',
                  keyToShow: "label",
                  horizontal: true,
                  disabled: isDetail || requestDetail,
                  required: false,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: 'done',
                },
              ]}
              disabledButton={
                loading.main ||
                loading.submitAdd ||
                loading.submitApproved ||
                loading.submitReject
              }
              labelButton={(isDetail || requestDetail) ? '' : 'common:send'}
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
            (typeof requestParam !== 'object' && requestParam !== -1)
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
        typeof requestParam !== 'object' &&
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
              ? 'add_approved_lost_damaged:message_confirm_reject_damage'
              : 'add_approved_lost_damaged:message_confirm_reject_lost'
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
          label={'add_approved_lost_damaged:label_confirm'}
          message={
            form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
              ? 'add_approved_lost_damaged:message_confirm_approved_damage'
              : 'add_approved_lost_damaged:message_confirm_approved_lost'
          }
          statusOk="primary"
          onCancel={toggleApproved}
          onOk={onApproved}
        />
      )}

      {/** Loading of page */}
      <CLoading show={
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
