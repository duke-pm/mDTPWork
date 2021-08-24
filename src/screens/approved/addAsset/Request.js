/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request assets
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
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
import Icons from '~/utils/common/Icons';
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import FieldsAuth from '~/config/fieldsAuth';
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

const RowSelect = (
  loading = false,
  disabled = false,
  isDark = false,
  customColors = {},
  data = [],
  activeIndex = -1,
  keyToShow = '',
  keyToCompare = '',
  onPress = () => null,
) => {
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
          <CText customLabel={findRow ? checkEmpty(findRow[keyToShow]) : '-'} />
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
};

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

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    startFetchLogin: false,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetail] = useState(route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
  const [whereUse, setWhereUse] = useState(0);
  const [findWhereUse, setFindWhereUse] = useState('');
  const [dataWhereUse, setDataWhereUse] = useState([]);
  const [form, setForm] = useState({
    id: '',
    personRequestId: '',
    dateRequest: moment().format(formatDate),
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

  const onPrepareDetail = () => {
    let tmp = {
      id: isDetail ? route.params?.data?.requestID : '',
      personRequestId: isDetail ? route.params?.data?.personRequestID : '',
      dateRequest: isDetail
        ? moment(route.params?.data?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : moment().format(formatDate),
      name: isDetail ? route.params?.data?.personRequest : '',
      department: isDetail ? route.params?.data?.deptCode : '',
      region: isDetail ? route.params?.data?.regionCode : '',
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
      whereUse: isDetail ? route.params?.data?.locationCode : '',
      reason: isDetail ? route.params?.data?.reason : '',
      typeAssets: isDetail ? route.params?.data?.docType : 'N',
      inPlanning: isDetail ? route.params?.data?.isBudget : false,
      supplier: isDetail ? route.params?.data?.supplierName : '',
      status: isDetail ? route.params?.data?.statusID : 1,
      isAllowApproved: isDetail ? route.params?.data?.isAllowApproved : false,
    };
    if (route.params?.dataDetail) {
      let arrayDetail = route.params?.dataDetail;
      if (arrayDetail.length > 0) {
        tmp.assets.data = [];
        let item = null,
          choosesRef = [];
        for (item of arrayDetail) {
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
    if (route.params?.dataProcess) {
      let arrayProcess = route.params?.dataProcess;
      if (arrayProcess.length > 0) {
        setProcess(arrayProcess);
      }
    }
    let data = masterState.get('department');
    let find = data.findIndex(
      f => f.deptCode === route.params?.data?.locationCode,
    );
    if (find !== -1) {
      setWhereUse(find);
    }
    setForm(tmp);
    setLoading({...loading, main: false, startFetchLogin: false});
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      onPrepareData();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return onPrepareData();
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
    if (loading.main) {
      if (masterState.get('department').length > 0) {
        setDataWhereUse(masterState.get('department'));
        if (isDetail) {
          onPrepareDetail();
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
  }, [loading.main, masterState.get('department')]);

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
    if (!isDetail) {
      title = t('add_approved_assets:title');
    } else {
      title =
        t('add_approved_assets:detail') + ' #' + route.params?.data?.requestID;
    }
    navigation.setOptions({title});
  }, [navigation, isDetail]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  return (
    <CContainer
      loading={
        loading.main ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      content={
        <KeyboardAwareScrollView>
          {/** Process of request */}
          {isDetail && (
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
                    {RowSelect(
                      loading.main,
                      true,
                      isDark,
                      customColors,
                      masterState.get('region'),
                      form.region,
                      Commons.SCHEMA_DROPDOWN.REGION.label,
                      Commons.SCHEMA_DROPDOWN.REGION.value,
                      null,
                    )}
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
                  {RowSelect(
                    loading.main,
                    true,
                    isDark,
                    customColors,
                    masterState.get('department'),
                    form.department,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.label,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.value,
                    null,
                  )}
                </View>

                {/** Where use */}
                <View style={cStyles.pt16}>
                  <CLabel bold label={'add_approved_assets:where_use'} />
                  {RowSelect(
                    loading.main,
                    loading.main || loading.submitAdd || isDetail,
                    isDark,
                    customColors,
                    masterState.get('department'),
                    form.whereUse,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.label,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.value,
                    () => asDepartmentRef.current?.show(),
                  )}
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
                  disabled={loading.main || loading.submitAdd || isDetail}
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
                isDetail={isDetail}
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
                  disabled={loading.main || loading.submitAdd || isDetail}
                  onChangeInput={onSendRequest}
                  onChangeValue={handleChangeText}
                />

                {/** Type assets */}
                <View
                  style={
                    isDetail
                      ? [cStyles.justifyCenter, cStyles.mt16]
                      : cStyles.mt16
                  }>
                  <CLabel bold label={'add_approved_assets:type_assets'} />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail}
                    customColors={customColors}
                    value={form.typeAssets}
                    values={dataTypeAssets}
                    onCallback={onCallbackTypeAsset}
                  />
                </View>

                {/** In Planning */}
                <View
                  style={
                    isDetail
                      ? [cStyles.justifyCenter, cStyles.mt16]
                      : cStyles.mt16
                  }>
                  <CLabel bold label={'add_approved_assets:in_planning'} />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail}
                    customColors={customColors}
                    value={form.inPlanning}
                    values={dataInPlanning}
                    onCallback={onCallbackInplanning}
                  />
                </View>
              </>
            }
          />

          {!isDetail && (
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
                  disabled={loading.main || loading.submitAdd || isDetail}
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
          isDetail={isDetail}
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
