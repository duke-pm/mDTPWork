/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Add new request
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import React, {createRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
import RejectModal from '../components/RejectModal';
import RequestProcess from '../components/RequestProcess';
import CActionSheet from '~/components/CActionSheet';
import CRowLabel from '~/components/CRowLabel';
import AssetsTable from '../components/AssetsTable';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, alert, scalePx, sH, IS_ANDROID} from '~/utils/helper';
import Commons from '~/utils/common/Commons';
/* REDUX */
import * as Actions from '~/redux/actions';

const RowSelect = (
  loading,
  disabled,
  isDark,
  customColors,
  data,
  activeIndex,
  keyToShow,
  keyToCompare,
  onPress,
) => {
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  let find = null;
  find = data.find(f => f[keyToCompare] === activeIndex);
  return (
    <Touchable disabled={disabled} onPress={onPress}>
      <View
        style={[
          cStyles.rounded1,
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.px16,
          cStyles.mt6,
          cStyles.borderAll,
          isDark && cStyles.borderAllDark,
          disabled && {
            backgroundColor: customColors.cardDisable,
          },
          {height: 50},
        ]}>
        {!loading ? (
          find && <CText customLabel={find[keyToShow]} />
        ) : (
          <ActivityIndicator />
        )}
        {!disabled && (
          <Icon
            name={'chevron-down'}
            size={scalePx(3)}
            color={disabled ? customColors.textDisable : customColors.icon}
          />
        )}
      </View>
    </Touchable>
  );
};

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

/** All refs use in this screen */
const actionSheetProcessRef = createRef();
const actionSheetDepartmentRef = createRef();
let supplierRef = createRef();
let newRef = createRef();
let addRef = createRef();
let yesRef = createRef();
let noRef = createRef();

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [isDetail] = useState(props.route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
  const [whereUse, setWhereUse] = useState(0);
  const [findWhereUse, setFindWhereUse] = useState('');
  const [dataWhereUse, setDataWhereUse] = useState([]);
  const [form, setForm] = useState({
    id: '',
    personRequestId: '',
    dateRequest: moment().format(commonState.get('formatDate')),
    name: authState.getIn(['login', 'fullName']),
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
    assets: {
      header: [
        t('add_approved_assets:description'),
        t('add_approved_assets:amount'),
        t('add_approved_assets:price'),
        t('add_approved_assets:total'),
        '',
      ],
      data: [['', '', '', '', null]],
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

  /** HANDLE FUNC */
  const handleReject = () => setShowReject(true);

  const handleChangeInput = (inputRef, type) => {
    if (inputRef) {
      if (!type) {
        inputRef.focus();
      } else if (type === 'combobox') {
        inputRef.current.toggle();
      }
    }
  };

  const handleChooseTypeAssets = (type, ref) => {
    if (type !== form.typeAssets) {
      ref.pulse(300);
      setForm({
        ...form,
        typeAssets: type,
      });
    }
  };

  const handleChooseInPlanning = (inplanning, ref) => {
    if (inplanning !== form.inPlanning) {
      ref.pulse(300);
      setForm({
        ...form,
        inPlanning: inplanning,
      });
    }
  };

  const handleChangeText = (value, nameInput) => {
    if (nameInput === INPUT_NAME.REASON) {
      setForm({...form, reason: value});
    } else {
      setForm({...form, supplier: value});
    }
  };

  const handleApproved = () => {
    alert(t, 'add_approved_assets:message_confirm_approved', onApproved);
  };

  const handleShowProcess = () => actionSheetProcessRef.current?.show();

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
    actionSheetDepartmentRef.current?.hide();
  };

  /** FUNC */
  const onCloseReject = () => setShowReject(false);

  const onSendRequest = () => {
    setLoading({...loading, submitAdd: true});
  };

  const onPrepareData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchMasterData(params, props.navigation));
    dispatch(Actions.resetAllApproved());
  };

  const onPrepareDetail = () => {
    let tmp = {
      id: isDetail ? props.route.params?.data?.requestID : '',
      personRequestId: isDetail
        ? props.route.params?.data?.personRequestID
        : '',
      dateRequest: isDetail
        ? moment(
            props.route.params?.data?.requestDate,
            'YYYY-MM-DDTHH:mm:ss',
          ).format(commonState.get('formatDate'))
        : moment().format(commonState.get('formatDate')),
      name: isDetail ? props.route.params?.data?.personRequest : '',
      department: isDetail ? props.route.params?.data?.deptCode : '',
      region: isDetail ? props.route.params?.data?.regionCode : '',
      assets: {
        header: [
          t('add_approved_assets:description'),
          t('add_approved_assets:amount'),
          t('add_approved_assets:price'),
          t('add_approved_assets:total'),
        ],
        data: [['', '', '', '']],
      },
      whereUse: isDetail ? props.route.params?.data?.locationCode : '',
      reason: isDetail ? props.route.params?.data?.reason : '',
      typeAssets: isDetail ? props.route.params?.data?.docType : 'N',
      inPlanning: isDetail ? props.route.params?.data?.isBudget : false,
      supplier: isDetail ? props.route.params?.data?.supplierName : '',
      status: isDetail ? props.route.params?.data?.statusID : 1,
      isAllowApproved: isDetail
        ? props.route.params?.data?.isAllowApproved
        : false,
    };
    if (props.route.params?.dataDetail) {
      let arrayDetail = props.route.params?.dataDetail;
      if (arrayDetail.length > 0) {
        tmp.assets.data = [];
        let item = null,
          choosesRef = [];
        for (item of arrayDetail) {
          tmp.assets.data.push([
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
    if (props.route.params?.dataProcess) {
      let arrayProcess = props.route.params?.dataProcess;
      if (arrayProcess.length > 0) {
        setProcess(arrayProcess);
      }
    }
    let data = masterState.get('department');
    let find = data.findIndex(
      f => f.deptCode === props.route.params?.data?.locationCode,
    );
    if (find !== -1) {
      setWhereUse(find);
    }
    setForm(tmp);
    setLoading({...loading, main: false});
  };

  const onApproved = () => {
    setLoading({...loading, submitApproved: true});
    let params = {
      RequestID: form.id,
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value,
      PersonRequestID: form.personRequestId,
      Status: true,
      Reason: '',
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchApprovedRequest(params, props.navigation));
  };

  const onReject = reason => {
    setLoading({...loading, submitReject: true});
    let params = {
      RequestID: form.id,
      RequestTypeID: Commons.APPROVED_TYPE.ASSETS.value,
      PersonRequestID: form.personRequestId,
      Status: false,
      Reason: reason,
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchRejectRequest(params, props.navigation));
  };

  const onChangeWhereUse = index => {
    setWhereUse(index);
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
        RefreshToken: authState.getIn(['login', 'refreshToken']),
        Lang: commonState.get('language'),
      };
      dispatch(Actions.fetchAddRequestApproved(params, props.navigation));
    } else {
      setLoading({...loading, submitAdd: false});
    }
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

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
          setLoading({...loading, main: false});
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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

  /** RENDER */
  return (
    <CContainer
      loading={
        loading.main ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      hasPaddingFooter
      header
      hasBack
      iconBack={'x'}
      title={'add_approved_assets:' + (isDetail ? 'detail' : 'title')}
      headerRight={
        isDetail ? (
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowProcess}>
            <Icon
              style={cStyles.p16}
              name={'info'}
              color={'white'}
              size={scalePx(3)}
            />
          </TouchableOpacity>
        ) : null
      }
      content={
        <CContent>
          <KeyboardAvoidingView
            style={cStyles.flex1}
            behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={120}>
            <ScrollView
              style={cStyles.flex1}
              contentContainerStyle={cStyles.justifyEnd}
              keyboardShouldPersistTaps={'handled'}>
              <CRowLabel label={t('add_approved_assets:info_user_request')} />
              <View
                style={[
                  cStyles.p16,
                  cStyles.borderTop,
                  cStyles.borderBottom,
                  isDark && cStyles.borderTopDark,
                  isDark && cStyles.borderBottomDark,
                  {backgroundColor: customColors.group},
                ]}>
                {/** Date request and Region */}
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyBetween,
                  ]}>
                  {/** Date request */}
                  <View style={[cStyles.flex1, cStyles.mr5]}>
                    <CText
                      styles={'textMeta fontMedium'}
                      label={'add_approved_assets:date_request'}
                    />
                    <CInput
                      name={INPUT_NAME.DATE_REQUEST}
                      disabled={true}
                      dateTimePicker={true}
                      value={moment(form.dateRequest).format(
                        commonState.get('formatDateView'),
                      )}
                      valueColor={customColors.text}
                    />
                  </View>

                  {/** Region */}
                  <View style={[cStyles.flex1, cStyles.ml5]}>
                    <CText
                      styles={'textMeta fontMedium'}
                      label={'add_approved_assets:region'}
                    />
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
                <View style={cStyles.pt16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:name'}
                  />
                  <CInput
                    name={INPUT_NAME.NAME}
                    styleFocus={styles.input_focus}
                    disabled={true}
                    holder={'add_approved_assets:name'}
                    value={form.name}
                    valueColor={customColors.text}
                    keyboard={'default'}
                    returnKey={'next'}
                  />
                </View>

                {/** Department */}
                <View style={cStyles.pt16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:department'}
                  />
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
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:where_use'}
                  />
                  {RowSelect(
                    loading.main,
                    loading.main || loading.submitAdd || isDetail,
                    isDark,
                    customColors,
                    masterState.get('department'),
                    form.whereUse,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.label,
                    Commons.SCHEMA_DROPDOWN.DEPARTMENT.value,
                    () => actionSheetDepartmentRef.current?.show(),
                  )}
                </View>

                {/** Reason */}
                <View style={cStyles.pt16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:reason'}
                  />
                  <CInput
                    name={INPUT_NAME.REASON}
                    styleFocus={styles.input_focus}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    holder={'add_approved_assets:holder_reason'}
                    value={form.reason}
                    keyboard={'default'}
                    returnKey={'next'}
                    multiline
                    onChangeInput={() => handleChangeInput(supplierRef)}
                    onChangeValue={handleChangeText}
                  />
                </View>
              </View>

              {/** Assets */}
              <CRowLabel label={t('add_approved_assets:info_assets')} />
              <View
                style={[
                  cStyles.borderTop,
                  cStyles.borderBottom,
                  isDark && cStyles.borderTopDark,
                  isDark && cStyles.borderBottomDark,
                  {backgroundColor: customColors.group},
                ]}>
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
              </View>

              {/** Other info */}
              <CRowLabel label={t('add_approved_assets:info_other')} />
              <View
                style={[
                  cStyles.p16,
                  cStyles.borderTop,
                  cStyles.borderBottom,
                  isDark && cStyles.borderTopDark,
                  isDark && cStyles.borderBottomDark,
                  {backgroundColor: customColors.group},
                ]}>
                {/** Supplier */}
                <View style={cStyles.pt16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:supplier'}
                  />
                  <CInput
                    name={INPUT_NAME.SUPPLIER}
                    styleFocus={styles.input_focus}
                    inputRef={ref => (supplierRef = ref)}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    holder={'add_approved_assets:holder_supplier'}
                    value={form.supplier}
                    keyboard={'default'}
                    returnKey={'done'}
                    onChangeInput={onSendRequest}
                    onChangeValue={handleChangeText}
                  />
                </View>

                {/** Type assets */}
                <View style={cStyles.pt16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:type_assets'}
                  />
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyAround,
                      cStyles.pt10,
                    ]}>
                    <TouchableOpacity
                      disabled={loading.main || loading.submitAdd || isDetail}
                      onPress={() => handleChooseTypeAssets('N', newRef)}>
                      <Animatable.View
                        ref={ref => (newRef = ref)}
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          styles.con_left,
                        ]}
                        useNativeDriver={true}>
                        <Icon
                          name={
                            form.typeAssets === 'N' ? 'check-circle' : 'circle'
                          }
                          size={scalePx(3)}
                          color={
                            form.typeAssets === 'N'
                              ? colors.SECONDARY
                              : customColors.text
                          }
                        />
                        <CText
                          styles={'pl10'}
                          label={'add_approved_assets:buy_new'}
                        />
                      </Animatable.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={loading.main || loading.submitAdd || isDetail}
                      onPress={() => handleChooseTypeAssets('A', addRef)}>
                      <Animatable.View
                        ref={ref => (addRef = ref)}
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          styles.con_right,
                        ]}
                        useNativeDriver={true}>
                        <Icon
                          name={
                            form.typeAssets === 'A' ? 'check-circle' : 'circle'
                          }
                          size={scalePx(3)}
                          color={
                            form.typeAssets === 'A'
                              ? colors.SECONDARY
                              : customColors.text
                          }
                        />
                        <CText
                          styles={'pl10'}
                          label={'add_approved_assets:additional'}
                        />
                      </Animatable.View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/** In Planning */}
                <View style={cStyles.py16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_assets:in_planning'}
                  />
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyAround,
                      cStyles.pt10,
                    ]}>
                    <TouchableOpacity
                      disabled={loading.main || loading.submitAdd || isDetail}
                      onPress={() => handleChooseInPlanning(true, yesRef)}>
                      <Animatable.View
                        ref={ref => (yesRef = ref)}
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          styles.con_left,
                        ]}>
                        <Icon
                          name={form.inPlanning ? 'check-circle' : 'circle'}
                          size={scalePx(3)}
                          color={
                            form.inPlanning
                              ? colors.SECONDARY
                              : customColors.text
                          }
                        />
                        <CText
                          styles={'pl10'}
                          label={'add_approved_assets:yes'}
                        />
                      </Animatable.View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={loading.main || loading.submitAdd || isDetail}
                      onPress={() => handleChooseInPlanning(false, noRef)}>
                      <Animatable.View
                        ref={ref => (noRef = ref)}
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          styles.con_right,
                        ]}>
                        <Icon
                          name={!form.inPlanning ? 'check-circle' : 'circle'}
                          size={scalePx(3)}
                          color={
                            !form.inPlanning
                              ? colors.SECONDARY
                              : customColors.text
                          }
                        />
                        <CText
                          styles={'pl10'}
                          label={'add_approved_assets:no'}
                        />
                      </Animatable.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={cStyles.flex1} />
            </ScrollView>
          </KeyboardAvoidingView>

          {isDetail && (
            <CActionSheet actionRef={actionSheetProcessRef}>
              <RequestProcess
                data={process}
                customColors={customColors}
                isDark={isDark}
              />
            </CActionSheet>
          )}

          <CActionSheet
            actionRef={actionSheetDepartmentRef}
            headerChoose
            onConfirm={handleChangeWhereUse}>
            <View style={cStyles.px16}>
              <CInput
                containerStyle={cStyles.mb10}
                styleFocus={styles.input_focus}
                disabled={loading.main || loading.submitAdd || isDetail}
                holder={'add_approved_assets:holder_where_use'}
                value={findWhereUse}
                keyboard={'default'}
                returnKey={'done'}
                onChangeValue={onSearchFilter}
              />
              <Picker
                style={styles.con_action}
                itemStyle={{color: customColors.text, fontSize: scalePx(3)}}
                selectedValue={whereUse}
                onValueChange={onChangeWhereUse}>
                {dataWhereUse.map((value, i) => (
                  <Picker.Item
                    label={value[Commons.SCHEMA_DROPDOWN.DEPARTMENT.label]}
                    value={i}
                    key={i}
                  />
                ))}
              </Picker>
            </View>
          </CActionSheet>

          {/** MODAL */}
          <RejectModal
            loading={loading.submitReject}
            showReject={showReject}
            description={'add_approved_assets:message_confirm_reject'}
            onReject={onReject}
            onCloseReject={onCloseReject}
          />
        </CContent>
      }
      footer={
        !isDetail ? (
          <View style={cStyles.px16}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
              label={'add_approved_assets:send'}
              onPress={onSendRequest}
            />
          </View>
        ) : form.isAllowApproved && props.route.params?.permissionWrite ? (
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEvenly,
              cStyles.px16,
            ]}>
            <CButton
              style={styles.button_approved}
              block
              color={customColors.red}
              disabled={loading.main}
              icon={'x-circle'}
              label={'add_approved_assets:reject'}
              onPress={handleReject}
            />
            <CButton
              style={styles.button_reject}
              block
              color={customColors.green}
              disabled={loading.main}
              icon={'check-circle'}
              label={'add_approved_assets:approved'}
              onPress={handleApproved}
            />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {
    borderColor: colors.SECONDARY,
  },
  button_approved: {width: cStyles.deviceWidth / 2.5},
  button_reject: {width: cStyles.deviceWidth / 2.5},
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
  con_action: {width: '100%', height: sH('30%')},
});

export default AddRequest;
