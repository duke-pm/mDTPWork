/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Add new request
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
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
import CAlert from '~/components/CAlert';
import CActionSheet from '~/components/CActionSheet';
import CLabel from '~/components/CLabel';
import CGroupInfo from '~/components/CGroupInfo';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
import CActivityIndicator from '~/components/CActivityIndicator';
import CIconHeader from '~/components/CIconHeader';
import RejectModal from '../components/RejectModal';
import RequestProcess from '../components/RequestProcess';
import AssetsTable from '../components/AssetsTable';
import CheckOption from '../components/CheckOption';
/* COMMON */
import {THEME_DARK, DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID, verticalScale} from '~/utils/helper';
import Commons from '~/utils/common/Commons';
/* REDUX */
import * as Actions from '~/redux/actions';
const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;

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
  let find = null;
  if (data) {
    find = data.find(f => f[keyToCompare] === activeIndex);
  }
  return (
    <View style={[cStyles.round1, cStyles.ofHidden]}>
      <Touchable
        style={[cStyles.flex1, cStyles.round1]}
        disabled={disabled}
        onPress={onPress}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.rounded1,
            cStyles.px16,
            cStyles.mt6,
            cStyles.borderAll,
            styles.row_select,

            isDark && cStyles.borderAllDark,
            disabled && {backgroundColor: customColors.cardDisable},
          ]}>
          {!loading ? (
            find && <CText customLabel={find[keyToShow]} />
          ) : (
            <CActivityIndicator />
          )}
          {!disabled && (
            <Icon
              name={'chevron-down'}
              size={moderateScale(21)}
              color={disabled ? customColors.textDisable : customColors.icon}
            />
          )}
        </View>
      </Touchable>
    </View>
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

/** All init value use in this screen */
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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReject = () => setShowReject(true);

  const handleApproved = () => setShowConfirm(!showConfirm);

  const handleShowProcess = () => actionSheetProcessRef.current?.show();

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
    actionSheetDepartmentRef.current?.hide();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  /************
   ** FUNC **
   ************/
  const onCloseReject = () => setShowReject(false);

  const onSendRequest = () => {
    setLoading({...loading, submitAdd: true});
  };

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
        header: [
          t('add_approved_assets:description'),
          t('add_approved_assets:amount'),
          t('add_approved_assets:price'),
          t('add_approved_assets:total'),
        ],
        data: [['', '', '', '']],
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
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchApprovedRequest(params, navigation));
  };

  const onReject = reason => {
    setLoading({...loading, submitReject: true});
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
        RefreshToken: refreshToken,
        Lang: language,
      };
      dispatch(Actions.fetchAddRequestApproved(params, navigation));
    } else {
      setLoading({...loading, submitAdd: false});
    }
  };

  const onCallbackTypeAsset = newVal => {
    setForm({...form, typeAssets: newVal});
  };

  const onCallbackInplanning = newVal => {
    setForm({...form, inPlanning: newVal});
  };

  /******************
   ** LIFE CYCLE **
   ******************/
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
    navigation.setOptions({
      title: `${t('add_approved_assets:' + (isDetail ? 'detail' : 'title'))}`,
      headerLeft: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: false,
              icon: 'close',
              onPress: handleBack,
            },
          ]}
        />
      ),
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: isDetail,
              showRedDot: false,
              icon: 'information-circle',
              onPress: handleShowProcess,
            },
          ]}
        />
      ),
    });
  }, [navigation, isDetail]);

  /**************
   ** RENDER **
   **************/
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
        <CAvoidKeyboard>
          <CContent>
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
                    <View style={[cStyles.mr5, styles.con_left]}>
                      <CLabel
                        medium
                        label={'add_approved_assets:date_request'}
                      />
                      <CInput
                        name={INPUT_NAME.DATE_REQUEST}
                        disabled={true}
                        dateTimePicker={true}
                        value={moment(form.dateRequest).format(formatDateView)}
                        valueColor={customColors.text}
                      />
                    </View>

                    {/** Region */}
                    <View style={[cStyles.ml5, styles.con_right]}>
                      <CLabel medium label={'add_approved_assets:region'} />
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
                    <CLabel medium label={'add_approved_assets:name'} />
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
                    <CLabel medium label={'add_approved_assets:department'} />
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
                    <CLabel medium label={'add_approved_assets:where_use'} />
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
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                      ]}>
                      <CLabel medium label={'add_approved_assets:reason'} />
                      <CText styles={'textDate'} label={'common:optional'} />
                    </View>
                    <CInput
                      name={INPUT_NAME.REASON}
                      styleFocus={styles.input_focus}
                      disabled={loading.main || loading.submitAdd || isDetail}
                      holder={'add_approved_assets:holder_reason'}
                      value={form.reason}
                      keyboard={'default'}
                      returnKey={'next'}
                      onChangeInput={() => handleChangeInput(supplierRef)}
                      onChangeValue={handleChangeText}
                    />
                  </View>
                </>
              }
            />

            {/** Assets */}
            <CGroupInfo
              contentStyle={cStyles.p0}
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
                  <View style={cStyles.pt16}>
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                      ]}>
                      <CLabel medium label={'add_approved_assets:supplier'} />
                      <CText styles={'textDate'} label={'common:optional'} />
                    </View>
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
                    <CLabel medium label={'add_approved_assets:type_assets'} />
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
                  <View style={cStyles.py16}>
                    <CLabel medium label={'add_approved_assets:in_planning'} />
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

            {isDetail && (
              <CActionSheet
                indicatorColor={customColors.textDisable}
                actionRef={actionSheetProcessRef}>
                <RequestProcess
                  data={process}
                  customColors={customColors}
                  isDark={isDark}
                />
              </CActionSheet>
            )}

            {!isDetail && (
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
                    icon={'search'}
                    value={findWhereUse}
                    keyboard={'default'}
                    returnKey={'done'}
                    onChangeValue={onSearchFilter}
                  />
                  <Picker
                    style={[styles.con_action, cStyles.justifyCenter]}
                    itemStyle={{
                      fontSize: moderateScale(20),
                      color: customColors.textDisable,
                    }}
                    selectedValue={whereUse}
                    onValueChange={onChangeWhereUse}>
                    {dataWhereUse.length > 0 ? (
                      dataWhereUse.map((value, i) => (
                        <Picker.Item
                          label={
                            value[Commons.SCHEMA_DROPDOWN.DEPARTMENT.label]
                          }
                          value={i}
                          key={value}
                        />
                      ))
                    ) : (
                      <View style={[cStyles.center, styles.content_picker]}>
                        <CText
                          styles={'textMeta'}
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
          </CContent>
        </CAvoidKeyboard>
      }
      footer={
        !isDetail ? (
          <View style={[cStyles.px16, cStyles.pb5]}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
              icon={'send'}
              label={'add_approved_assets:send'}
              onPress={onSendRequest}
            />
          </View>
        ) : isShowApprovedReject ? (
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
              icon={'close'}
              label={'add_approved_assets:reject'}
              onPress={handleReject}
            />
            <CButton
              style={styles.button_reject}
              block
              color={customColors.green}
              disabled={loading.main}
              icon={'checkmark'}
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
  input_focus: {borderColor: colors.SECONDARY},
  button_approved: {width: moderateScale(150)},
  button_reject: {width: moderateScale(150)},
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
  con_action: {width: '100%', height: verticalScale(180)},
  content_picker: {height: '40%'},
  row_select: {height: verticalScale(38)},
});

export default AddRequest;
