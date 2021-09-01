/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request assets
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useEffect, useState, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet, View} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CAlert from '~/components/CAlert';
import CActionSheet from '~/components/CActionSheet';
import CLabel from '~/components/CLabel';
import CGroupInfo from '~/components/CGroupInfo';
import CIcon from '~/components/CIcon';
import CActivityIndicator from '~/components/CActivityIndicator';
import CTouchable from '~/components/CTouchable';
import RejectModal from '../components/RejectModal';
import AssetsTable, {widthItemTable} from '../components/AssetsTable';
import CheckOption from '../components/CheckOption';
import Process from '../components/Process';
import FooterFormRequest from '../components/FooterFormRequest';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import FieldsAuth from '~/config/fieldsAuth';
import {Commons, Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK, DEFAULT_FORMAT_DATE_4, LOGIN} from '~/config/constants';
import {
  checkEmpty,
  getSecretInfo,
  IS_ANDROID,
  moderateScale,
  resetRoute,
  verticalScale,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const RowSelect = React.memo(
  ({
    loading = false,
    disabled = false,
    isDark = false,
    customColors = {},
    data = [],
    activeIndex = -1,
    keyToShow = '',
    keyToCompare = '',
    onPress = () => null,
  }) => {
    let findRow = null;
    if (data && data.length > 0) {
      findRow = data.find(f => f[keyToCompare] === activeIndex);
    }
    return (
      <CTouchable
        containerStyle={cStyles.mt6}
        disabled={disabled}
        onPress={onPress}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px10,
            cStyles.rounded1,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            disabled && {backgroundColor: customColors.cardDisable},
            styles.row_select,
          ]}>
          {!loading ? (
            <CText
              customLabel={findRow ? checkEmpty(findRow[keyToShow]) : '-'}
            />
          ) : (
            <CActivityIndicator />
          )}
          {!disabled && (
            <CIcon
              name={Icons.down}
              size={'medium'}
              customColor={
                disabled ? customColors.textDisable : customColors.icon
              }
            />
          )}
        </View>
      </CTouchable>
    );
  },
);

/** All refs */
const asDepartmentRef = createRef();
let supplierRef = createRef();
let newRef = createRef();
let addRef = createRef();
let yesRef = createRef();
let noRef = createRef();

/** All init value */
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
const dataTypeAssets = [
  {
    ref: newRef,
    value: 'N',
    label: 'add_approved_assets:buy_new',
  },
  {
    ref: addRef,
    value: 'A',
    label: 'add_approved_assets:additional',
  },
];
const dataInPlanning = [
  {
    ref: yesRef,
    value: true,
    label: 'add_approved_assets:yes',
  },
  {
    ref: noRef,
    value: false,
    label: 'add_approved_assets:no',
  },
];

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;
  let requestParam = route.params?.data || -1;
  if (requestParam === -1) {
    requestParam = route.params?.requestID || -1;
  }

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
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
  const [findWhereUse, setFindWhereUse] = useState('');
  const [dataWhereUse, setDataWhereUse] = useState([]);
  const [form, setForm] = useState({
    id: '',
    personRequestId: '',
    dateRequest: Configs.toDay.format(formatDate),
    name: authState.getIn(['login', 'fullName']),
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
    assets: {
      width: widthItemTable,
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
  const handleReject = () => setShowReject(true);

  const handleApproved = () => setShowConfirm(!showConfirm);

  const handleChangeInput = inputRef => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  const handleChangeText = (value, nameInput) => {
    setForm({...form, [nameInput]: value});
  };

  const handleChangeWhereUse = () => {
    let department = null;
    if (findWhereUse === '') {
      let tmp = masterState.get('department');
      department = tmp[whereUse];
    } else {
      if (dataWhereUse.length > 0) {
        department = dataWhereUse[whereUse];
      }
    }
    if (department) {
      setForm({
        ...form,
        whereUse: department[Commons.SCHEMA_DROPDOWN.DEPARTMENT.value],
      });
    }
    asDepartmentRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onChangeWhereUse = index => setWhereUse(index);

  const onCloseReject = () => setShowReject(false);

  const onSendRequest = () => setLoading({...loading, submitAdd: true});

  const onCallbackTypeAsset = newVal => setForm({...form, typeAssets: newVal});

  const onCallbackInplanning = newVal => setForm({...form, inPlanning: newVal});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);

  const onPrepareData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
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
        : Configs.toDay.format(formatDate),
      name: dataRequest ? dataRequest?.personRequest : '',
      department: dataRequest ? dataRequest?.deptCode : '',
      region: dataRequest ? dataRequest?.regionCode : '',
      assets: {
        width: widthItemTable,
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
    if (dataAssets) {
      if (dataAssets.length > 0) {
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
    }
    if (dataProcess && dataProcess.length > 0) {
      setProcess(dataProcess);
    }
    let data = masterState.get('department');
    let find = data.findIndex(f => f.deptCode === dataRequest.locationCode);
    if (find !== -1) {
      setWhereUse(find);
    }
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
    setLoading({...loading, submitApproved: true});
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
    setLoading({...loading, submitReject: true});
  };

  const onSearchFilter = text => {
    if (text) {
      const newData = dataWhereUse.filter(function (item) {
        const itemData = item[Commons.SCHEMA_DROPDOWN.DEPARTMENT.label]
          ? item[Commons.SCHEMA_DROPDOWN.DEPARTMENT.label].toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataWhereUse(newData);
      setFindWhereUse(text);
      if (newData.length > 0) {
        setWhereUse(0);
      }
    } else {
      setDataWhereUse(masterState.get('department'));
      setFindWhereUse(text);
      setWhereUse(0);
    }
  };

  const onCallbackValidate = data => {
    if (!data.status) {
      /** prepare assets */
      let assets = [],
        item = null;
      for (item of data.data) {
        assets.push({
          Descr: item[0],
          Qty: Number(item[1]),
          UnitPrice: item[2] === '' ? 0 : Number(item[2]),
          TotalAmt: item[3] === '' ? 0 : Number(item[3]),
        });
      }

      let params = {
        EmpCode: authState.getIn(['login', 'empCode']),
        DeptCode: authState.getIn(['login', 'deptCode']),
        RegionCode: authState.getIn(['login', 'regionCode']),
        JobTitle: authState.getIn(['login', 'jobTitle']),
        RequestDate: form.dateRequest,
        Location: form.whereUse,
        Reason: form.reason,
        DocType: form.typeAssets,
        IsBudget: form.inPlanning,
        SupplierName: form.supplier,
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
    let dataLogin = await getSecretInfo(LOGIN);
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
          setDataWhereUse(masterState.get('department'));
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
            setCurrentProcess({statusIcon, statusColor});
            setRequestDetail(tmp);
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
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('common:app_name'),
            description: t('error:add_request_assets'),
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
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t('common:app_name'),
            description: t('error:approved_request_assets'),
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
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t('common:app_name'),
            description: t('error:reject_request_assets'),
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

  useLayoutEffect(() => {
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
    navigation.setOptions({title});
  }, [navigation, isDetail, requestDetail]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  return (
    <CContainer
      loading={
        loading.main ||
        loading.startFetch ||
        loading.startFetchLogin ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_APPROVED}
      primaryColorShapesDark={colors.BG_HEADER_APPROVED_DARK}
      content={
        <KeyboardAwareScrollView>
          {/** Process of request */}
          {isDetail && !currentProcess && (
            <Process
              data={process}
              isDark={isDark}
              customColors={customColors}
              statusColor={route.params.currentProcess.statusColor}
              statusName={route.params.data.statusName}
              statusIcon={route.params.currentProcess.statusIcon}
              statusID={route.params.data.statusID}
            />
          )}

          {!isDetail &&
            currentProcess &&
            typeof requestParam !== 'object' &&
            requestParam !== -1 && (
              <Process
                data={process}
                isDark={isDark}
                customColors={customColors}
                statusColor={currentProcess.statusColor}
                statusName={requestDetail.statusName}
                statusIcon={currentProcess.statusIcon}
                statusID={requestDetail.statusID}
              />
            )}

          {/** User request */}
          <CGroupInfo
            style={cStyles.pt16}
            label={'add_approved_assets:info_user_request'}
            content={
              <>
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyBetween,
                  ]}>
                  {/** Date request */}
                  <CInput
                    containerStyle={[cStyles.mr5, styles.left]}
                    name={INPUT_NAME.DATE_REQUEST}
                    label={'add_approved_assets:date_request'}
                    value={moment(form.dateRequest).format(formatDateView)}
                    disabled
                    dateTimePicker
                  />

                  {/** Region */}
                  <View style={[cStyles.ml5, styles.right]}>
                    <CLabel bold label={'add_approved_assets:region'} />
                    <RowSelect
                      disabled
                      loading={loading.main}
                      isDark={isDark}
                      customColors={customColors}
                      data={masterState.get('region')}
                      activeIndex={form.region}
                      keyToShow={Commons.SCHEMA_DROPDOWN.REGION.label}
                      keyToCompare={Commons.SCHEMA_DROPDOWN.REGION.value}
                      onPress={null}
                    />
                  </View>
                </View>

                {/** Name */}
                <CInput
                  containerStyle={cStyles.mt16}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.NAME}
                  label={'add_approved_assets:name'}
                  holder={'add_approved_assets:name'}
                  value={form.name}
                  disabled
                />

                {/** Department */}
                <View style={cStyles.pt16}>
                  <CLabel bold label={'add_approved_assets:department'} />
                  <RowSelect
                    disabled
                    loading={loading.main}
                    isDark={isDark}
                    customColors={customColors}
                    data={masterState.get('department')}
                    activeIndex={form.department}
                    keyToShow={Commons.SCHEMA_DROPDOWN.DEPARTMENT.label}
                    keyToCompare={Commons.SCHEMA_DROPDOWN.DEPARTMENT.value}
                    onPress={null}
                  />
                </View>

                {/** Where use */}
                <View style={cStyles.pt16}>
                  <CLabel bold label={'add_approved_assets:where_use'} />
                  <RowSelect
                    disabled={
                      loading.main ||
                      loading.submitAdd ||
                      isDetail ||
                      requestDetail
                    }
                    loading={loading.main}
                    isDark={isDark}
                    customColors={customColors}
                    data={masterState.get('department')}
                    activeIndex={form.whereUse}
                    keyToShow={Commons.SCHEMA_DROPDOWN.DEPARTMENT.label}
                    keyToCompare={Commons.SCHEMA_DROPDOWN.DEPARTMENT.value}
                    onPress={() => asDepartmentRef.current?.show()}
                  />
                </View>

                {/** Reason */}
                <CInput
                  containerStyle={cStyles.mt16}
                  style={[cStyles.itemsStart, styles.input_multiline]}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.REASON}
                  label={'add_approved_assets:reason'}
                  caption={'common:optional'}
                  holder={'add_approved_assets:holder_reason'}
                  value={form.reason}
                  multiline
                  disabled={
                    loading.main ||
                    loading.submitAdd ||
                    isDetail ||
                    requestDetail
                  }
                  onChangeInput={() => handleChangeInput(supplierRef)}
                  onChangeValue={handleChangeText}
                />
              </>
            }
          />

          {/** Assets */}
          <CGroupInfo
            label={'add_approved_assets:info_assets'}
            content={
              <AssetsTable
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
          />

          {/** Other info */}
          <CGroupInfo
            label={'add_approved_assets:info_other'}
            content={
              <>
                {/** Supplier */}
                <CInput
                  styleFocus={styles.input_focus}
                  inputRef={ref => (supplierRef = ref)}
                  name={INPUT_NAME.SUPPLIER}
                  label={'add_approved_assets:supplier'}
                  caption={'common:optional'}
                  holder={'add_approved_assets:holder_supplier'}
                  value={form.supplier}
                  returnKey={'done'}
                  disabled={
                    loading.main ||
                    loading.submitAdd ||
                    isDetail ||
                    requestDetail
                  }
                  onChangeInput={onSendRequest}
                  onChangeValue={handleChangeText}
                />

                {/** Type assets */}
                <View
                  style={
                    isDetail || requestDetail
                      ? [cStyles.justifyCenter, cStyles.mt16]
                      : cStyles.mt16
                  }>
                  <CLabel bold label={'add_approved_assets:type_assets'} />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail || requestDetail}
                    customColors={customColors}
                    primaryColor={customColors.yellow}
                    value={form.typeAssets}
                    values={dataTypeAssets}
                    onCallback={onCallbackTypeAsset}
                  />
                </View>

                {/** In Planning */}
                <View
                  style={
                    isDetail || requestDetail
                      ? [cStyles.justifyCenter, cStyles.mt16]
                      : cStyles.mt16
                  }>
                  <CLabel bold label={'add_approved_assets:in_planning'} />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail || requestDetail}
                    customColors={customColors}
                    primaryColor={customColors.yellow}
                    value={form.inPlanning}
                    values={dataInPlanning}
                    onCallback={onCallbackInplanning}
                  />
                </View>
              </>
            }
          />

          {!isDetail && !requestDetail && (
            <CActionSheet
              headerChoose
              actionRef={asDepartmentRef}
              onConfirm={handleChangeWhereUse}>
              <View style={cStyles.px16}>
                <CInput
                  containerStyle={cStyles.my10}
                  styleFocus={styles.input_focus}
                  holder={'add_approved_assets:holder_where_use'}
                  returnKey={'search'}
                  icon={Icons.search}
                  value={findWhereUse}
                  disabled={loading.main || loading.submitAdd}
                  onChangeValue={onSearchFilter}
                />
                <Picker
                  style={[styles.action, cStyles.justifyCenter]}
                  itemStyle={{
                    fontSize: moderateScale(21),
                    color: customColors.text,
                  }}
                  selectedValue={whereUse}
                  onValueChange={onChangeWhereUse}>
                  {dataWhereUse.length > 0 ? (
                    dataWhereUse.map((value, i) => (
                      <Picker.Item
                        label={value[Commons.SCHEMA_DROPDOWN.DEPARTMENT.label]}
                        value={i}
                        key={value}
                      />
                    ))
                  ) : (
                    <View style={[cStyles.center, styles.content_picker]}>
                      <CText
                        styles={'textCaption1'}
                        label={'add_approved_assets:holder_empty_department'}
                      />
                    </View>
                  )}
                </Picker>
              </View>
            </CActionSheet>
          )}

          {/** MODAL */}
          {isShowApprovedReject && (
            <RejectModal
              loading={loading.submitReject}
              showReject={showReject}
              description={'add_approved_assets:message_confirm_reject'}
              onReject={onReject}
              onCloseReject={onCloseReject}
            />
          )}

          {isShowApprovedReject && (
            <CAlert
              loading={loading.submitApproved}
              show={showConfirm}
              content={'add_approved_assets:message_confirm_approved'}
              onClose={handleApproved}
              onOK={onApproved}
            />
          )}
        </KeyboardAwareScrollView>
      }
      footer={
        <FooterFormRequest
          loading={loading.main || loading.submitAdd}
          customColors={customColors}
          isDetail={
            isDetail ||
            (typeof requestParam !== 'object' && requestParam !== -1)
          }
          isApprovedReject={isShowApprovedReject}
          onAdd={onSendRequest}
          onReject={handleReject}
          onApproved={handleApproved}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  left: {flex: 0.4},
  right: {flex: 0.6},
  action: {width: '100%', height: verticalScale(180)},
  content_picker: {height: '40%'},
  row_select: {
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
  },
  input_multiline: {height: verticalScale(100)},
});

export default AddRequest;
