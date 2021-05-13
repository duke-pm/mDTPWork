/**
 ** Name: Add new request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  Table,
  Row,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CDropdown from '~/components/CDropdown';
import CButton from '~/components/CButton';
import AssetItem from '../components/AssetItem';
import RejectModal from '../components/RejectModal';
import CCard from '~/components/CCard';
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import { IS_IOS, alert, scalePx } from '~/utils/helper';
import Commons from '~/utils/common/Commons';
/* REDUX */
import * as Actions from '~/redux/actions';

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

function AddRequest(props) {
  const { t } = useTranslation();

  let dateRequestRef = useRef();
  let nameRef = useRef();
  let departmentRef = useRef();
  let regionRef = useRef();
  let whereUseRef = useRef();
  let reasonRef = useRef();
  let supplierRef = useRef();

  const dispatch = useDispatch();
  const masterState = useSelector(({ masterData }) => masterData);
  const commonState = useSelector(({ common }) => common);
  const approvedState = useSelector(({ approved }) => approved);
  const authState = useSelector(({ auth }) => auth);

  const [loading, setLoading] = useState({
    main: true,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isDetail, setIsDetail] = useState(props.route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
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
      data: [
        ['', '', '', '', null],
      ],
    },
    whereUse: authState.getIn(['login', 'deptCode']),
    reason: '',
    typeAssets: 'N',
    inPlanning: false,
    supplier: '',
    status: 1,
    isAllowApproved: false,
  });
  const [error, setError] = useState({
    department: {
      status: false,
      helper: '',
    },
    region: {
      status: false,
      helper: '',
    },
    assets: {
      status: false,
      helper: '',
    },
    whereUse: {
      status: false,
      helper: '',
    },
  });

  /** HANDLE FUNC */
  const handleDateInput = () => {
    setShowPickerDate(true);
  };

  const handleChangeInput = (inputRef, type) => {
    if (inputRef) {
      if (!type) {
        inputRef.focus();
      } else if (type === 'combobox') {
        inputRef.current.toggle();
      }
    }
  };

  const handleAddAssets = () => {
    let newData = [...form.assets.data];
    newData.push(['', '', '', '', null]);
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      }
    });
  };

  const handleChooseTypeAssets = (type) => {
    if (type !== form.typeAssets) {
      setForm({
        ...form,
        typeAssets: type
      });
    }
  };

  const handleChooseInPlanning = (inplanning) => {
    if (inplanning !== form.inPlanning) {
      setForm({
        ...form,
        inPlanning: inplanning
      });
    }
  };

  const handleCombobox = (data, field, nextField) => {
    if (field === INPUT_NAME.DEPARTMENT) {
      setForm({
        ...form,
        department: data[Commons.SCHEMA_DROPDOWN.DEPARTMENT.value],
        whereUse: data[Commons.SCHEMA_DROPDOWN.DEPARTMENT.value],
      });
      if (error.department.status) {
        setError({ ...error, department: { status: false, helper: '' } });
      }
      departmentRef.current.close();
      regionRef.current.open();
    } else if (field === INPUT_NAME.REGION) {
      setForm({
        ...form,
        region: data[Commons.SCHEMA_DROPDOWN.REGION.value],
      });
      if (error.region.status) {
        setError({ ...error, region: { status: false, helper: '' } });
      }
      regionRef.current.close();
      whereUseRef.current.open();
    } else if (field === INPUT_NAME.WHERE_USE) {
      setForm({
        ...form,
        whereUse: data[Commons.SCHEMA_DROPDOWN.DEPARTMENT.value],
      });
      if (error.whereUse.status) {
        setError({ ...error, whereUse: { status: false, helper: '' } });
      }
      whereUseRef.current.close();
      if (nextField) nextField.focus();
    }
  };

  const handleChangeText = (value, nameInput) => {
    if (nameInput === INPUT_NAME.REASON) {
      setForm({ ...form, reason: value });
    } else {
      setForm({ ...form, supplier: value });
    }
  };

  const handleApproved = () => {
    alert(t, 'add_approved_assets:message_confirm_approved', onApproved);
  };

  const handleReject = () => {
    setShowReject(true);
  };

  /** FUNC */
  const onValidate = () => {
    let tmpError = error, status = true;
    if (form.department === '') {
      tmpError.department.status = true;
      tmpError.department.helper = 'error:not_choose_department';
      status = false;
    }
    if (form.region === '') {
      tmpError.region.status = true;
      tmpError.region.helper = 'error:not_choose_region';
      status = false;
    }
    if (form.whereUse === '') {
      tmpError.whereUse.status = true;
      tmpError.whereUse.helper = 'error:not_choose_where_use';
      status = false;
    }

    for (let item of form.assets.data) {
      if (item[0].trim().length === 0) {
        tmpError.assets.status = true;
        tmpError.assets.helper = 'error:not_enough_assets';
        status = false;
      } else {
        if ((item[1] === '') || (item[1] !== '' && Number(item[1]) < 1)) {
          tmpError.assets.status = true;
          tmpError.assets.helper = 'error:assets_need_larger_than_zero';
          status = false;
        }
      }
    }
    return {
      status,
      data: tmpError,
    };
  };

  const onSendRequest = () => {
    setLoading({ ...loading, submitAdd: true });
    let isValid = onValidate();
    if (isValid.status) {
      /** prepare assets */
      let assets = [], item = null;
      for (item of form.assets.data) {
        assets.push({
          'Descr': item[0],
          'Qty': Number(item[1]),
          'UnitPrice': item[2] === '' ? 0 : Number(item[2]),
          'TotalAmt': item[3] === '' ? 0 : Number(item[3]),
        });
      }

      let params = {
        'EmpCode': authState.getIn(['login', 'empCode']),
        'DeptCode': authState.getIn(['login', 'deptCode']),
        'RegionCode': authState.getIn(['login', 'regionCode']),
        'JobTitle': authState.getIn(['login', 'jobTitle']),
        'RequestDate': form.dateRequest,
        'Location': form.whereUse,
        'Reason': form.reason,
        'DocType': form.typeAssets,
        'IsBudget': form.inPlanning,
        'SupplierName': form.supplier,
        'ListAssets': assets,
        'RefreshToken': authState.getIn(['login', 'refreshToken']),
        'Lang': commonState.get('language'),
      };
      dispatch(Actions.fetchAddRequestApproved(params, props.navigation));
    } else {
      setError(isValid.data);
      setLoading({ ...loading, submitAdd: false });
    };
  };

  const onOpenCombobox = (inputName) => {
    switch (inputName) {
      case INPUT_NAME.DEPARTMENT:
        regionRef.current.close();
        whereUseRef.current.close();
        Keyboard.dismiss();
        break;
      case INPUT_NAME.REGION:
        departmentRef.current.close();
        whereUseRef.current.close();
        Keyboard.dismiss();
        break;
      case INPUT_NAME.WHERE_USE:
        departmentRef.current.close();
        regionRef.current.close();
        Keyboard.dismiss();
        break;
    }
  };

  const onPrepareData = () => {
    let params = {
      'listType': 'Department, Region',
      'RefreshToken': authState.getIn(['login', 'refreshToken']),
      'Lang': commonState.get('language'),
    }
    dispatch(Actions.fetchMasterData(params, props.navigation));
  };

  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate(showPicker);
    if (newDate) {
      setForm({
        ...form,
        dateRequest: moment(newDate).format(commonState.get('formatDate')),
      });
    }
  };

  const onChangeCellItem = (value, rowIndex, cellIndex) => {
    let newData = form.assets.data;
    newData[rowIndex][cellIndex] = value;
    if (newData[rowIndex][1] !== '') {
      if (newData[rowIndex][2] !== '') {
        newData[rowIndex][3] = JSON.stringify(
          Number(newData[rowIndex][1]) * Number(newData[rowIndex][2])
        );
      } else newData[rowIndex][3] = '';
    } else newData[rowIndex][3] = '';
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
    if (error.assets.status) {
      setError({ ...error, assets: { status: false, helper: '' } });
    }
  };

  const onRemoveRow = (rowIndex) => {
    let newData = [...form.assets.data];
    newData.splice(rowIndex, 1);
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      }
    });
  };

  const onPrepareDetail = () => {
    let tmp = {
      id: isDetail
        ? props.route.params?.data?.requestID
        : '',
      personRequestId: isDetail
        ? props.route.params?.data?.personRequestID
        : '',
      dateRequest: isDetail
        ? moment(props.route.params?.data?.requestDate, 'YYYY-MM-DDTHH:mm:ss').format(commonState.get('formatDate'))
        : moment().format(commonState.get('formatDate')),
      name: isDetail
        ? props.route.params?.data?.personRequest
        : '',
      department: isDetail
        ? props.route.params?.data?.deptCode
        : '',
      region: isDetail
        ? props.route.params?.data?.regionCode
        : '',
      assets: {
        header: [
          t('add_approved_assets:description'),
          t('add_approved_assets:amount'),
          t('add_approved_assets:price'),
          t('add_approved_assets:total'),
        ],
        data: [
          ['', '', '', ''],
        ],
      },
      whereUse: isDetail
        ? props.route.params?.data?.locationCode
        : '',
      reason: isDetail
        ? props.route.params?.data?.reason
        : '',
      typeAssets: isDetail ? props.route.params?.data?.docType : 'N',
      inPlanning: isDetail ? props.route.params?.data?.isBudget : false,
      supplier: isDetail ? props.route.params?.data?.supplierName : '',
      status: isDetail ? props.route.params?.data?.statusID : 1,
      isAllowApproved: isDetail ? props.route.params?.data?.isAllowApproved : false,
    };
    if (props.route.params?.dataDetail) {
      let arrayDetail = props.route.params?.dataDetail;
      if (arrayDetail.length > 0) {
        tmp.assets.data = [];
        for (let item of arrayDetail) {
          tmp.assets.data.push([item.descr, item.qty, item.unitPrice, item.totalAmt]);
        }
      }
    }
    if (props.route.params?.dataProcess) {
      let arrayProcess = props.route.params?.dataProcess;
      if (arrayProcess.length > 0) {
        setProcess(arrayProcess);
      }
    }
    setForm(tmp);
    setLoading({ ...loading, main: false });
  };

  const onApproved = () => {
    setLoading({ ...loading, submitApproved: true });
    let params = {
      'RequestID': form.id,
      'RequestTypeID': 1,
      'PersonRequestID': form.personRequestId,
      'Status': true,
      'Reason': '',
      'RefreshToken': authState.getIn(['login', 'refreshToken']),
      'Lang': commonState.get('language'),
    }
    dispatch(Actions.fetchApprovedRequest(params, props.navigation));
  };

  const onReject = (reason) => {
    setLoading({ ...loading, submitReject: true });
    let params = {
      'RequestID': form.id,
      'RequestTypeID': 1,
      'PersonRequestID': form.personRequestId,
      'Status': false,
      'Reason': reason,
      'RefreshToken': authState.getIn(['login', 'refreshToken']),
      'Lang': commonState.get('language'),
    }
    dispatch(Actions.fetchRejectRequest(params, props.navigation));
  };

  const onCloseReject = () => {
    setShowReject(false);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (masterState.get('department').length > 0) {
        if (isDetail) {
          onPrepareDetail();
        } else {
          setLoading({ ...loading, main: false });
        }
      }
    }
  }, [
    loading.main,
    masterState.get('department'),
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState.get('submittingAdd')) {
        if (approvedState.get('successAddRequest')) {
          setLoading({ ...loading, submitAdd: false });
          showMessage({
            message: t('common:app_name'),
            description: t('success:send_request'),
            type: 'success',
            icon: 'success'
          });
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
          }
        }

        if (approvedState.get('errorAddRequest')) {
          setLoading({ ...loading, submitAdd: false });
          showMessage({
            message: t('common:app_name'),
            description: approvedState.get('errorHelperAddRequest'),
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
          setLoading({ ...loading, submitApproved: false });
          showMessage({
            message: t('common:app_name'),
            description: t('success:approved_request'),
            type: 'success',
            icon: 'success'
          });
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
          }
        }

        if (approvedState.get('errorApprovedRequest')) {
          setLoading({ ...loading, submitApproved: false });
          showMessage({
            message: t('common:app_name'),
            description: approvedState.get('errorHelperApprovedRequest'),
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
          setLoading({ ...loading, submitReject: false });
          showMessage({
            message: t('common:app_name'),
            description: t('success:reject_request'),
            type: 'success',
            icon: 'success'
          });
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
          }
        }

        if (approvedState.get('errorRejectRequest')) {
          setLoading({ ...loading, submitReject: false });
          showMessage({
            message: t('common:app_name'),
            description: approvedState.get('errorHelperRejectRequest'),
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
        loading.main
        || loading.submitAdd
        || loading.submitApproved
        || loading.submitReject
      }
      header
      hasBack
      iconBack={'close'}
      title={'add_approved_assets:' + (isDetail ? 'detail' : 'title')}
      content={
        <CContent>
          <KeyboardAvoidingView style={cStyles.flex1} behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={120}>
            <ScrollView
              style={cStyles.flex1}
              contentContainerStyle={[cStyles.p16, cStyles.justifyEnd]}
              keyboardShouldPersistTaps={'handled'}
            >
              {/** Date request */}
              <View>
                <CText styles={'textTitle'} label={'add_approved_assets:date_request'} />
                <CInput
                  name={INPUT_NAME.DATE_REQUEST}
                  inputRef={ref => dateRequestRef = ref}
                  disabled={true}
                  dateTimePicker={true}
                  value={moment(form.dateRequest).format(
                    commonState.get('formatDateView')
                  )}
                  valueColor={colors.BLACK}
                  iconLast={'calendar'}
                  iconLastColor={colors.GRAY_700}
                  onPressIconLast={handleDateInput}
                />
              </View>

              {/** Name */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved_assets:name'} />
                <CInput
                  name={INPUT_NAME.NAME}
                  styleFocus={styles.input_focus}
                  inputRef={ref => nameRef = ref}
                  disabled={true}
                  holder={'add_approved_assets:name'}
                  value={form.name}
                  valueColor={colors.BLACK}
                  keyboard={'default'}
                  returnKey={'next'}
                  onChangeInput={() => handleChangeInput(departmentRef, 'combobox')}
                />
              </View>

              {/** Department */}
              <View style={[
                cStyles.pt16,
                IS_IOS && { zIndex: 10 }
              ]}>
                <CText styles={'textTitle'} label={'add_approved_assets:department'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => departmentRef.current = instance}
                  data={masterState.get('department')}
                  disabled={true}
                  searchable={true}
                  searchablePlaceholder={t('add_approved_assets:search_department')}
                  error={error.department.status}
                  errorHelper={error.department.helper}
                  holder={'add_approved_assets:holder_department'}
                  schema={{
                    label: Commons.SCHEMA_DROPDOWN.DEPARTMENT.label,
                    value: Commons.SCHEMA_DROPDOWN.DEPARTMENT.value,
                    icon: Commons.SCHEMA_DROPDOWN.DEPARTMENT.icon,
                    hidden: Commons.SCHEMA_DROPDOWN.DEPARTMENT.hidden,
                  }}
                  defaultValue={form.department}
                  onChangeItem={(value, index) => handleCombobox(value, INPUT_NAME.DEPARTMENT)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.DEPARTMENT)}
                />
              </View>

              {/** Region */}
              <View style={[
                cStyles.pt16,
                IS_IOS && { zIndex: 9 }
              ]}>
                <CText styles={'textTitle'} label={'add_approved_assets:region'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => regionRef.current = instance}
                  data={masterState.get('region')}
                  disabled={true}
                  error={error.region.status}
                  errorHelper={error.region.helper}
                  holder={'add_approved_assets:holder_region'}
                  schema={{
                    label: Commons.SCHEMA_DROPDOWN.REGION.label,
                    value: Commons.SCHEMA_DROPDOWN.REGION.value,
                    icon: Commons.SCHEMA_DROPDOWN.REGION.icon,
                    hidden: Commons.SCHEMA_DROPDOWN.REGION.hidden,
                  }}
                  defaultValue={form.region}
                  onChangeItem={value => handleCombobox(value, INPUT_NAME.REGION)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.REGION)}
                />
              </View>

              {/** Assets */}
              <View style={[cStyles.flex1, cStyles.pt16]}>
                <CText styles={'textTitle'} label={'add_approved_assets:assets'} />
                <ScrollView horizontal>
                  <Table borderStyle={styles.table} style={cStyles.mt6}>
                    <Row
                      style={styles.table_header}
                      textStyle={[
                        cStyles.textMeta,
                        cStyles.m3,
                        cStyles.textCenter,
                        cStyles.fontMedium,
                        styles.table_text_header
                      ]}
                      widthArr={isDetail ? [180, 70, 100, 100] : [180, 70, 100, 100, 42]}
                      data={form.assets.header}
                    />
                    {form.assets.data.map((rowData, rowIndex) => (
                      <TableWrapper key={rowIndex.toString()} style={[cStyles.flex1, cStyles.row]} borderStyle={styles.table}>
                        {rowData.map((cellData, cellIndex) => {
                          let disabled = loading.main || cellIndex === 3 || isDetail;
                          return (
                            <Cell
                              key={cellIndex.toString()}
                              width={cellIndex === 0 ? 180 : cellIndex === 1 ? 70 : cellIndex === 4 ? 42 : 100}
                              height={40}
                              data={
                                <AssetItem
                                  disabled={disabled}
                                  cellData={cellData}
                                  rowIndex={rowIndex}
                                  cellIndex={cellIndex}
                                  onChangeCellItem={onChangeCellItem}
                                  onRemoveRow={onRemoveRow}
                                />
                              }
                            />
                          )
                        })}
                      </TableWrapper>
                    ))}
                  </Table>
                </ScrollView>

                <View style={[cStyles.flex1, cStyles.row, cStyles.justifyBetween, cStyles.itemsCenter, cStyles.pt10]}>
                  <View style={{ flex: 0.6 }}>
                    {error.assets.status &&
                      <CText styles={'textMeta colorRed'} label={t(error.assets.helper)} />
                    }
                  </View>

                  {!isDetail &&
                    <TouchableOpacity
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyEnd,
                        cStyles.py10,
                        { flex: 0.4 }
                      ]}
                      activeOpacity={0.5}
                      disabled={loading.main || loading.submitAdd || isDetail}
                      onPress={handleAddAssets}
                    >
                      <Icon name={'plus-circle'} size={scalePx(3)} color={colors.BLACK} />
                      <CText styles={'textMeta textUnderline pl6 colorBlack'} label={'add_approved_assets:add_assets'} />
                    </TouchableOpacity>
                  }
                </View>
              </View>

              {/** Where use */}
              <View style={[
                cStyles.pt16,
                IS_IOS && { zIndex: 8 }
              ]}>
                <CText styles={'textTitle'} label={'add_approved_assets:where_use'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => whereUseRef.current = instance}
                  data={masterState.get('department')}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  searchable={true}
                  searchablePlaceholder={t('add_approved_assets:search_department')}
                  error={error.whereUse.status}
                  errorHelper={error.whereUse.helper}
                  holder={'add_approved_assets:holder_where_use'}
                  schema={{
                    label: Commons.SCHEMA_DROPDOWN.DEPARTMENT.label,
                    value: Commons.SCHEMA_DROPDOWN.DEPARTMENT.value,
                    icon: Commons.SCHEMA_DROPDOWN.DEPARTMENT.icon,
                    hidden: Commons.SCHEMA_DROPDOWN.DEPARTMENT.hidden,
                  }}
                  defaultValue={form.whereUse}
                  onChangeItem={value => handleCombobox(value, INPUT_NAME.WHERE_USE, reasonRef)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.WHERE_USE)}
                />
              </View>

              {/** Reason */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved_assets:reason'} />
                <CInput
                  name={INPUT_NAME.REASON}
                  style={styles.input_multiline}
                  styleFocus={styles.input_focus}
                  inputRef={ref => reasonRef = ref}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  holder={'add_approved_assets:holder_reason'}
                  value={form.reason}
                  valueColor={colors.BLACK}
                  keyboard={'default'}
                  returnKey={'next'}
                  multiline
                  textAlignVertical={'top'}
                  onChangeInput={() => handleChangeInput(supplierRef)}
                  onChangeValue={handleChangeText}
                />
              </View>

              {/** Type assets */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved_assets:type_assets'} />
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                  <TouchableOpacity
                    style={{ flex: 0.4 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseTypeAssets('N')}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.typeAssets === 'N' ? 'check-circle' : 'circle'}
                        size={scalePx(3.5)}
                        color={form.typeAssets === 'N' ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.typeAssets === 'N'}
                      />
                      <CText styles={'pl10'} label={'add_approved_assets:buy_new'} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 0.6 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseTypeAssets('A')}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.typeAssets === 'A' ? 'check-circle' : 'circle'}
                        size={scalePx(3.5)}
                        color={form.typeAssets === 'A' ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.typeAssets === 'A'}
                      />
                      <CText styles={'pl10'} label={'add_approved_assets:additional'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/** In Planning */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved_assets:in_planning'} />
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                  <TouchableOpacity
                    style={{ flex: 0.4 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseInPlanning(true)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.inPlanning ? 'check-circle' : 'circle'}
                        size={scalePx(3.5)}
                        color={form.inPlanning ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.inPlanning}
                      />
                      <CText styles={'pl10'} label={'add_approved_assets:yes'} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 0.6 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseInPlanning(false)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={!form.inPlanning ? 'check-circle' : 'circle'}
                        size={scalePx(3.5)}
                        color={!form.inPlanning ? colors.SECONDARY : colors.PRIMARY}
                        solid={!form.inPlanning}
                      />
                      <CText styles={'pl10'} label={'add_approved_assets:no'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/** Supplier */}
              <View style={[cStyles.pt16, cStyles.pb32]}>
                <CText styles={'textTitle'} label={'add_approved_assets:supplier'} />
                <CInput
                  name={INPUT_NAME.SUPPLIER}
                  styleFocus={styles.input_focus}
                  inputRef={ref => supplierRef = ref}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  holder={'add_approved_assets:holder_supplier'}
                  value={form.supplier}
                  valueColor={colors.BLACK}
                  keyboard={'default'}
                  returnKey={'done'}
                  onChangeInput={onSendRequest}
                  onChangeValue={handleChangeText}
                />
              </View>

              <View style={cStyles.flex1} />
            </ScrollView>
          </KeyboardAvoidingView>

          {isDetail &&
            <CCard
              containerStyle={cStyles.m16}
              label={'add_approved_assets:table_process'}
              cardContent={
                <View style={[cStyles.itemsStart, cStyles.pt16]}>
                  {process.map((item, index) => {
                    return (
                      <View key={index.toString()} style={[cStyles.row, cStyles.itemsStart, cStyles.pt10]}>
                        {item.approveDate ?
                          <View style={[
                            cStyles.rounded1,
                            cStyles.px10,
                            cStyles.py6,
                            cStyles.itemsCenter,
                            styles.con_time_process,
                          ]}>
                            <CText
                              styles={'textMeta fontBold colorWhite'}
                              customLabel={item.approveDate}
                            />
                            <CText
                              styles={'textMeta fontBold colorWhite'}
                              customLabel={item.approveTime}
                            />
                          </View> : <View style={[
                            cStyles.rounded1,
                            cStyles.px10,
                            cStyles.py6,
                            cStyles.itemsCenter,
                            { flex: 0.3 },
                          ]} />
                        }

                        <View style={[cStyles.px10, cStyles.pt6, cStyles.itemsCenter, { flex: 0.1 }]}>
                          <Icon
                            name={!item.approveDate
                              ? 'help-circle'
                              : item.statusID === 0
                                ? 'close-circle'
                                : 'check-circle'}
                            size={scalePx(3)}
                            color={!item.approveDate
                              ? colors.ORANGE
                              : item.statusID === 0
                                ? colors.RED
                                : colors.GREEN}
                            solid
                          />
                          {index !== process.length - 1 &&
                            <View style={[cStyles.mt10, styles.line_2]} />
                          }
                        </View>

                        <View style={[cStyles.rounded1, cStyles.pr10, { flex: 0.6 }]}>
                          <View style={[cStyles.row, cStyles.itemsStart, { width: '70%' }]}>
                            <CText styles={'textMeta ' + (item.approveDate && 'colorText')}
                              label={'add_approved_lost_damaged:' + (index === 0 ? 'user_request' : 'person_approved')} />
                            <CText styles={'textMeta fontBold ' + (item.approveDate && 'colorText')}
                              customLabel={item.personApproveName} />
                          </View>
                          <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                            <CText styles={'textMeta ' + (item.approveDate && 'colorText')}
                              label={'add_approved_assets:status_approved'} />
                            {item.approveDate
                              ? <CText styles={'textMeta fontBold ' + (item.approveDate && 'colorText')}
                                customLabel={item.statusName} />
                              : <CText styles={'textMeta fontBold ' + (item.approveDate && 'colorText')}
                                label={'add_approved_assets:wait'} />
                            }
                          </View>
                          {item.approveDate && item.reason !== '' &&
                            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart, { width: '80%' }]}>
                              <CText styles={'textMeta ' + (item.approveDate && 'colorText')}
                                label={'add_approved_assets:reason_reject'} />
                              <CText styles={'textMeta fontBold ' + (item.approveDate && 'colorText')}
                                customLabel={item.reason} />
                            </View>
                          }
                        </View>
                      </View>
                    )
                  })}
                </View>
              }
            />
          }

          {/** MODAL */}
          <CDateTimePicker
            show={showPickerDate}
            value={form.dateRequest}
            onChangeDate={onChangeDateRequest}
          />

          <RejectModal
            loading={loading.submitReject}
            showReject={showReject}
            onReject={onReject}
            onCloseReject={onCloseReject}
          />
        </CContent>
      }
      footer={
        !isDetail ?
          <View style={cStyles.px16}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
              label={'add_approved_assets:send'}
              onPress={onSendRequest}
            />
          </View>
          :
          form.isAllowApproved
            ?
            <View style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEvenly,
              cStyles.px16
            ]}>
              <CButton
                style={styles.button_approved}
                block
                color={colors.RED}
                disabled={loading.main}
                icon={'hand-right'}
                label={'add_approved_assets:reject'}
                onPress={handleReject}
              />
              <CButton
                style={styles.button_reject}
                block
                color={colors.GREEN}
                disabled={loading.main}
                icon={'check-decagram'}
                label={'add_approved_assets:approved'}
                onPress={handleApproved}
              />
            </View>
            : null
      }
    />
  );
};

const styles = StyleSheet.create({
  input_focus: {
    borderColor: colors.PRIMARY,
    borderWidth: 0.5,
  },
  table: { borderWidth: 1, borderColor: colors.TABLE_LINE },
  table_header: { height: 30, backgroundColor: colors.TABLE_HEADER, },
  table_text_header: { color: colors.BLACK },
  button_approved: { width: cStyles.deviceWidth / 2.5 },
  button_reject: { width: cStyles.deviceWidth / 2.5 },
  con_process: { backgroundColor: colors.GRAY_300 },
  con_title_process: { backgroundColor: colors.WHITE, position: 'absolute', top: -15, },
  con_time_process: { backgroundColor: colors.SECONDARY, flex: 0.3 },
  input_multiline: { height: 100 },
  line_1: { width: 2, backgroundColor: colors.PRIMARY, height: 40 },
  line_2: { width: 2, backgroundColor: colors.PRIMARY, height: 20 }
});

export default AddRequest;
