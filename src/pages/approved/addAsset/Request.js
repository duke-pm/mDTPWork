/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request assets
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Avatar, Button, Card, Icon, TopNavigationAction} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CText from '~/components/CText';
import CForm from '~/components/CForm';
import CLoading from '~/components/CLoading';
import CAlert from '~/components/CAlert';
import CActionSheet from '~/components/CActionSheet';
import RequestProcess from '../components/RequestProcess';
import AssetsTable, {WIDTH_ITEM_TABLE} from '../components/AssetsTable';
import RejectModal from '../components/RejectModal';
import FooterFormRequest from '../components/FooterFormRequest';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Assets} from '~/utils/asset';
import {Commons, Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4,
  AST_LOGIN,
} from '~/configs/constants';
import {getSecretInfo, resetRoute} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All ref */
const asProcessRef = createRef();

/** All init */
const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME: 'name',
  DEPARTMENT: 'department',
  REGION: 'region',
  ASEETS: 'assets',
  WHERE_USE: 'whereUse',
  REASON: 'reason',
  TYPE_ASSETS: 'typeAssets',
  IN_PLANNING: 'inPlanning',
  SUPPLIER: 'supplier',
};
const DATA_TYPE_ASSET = [
  {
    value: 'N',
    label: 'add_approved_assets:buy_new',
  },
  {
    value: 'A',
    label: 'add_approved_assets:additional',
  },
];
const DATA_IN_PLANNING = [
  {
    value: true,
    label: 'add_approved_assets:yes',
  },
  {
    value: false,
    label: 'add_approved_assets:no',
  },
];

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
  const formatDate = commonState.get('formatDate');
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

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
  const [whereUse, setWhereUse] = useState(0);
  const [form, setForm] = useState({
    id: '',
    personRequestId: '',
    dateRequest: moment().format(formatDate),
    name: authState.getIn(['login', 'fullName']),
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
    assets: {
      width: WIDTH_ITEM_TABLE,
      header: [
        '',
        t('add_approved_assets:description'),
        t('add_approved_assets:amount'),
        t('add_approved_assets:price'),
        t('add_approved_assets:total'),
      ],
      data: [[null, '', '', '', '']],
    },
    whereUse: authState.getIn(['login', 'deptCode']),
    reason: '',
    typeAssets: 'N',
    inPlanning: false,
    supplier: '',
    status: 1,
    isAllowApproved: false,
    refsAssets: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleShowProcess = () => asProcessRef.current?.show();

  const handleBack = () => resetRoute(navigation, Routes.TAB.name);

  const handleReject = () => setShowReject(!showReject);

  const toggleApproved = () => setShowConfirm(!showConfirm);

  /**********
   ** FUNC **
   **********/
  const onSendRequest = () => setLoading({...loading, submitAdd: true});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onPrepareData = () => {
    dispatch(Actions.resetAllApproved());
  };

  const onPrepareDetail = (dataRequest, dataAssets, dataProcess) => {
    let tmp = {
      id: dataRequest ? dataRequest?.requestID : '',
      personRequestId: dataRequest ? dataRequest?.personRequestID : '',
      dateRequest: dataRequest
        ? moment(dataRequest?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : moment().format(formatDate),
      name: dataRequest ? dataRequest?.personRequest : '',
      department: dataRequest ? dataRequest?.deptCode : '',
      region: dataRequest ? dataRequest?.regionCode : '',
      assets: {
        width: WIDTH_ITEM_TABLE,
        header: [
          '',
          t('add_approved_assets:description'),
          t('add_approved_assets:amount'),
          t('add_approved_assets:price'),
          t('add_approved_assets:total'),
        ],
        data: [[null, '', '', '', '']],
      },
      whereUse: dataRequest ? dataRequest?.locationCode : '',
      reason: dataRequest ? dataRequest?.reason : '',
      typeAssets: dataRequest ? dataRequest?.docType : 'N',
      inPlanning: dataRequest ? dataRequest?.isBudget : false,
      supplier: dataRequest ? dataRequest?.supplierName : '',
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
          '',
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

    // Find where use assets
    let data = masterState.get('department');
    let find = data.findIndex(f => f.deptCode === dataRequest.locationCode);
    if (find !== -1) {
      setWhereUse(find);
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
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value,
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
          UnitPrice: item[3] === '' ? 0 : Number(item[3]),
          TotalAmt: item[4] === '' ? 0 : Number(item[4]),
        });
      }
      let params = {
        EmpCode: authState.getIn(['login', 'empCode']),
        DeptCode: authState.getIn(['login', 'deptCode']),
        RegionCode: authState.getIn(['login', 'regionCode']),
        JobTitle: authState.getIn(['login', 'jobTitle']),
        RequestDate: tmpCallback.valuesAll[0].value,
        Location: tmpCallback.valuesAll[4].values[tmpCallback.valuesAll[4].value]['deptCode'],
        Reason: tmpCallback.valuesAll[5].value.trim(),
        DocType: tmpCallback.valuesAll[7].values[tmpCallback.valuesAll[7].value]['value'],
        IsBudget: tmpCallback.valuesAll[8].values[tmpCallback.valuesAll[8].value]['value'],
        SupplierName: tmpCallback.valuesAll[6].value.trim(),
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
      onPrepareData();
    } else {
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
    if (loading.main) {
      if (!masterState.get('submitting')) {
        if (masterState.get('department').length > 0) {
          if (approvedState.get('requestDetail')) {
            let statusIcon = Icons.request;
            let statusColor = 'orange';
            let tmp = approvedState.get('requestDetail');
            if (tmp.statusID === Commons.STATUS_REQUEST.APPROVED.value) {
              statusIcon = Icons.requestApproved_1;
              statusColor = 'blue';
            } else if (tmp.statusID === Commons.STATUS_REQUEST.REJECT.value) {
              statusIcon = Icons.requestRejected;
              statusColor = 'red';
            } else if (tmp.statusID === Commons.STATUS_REQUEST.DONE.value) {
              statusIcon = Icons.requestApproved_2;
              statusColor = 'green';
            }
            setRequestDetail(tmp);
            setCurrentProcess({statusIcon, statusColor, statusName: tmp.statusName});
            onPrepareDetail(
              approvedState.get('requestDetail'),
              approvedState.get('requestAssetsDetail'),
              approvedState.get('requestProcessDetail'),
            );
          } else {
            if (isDetail) {
              onPrepareDetail(
                route.params?.data,
                route.params?.dataDetail,
                route.params?.dataProcess,
              );
              setCurrentProcess({
                statusIcon: route.params?.currentProcess?.statusIcon,
                statusColor: route.params?.currentProcess?.statusColor,
                statusName: route.params?.currentProcess?.statusName,
              });
            } else {
              let data = masterState.get('department');
              let find = data.findIndex(f => f.deptCode === form.department);
              if (find !== -1) {
                setWhereUse(find);
              }
              setLoading({...loading, main: false, startFetchLogin: false});
            }
          }
        }
      }
    }
  }, [
    loading.main,
    masterState.get('submitting'),
    masterState.get('department'),
    approvedState.get('requestDetail'),
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState.get('submittingAdd')) {
        if (approvedState.get('successAddRequest')) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:send_request'),
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
            tmpMsg = t('error:add_request_assets');
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
            tmpMsg = t('error:approved_request_assets');
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
            tmpMsg = t('error:reject_request_assets');
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

  // useLayoutEffect(() => {
  //   let title = '';
  //   if (!isDetail && !requestDetail) {
  //     title = t('add_approved_assets:title');
  //   } else {
  //     if (isDetail && !requestDetail) {
  //       title =
  //         t('add_approved_assets:detail') +
  //         ' #' +
  //         route.params?.data?.requestID;
  //     }
  //     if (!isDetail && requestDetail) {
  //       title = t('add_approved_assets:detail') + ' #' + requestParam;
  //     }
  //   }

  //   navigation.setOptions(
  //     Object.assign(
  //       {
  //         title,
  //         backButtonInCustomView: true,
  //         headerLeft: () =>
  //           (route.params?.requestID !== null ||
  //             route.params?.requestID !== undefined) && (
  //             <CIconHeader
  //               icons={[
  //                 {
  //                   show: !navigation.canGoBack(),
  //                   showRedDot: false,
  //                   icon: IS_IOS ? Icons.backiOS : Icons.backAndroid,
  //                   iconColor: customColors.icon,
  //                   onPress: handleBack,
  //                 },
  //               ]}
  //             />
  //           ),
  //       },
  //       IS_ANDROID
  //         ? {
  //             headerCenter: () => (
  //               <CText
  //                 customStyles={cStyles.textHeadline}
  //                 label={'add_approved_assets:detail'}
  //               />
  //             ),
  //           }
  //         : {},
  //     ),
  //   );
  // }, [navigation, isDetail, requestDetail]);

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
    title = t('add_approved_assets:title');
  } else {
    if (isDetail && !requestDetail) {
      title =
        t('add_approved_assets:detail') +
        ' #' +
        route.params?.data?.requestID;
    }
    if (!isDetail && requestDetail) {
      title = t('add_approved_assets:detail') + ' #' + requestParam;
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
      <KeyboardAwareScrollView contentContainerStyle={[cStyles.px16, cStyles.py10]}>
        <Card disabled
          status="primary"
          header={<CText category="s1">{t('add_approved_assets:request_user')}</CText>}>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <Avatar size="small" source={Assets.iconUser} />
              <View style={cStyles.ml10}>
                <CText category="s1">{form.name}</CText>
                <CText category="c1" appearance="hint">
                  {userDepartment ? userDepartment.deptName : ''}
                </CText>
              </View>
            </View>
            <View style={cStyles.itemsEnd}>
              <CText style={cStyles.textRight}>{userRegion ? userRegion.regionName : ''}</CText>
              <CText style={cStyles.textRight} category="c1" appearance="hint">
                {t('add_approved_assets:region')}
              </CText>
            </View>
          </View>
        </Card>

        <Card disabled
          style={cStyles.mt10}
          header={propsH =>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, propsH.style]}>
              <View style={currentProcess ? styles.con_left : {}}>
                <CText category="s1">{t('add_approved_assets:request_info')}</CText>
              </View>
              {currentProcess && (
                <View style={[cStyles.itemsEnd, styles.con_right]}>
                  <Button
                    size="tiny"
                    status={currentProcess.statusColor}>
                    {currentProcess.statusName}
                  </Button>
                </View>
              )}
            </View>
          }>
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
                label: 'add_approved_assets:date_request',
                holder: 'add_approved_assets:date_request',
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
                id: INPUT_NAME.WHERE_USE,
                type: 'select',
                label: 'add_approved_assets:where_use',
                holder: 'add_approved_assets:where_use',
                value: form.whereUse,
                values: masterState.get('department'),
                keyToCompare: 'deptCode',
                keyToShow: 'deptName',
                disabled: isDetail,
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
                label: 'add_approved_assets:reason',
                holder: 'add_approved_assets:holder_reason',
                value: form.reason,
                disabled: isDetail,
                required: false,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
              },
              {
                id: INPUT_NAME.SUPPLIER,
                type: 'text',
                label: 'add_approved_assets:supplier',
                holder: 'add_approved_assets:holder_supplier',
                value: form.supplier,
                disabled: isDetail,
                required: false,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
              },
              {
                id: INPUT_NAME.TYPE_ASSETS,
                type: 'radio',
                label: 'add_approved_assets:type_assets',
                holder: null,
                value: form.typeAssets,
                values: DATA_TYPE_ASSET,
                keyToCompare: 'value',
                keyToShow: "label",
                disabled: isDetail,
                required: false,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
              },
              {
                id: INPUT_NAME.IN_PLANNING,
                type: 'radio',
                label: 'add_approved_assets:in_planning',
                holder: null,
                value: form.inPlanning,
                values: DATA_IN_PLANNING,
                keyToCompare: 'value',
                keyToShow: "label",
                disabled: isDetail,
                required: false,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
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
                isDetail={isDetail || requestDetail}
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
            labelButton={isDetail ? '' : 'common:send'}
            onSubmit={onSendRequest}
          />
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

      {isShowApprovedReject && (
        <RejectModal
          showReject={showReject}
          description={'add_approved_assets:message_confirm_reject'}
          onReject={onReject}
          onCloseReject={handleReject}
        />
      )}

      {isShowApprovedReject && (
        <CAlert
          loading={loading.submitApproved}
          show={showConfirm}
          cancel
          label={'add_approved_assets:label_confirm'}
          message={'add_approved_assets:message_confirm_approved'}
          statusOk='success'
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
        typeof requestParam !== 'object' &&
        requestParam !== -1 && (
        <CActionSheet actionRef={asProcessRef}>
          <RequestProcess data={process} />
        </CActionSheet>
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
  con_left: {flex: 0.7},
  con_right: {flex: 0.3},
});

export default AddRequest;
