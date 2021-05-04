/**
 ** Name: Add new request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Request.js
 **/
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Row,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { showMessage } from "react-native-flash-message";
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
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import { IS_IOS, alert } from '~/utils/helper';
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

  const [loading, setLoading] = useState({
    main: true,
    submit: false,
  });
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [isDetail, setIsDetail] = useState(props.route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
  const [form, setForm] = useState({
    dateRequest: moment().format(commonState.get('formatDate')),
    name: '',
    department: '',
    region: '',
    assets: {
      header: [
        t('add_approved:description'),
        t('add_approved:amount'),
        t('add_approved:price'),
        t('add_approved:total'),
      ],
      data: [
        ['', '', '', ''],
      ],
    },
    whereUse: '',
    reason: '',
    typeAssets: 'N',
    inPlanning: false,
    supplier: '',
    status: 1,
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
    newData.push(['', '', '', '']);
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
        department: data.value,
        whereUse: data.value,
      });
      if (error.department.status) {
        setError({ ...error, department: { status: false, helper: '' } });
      }
      departmentRef.current.close();
      regionRef.current.open();
    } else if (field === INPUT_NAME.REGION) {
      setForm({
        ...form,
        region: data.value,
      });
      if (error.region.status) {
        setError({ ...error, region: { status: false, helper: '' } });
      }
      regionRef.current.close();
      whereUseRef.current.open();
    } else if (field === INPUT_NAME.WHERE_USE) {
      setForm({
        ...form,
        whereUse: data.value,
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
    alert(t, 'add_approved:message_confirm_approved', onApproved);
  };

  const handleReject = () => {
    alert(t, 'add_approved:message_confirm_reject', onReject);
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
    setLoading({ ...loading, submit: true });
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
        'EmpCode': 'D0850',
        'DeptCode': form.department,
        'RegionCode': form.region,
        'JobTitle': 'Đại diện Kinh doanh',
        'RequestDate': form.dateRequest,
        'Location': form.whereUse,
        'Reason': form.reason,
        'DocType': form.typeAssets,
        'IsBudget': form.inPlanning,
        'SupplierName': form.supplier,
        'Lang': commonState.get('language'),
        'ListAssets': assets,
      };
      dispatch(Actions.fetchAddRequestApproved(params));
    } else {
      setError(isValid.data);
      setLoading({ ...loading, submit: false });
    };
  };

  const onOpenCombobox = (inputName) => {
    switch (inputName) {
      case INPUT_NAME.DEPARTMENT:
        regionRef.current.close();
        whereUseRef.current.close();
        break;
      case INPUT_NAME.REGION:
        departmentRef.current.close();
        whereUseRef.current.close();
        break;
      case INPUT_NAME.WHERE_USE:
        departmentRef.current.close();
        regionRef.current.close();
        break;
    }
  };

  const onPrepareData = () => {
    let params = {
      listType: 'Department, Region',
    }
    dispatch(Actions.fetchMasterData(params));
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
  }

  const onPrepareDetail = () => {
    let tmp = {
      dateRequest: isDetail
        ? moment(props.route.params?.data.requestDate, 'YYYY-MM-DDTHH:mm:ss').format(commonState.get('formatDate'))
        : moment().format(commonState.get('formatDate')),
      name: isDetail
        ? props.route.params?.data.personRequest
        : '',
      department: isDetail
        ? props.route.params?.data?.deptCode
        : '',
      region: isDetail
        ? props.route.params?.data?.regionCode
        : '',
      assets: {
        header: [
          t('add_approved:description'),
          t('add_approved:amount'),
          t('add_approved:price'),
          t('add_approved:total'),
        ],
        data: [
          ['', '', '', '-'],
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

  };

  const onReject = () => {

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
    if (loading.submit) {
      if (!approvedState.get('submitting')) {
        setLoading({ ...loading, submit: false });
        if (approvedState.get('successAddRequest')) {
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
    loading.submit,
    approvedState.get('submitting'),
    approvedState.get('successAddRequest'),
    approvedState.get('errorAddRequest'),
  ]);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading.main || loading.submit}
      header
      hasBack
      title={'add_approved:title'}
      content={
        <CContent>
          <KeyboardAvoidingView style={cStyles.flex1} behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={120}>
            <ScrollView
              style={cStyles.flex1}
              contentContainerStyle={[cStyles.p16, cStyles.justifyEnd]}
            >
              {/** Date request */}
              <View>
                <CText styles={'textTitle'} label={'add_approved:date_request'} />
                <CInput
                  name={INPUT_NAME.DATE_REQUEST}
                  style={styles.input}
                  inputRef={ref => dateRequestRef = ref}
                  disabled={true}
                  dateTimePicker={true}
                  value={moment(form.dateRequest).format(
                    commonState.get('formatDateView')
                  )}
                  valueColor={colors.BLACK}
                  iconLast={'calendar-alt'}
                  iconLastColor={colors.GRAY_700}
                  onPressIconLast={handleDateInput}
                />
              </View>

              {/** Name */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved:name'} />
                <CInput
                  name={INPUT_NAME.NAME}
                  style={styles.input}
                  styleFocus={styles.input_focus}
                  inputRef={ref => nameRef = ref}
                  disabled={true}
                  holder={'add_approved:name'}
                  value={form.name}
                  valueColor={colors.BLACK}
                  keyboard={'default'}
                  returnKey={'next'}
                  onChangeInput={() => handleChangeInput(departmentRef, 'combobox')}
                />
              </View>

              {/** Department & Region */}
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt16, IS_IOS && { zIndex: 3000 }]}>
                {/** Department */}
                <View style={[cStyles.flex1, cStyles.pr4]}>
                  <CText styles={'textTitle'} label={'add_approved:department'} />
                  <CDropdown
                    loading={loading.main}
                    controller={instance => departmentRef.current = instance}
                    data={masterState.get('department')}
                    disabled={loading.main || loading.submit || isDetail}
                    searchable={true}
                    searchablePlaceholder={t('add_approved:search_department')}
                    error={error.department.status}
                    errorHelper={error.department.helper}
                    holder={'add_approved:holder_department'}
                    defaultValue={form.department}
                    onChangeItem={item => handleCombobox(item, INPUT_NAME.DEPARTMENT)}
                    onOpen={() => onOpenCombobox(INPUT_NAME.DEPARTMENT)}
                  />
                </View>
              </View>

              {/** Region */}
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt16, IS_IOS && { zIndex: 2000 }]}>
                <View style={[cStyles.flex1, cStyles.pl4]}>
                  <CText styles={'textTitle'} label={'add_approved:region'} />
                  <CDropdown
                    loading={loading.main}
                    controller={instance => regionRef.current = instance}
                    data={masterState.get('region')}
                    disabled={loading.main || loading.submit || isDetail}
                    error={error.region.status}
                    errorHelper={error.region.helper}
                    holder={'add_approved:holder_region'}
                    defaultValue={form.region}
                    onChangeItem={item => handleCombobox(item, INPUT_NAME.REGION)}
                    onOpen={() => onOpenCombobox(INPUT_NAME.REGION)}
                  />
                </View>
              </View>

              {/** Assets */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved:assets'} />
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
                    flexArr={[1.97, 1, 1, 1]}
                    data={form.assets.header}
                  />
                  {form.assets.data.map((rowData, rowIndex) => (
                    <TableWrapper key={rowIndex.toString()} style={cStyles.row}>
                      {rowData.map((cellData, cellIndex) => {
                        let disabled = loading.main || loading.submit || cellIndex === 3 || isDetail;
                        return (
                          <Cell
                            key={cellIndex.toString()}
                            width={cellIndex === 0 ? '39.5%' : '20.2%'}
                            data={
                              <AssetItem
                                disabled={disabled}
                                cellData={cellData}
                                rowIndex={rowIndex}
                                cellIndex={cellIndex}
                                onChangeCellItem={onChangeCellItem}

                              />
                            }
                          />
                        )
                      })}
                    </TableWrapper>
                  ))}
                </Table>
                <View style={[cStyles.flex1, cStyles.row, cStyles.justifyBetween, cStyles.itemsCenter, cStyles.pt10]}>
                  <View style={{ flex: 0.6 }}>
                    {error.assets.status &&
                      <CText styles={'textMeta colorRed'} label={t(error.assets.helper)} />
                    }
                  </View>

                  {!isDetail &&
                    <TouchableOpacity
                      style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd, { flex: 0.4 }]}
                      activeOpacity={0.5}
                      disabled={loading.main || loading.submit || isDetail}
                      onPress={handleAddAssets}
                    >
                      <Icon name={'plus-circle'} size={15} color={colors.BLACK} />
                      <CText styles={'textMeta textUnderline pl6 colorBlack'} label={'add_approved:add_assets'} />
                    </TouchableOpacity>
                  }
                </View>
              </View>

              {/** where use */}
              <View style={[cStyles.pt16, cStyles.pr4, IS_IOS && { zIndex: 1000 }]}>
                <CText styles={'textTitle'} label={'add_approved:where_use'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => whereUseRef.current = instance}
                  data={masterState.get('department')}
                  disabled={loading.main || loading.submit || isDetail}
                  searchable={true}
                  searchablePlaceholder={t('add_approved:search_department')}
                  error={error.whereUse.status}
                  errorHelper={error.whereUse.helper}
                  holder={'add_approved:holder_where_use'}
                  defaultValue={form.whereUse}
                  onChangeItem={item => handleCombobox(item, INPUT_NAME.WHERE_USE, reasonRef)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.WHERE_USE)}
                />
              </View>

              {/** Reason */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved:reason'} />
                <CInput
                  name={INPUT_NAME.REASON}
                  style={styles.input}
                  styleFocus={styles.input_focus}
                  inputRef={ref => reasonRef = ref}
                  disabled={loading.main || loading.submit || isDetail}
                  holder={'add_approved:reason'}
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
                <CText styles={'textTitle'} label={'add_approved:type_assets'} />
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                  <TouchableOpacity
                    style={{ flex: 0.4 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submit || isDetail}
                    onPress={() => handleChooseTypeAssets('N')}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.typeAssets === 'N' ? 'check-circle' : 'circle'}
                        size={20}
                        color={form.typeAssets === 'N' ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.typeAssets === 'N'}
                      />
                      <CText styles={'pl10'} label={'add_approved:buy_new'} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 0.6 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submit || isDetail}
                    onPress={() => handleChooseTypeAssets('A')}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.typeAssets === 'A' ? 'check-circle' : 'circle'}
                        size={20}
                        color={form.typeAssets === 'A' ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.typeAssets === 'A'}
                      />
                      <CText styles={'pl10'} label={'add_approved:additional'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/** In Planning */}
              <View style={cStyles.pt16}>
                <CText styles={'textTitle'} label={'add_approved:in_planning'} />
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                  <TouchableOpacity
                    style={{ flex: 0.4 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submit || isDetail}
                    onPress={() => handleChooseInPlanning(true)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={form.inPlanning ? 'check-circle' : 'circle'}
                        size={20}
                        color={form.inPlanning ? colors.SECONDARY : colors.PRIMARY}
                        solid={form.inPlanning}
                      />
                      <CText styles={'pl10'} label={'add_approved:yes'} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 0.6 }}
                    activeOpacity={0.5}
                    disabled={loading.main || loading.submit || isDetail}
                    onPress={() => handleChooseInPlanning(false)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={!form.inPlanning ? 'check-circle' : 'circle'}
                        size={20}
                        color={!form.inPlanning ? colors.SECONDARY : colors.PRIMARY}
                        solid={!form.inPlanning}
                      />
                      <CText styles={'pl10'} label={'add_approved:no'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/** Supplier */}
              <View style={[cStyles.pt16, cStyles.pb32]}>
                <CText styles={'textTitle'} label={'add_approved:supplier'} />
                <CInput
                  name={INPUT_NAME.SUPPLIER}
                  style={styles.input}
                  styleFocus={styles.input_focus}
                  inputRef={ref => supplierRef = ref}
                  disabled={loading.main || loading.submit || isDetail}
                  holder={'add_approved:holder_supplier'}
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
            <View style={[
              cStyles.rounded1,
              cStyles.itemsCenter,
              cStyles.borderAll,
              cStyles.mb16,
              styles.con_process
            ]}>
              <View style={[
                cStyles.rounded1,
                cStyles.px10,
                cStyles.py3,
                cStyles.borderAll,
                styles.con_title_process
              ]}>
                <CText label={'add_approved:table_process'} />
              </View>

              <View style={[cStyles.p10, cStyles.pt24]}>
                <View style={[cStyles.row, cStyles.itemsStart, cStyles.py6]}>
                  <View style={[
                    cStyles.rounded1,
                    cStyles.px10,
                    cStyles.py6,
                    cStyles.itemsCenter,
                    styles.con_time_process
                  ]}>
                    <CText
                      styles={'textMeta fontBold colorWhite'}
                      customLabel={moment(form.dateRequest).format(commonState.get('formatDateView'))}
                    />
                  </View>

                  <View style={[cStyles.px10, cStyles.itemsCenter]}>
                    <Icon
                      name={'file-import'}
                      size={20}
                      color={colors.GRAY_700}
                    />
                    {process.length > 0 &&
                      <View style={[cStyles.mt16, { width: 2, backgroundColor: colors.PRIMARY, height: 30 }]} />
                    }
                  </View>

                  <View style={[cStyles.rounded1, cStyles.pr10, { width: '60%' }]}>
                    <View style={[cStyles.row, cStyles.itemsStart]}>
                      <CText label={'add_approved:user_request'} />
                      <CText styles={'fontBold'} customLabel={form.name} />
                    </View>
                    <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                      <CText label={'add_approved:status_approved'} />
                      <CText styles={'fontBold'} label={'add_approved:status_wait'} />
                    </View>
                    {form.reason !== '' &&
                      <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                        <CText label={'add_approved:reason_reject'} />
                        <CText customLabel={form.reason} />
                      </View>
                    }
                  </View>
                </View>

                {process.map((item, index) => {
                  return (
                    <View key={index.toString()} style={[cStyles.row, cStyles.itemsStart, cStyles.py10]}>
                      <View style={[
                        cStyles.rounded1,
                        cStyles.px10,
                        cStyles.py6,
                        cStyles.itemsCenter,
                        styles.con_time_process,
                      ]}>
                        <CText
                          styles={'textMeta fontBold colorWhite'}
                          customLabel={
                            moment(item.approveDate, 'DD/MM/YYYY - HH:mm')
                              .format(commonState.get('formatDateView'))
                          }
                        />
                        <CText
                          styles={'textMeta fontBold colorWhite'}
                          customLabel={moment(item.approveDate, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                        />
                      </View>

                      <View style={[cStyles.px10, cStyles.itemsCenter]}>
                        <Icon
                          name={item.statusID ? 'check-circle' : 'times-circle'}
                          size={20}
                          color={item.statusID ? colors.GREEN : colors.RED}
                          solid
                        />
                        {index !== process.length - 1 &&
                          <View style={[cStyles.mt16, { width: 2, backgroundColor: colors.PRIMARY, height: 30 }]} />
                        }
                      </View>

                      <View style={[cStyles.rounded1, cStyles.pr10]}>
                        <View style={[cStyles.row, cStyles.itemsStart]}>
                          <CText label={'add_approved:person_approved'} />
                          <CText styles={'fontBold'} customLabel={item.personApproveName} />
                        </View>
                        <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                          <CText label={'add_approved:status_approved'} />
                          <CText styles={'fontBold'} customLabel={item.statusName} />
                        </View>
                        {!item.statusID &&
                          <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                            <CText label={'add_approved:reason_reject'} />
                            <CText customLabel={item.reason} />
                          </View>
                        }
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          }

          {/** PICKER */}
          <CDateTimePicker
            show={showPickerDate}
            value={form.dateRequest}
            onChangeDate={onChangeDateRequest}
          />
        </CContent>
      }
      footer={
        !isDetail ?
          <View style={cStyles.px16}>
            <CButton
              block
              disabled={loading.main || loading.submit}
              label={'add_approved:send'}
              onPress={onSendRequest}
            />
          </View>
          :
          form.status < 3
            ?
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEvenly, cStyles.px16]}>
              <CButton
                style={styles.button_approved}
                block
                color={colors.RED}
                disabled={loading.main || loading.submit}
                icon={'times-circle'}
                label={'add_approved:reject'}
                onPress={handleReject}
              />
              <CButton
                style={styles.button_reject}
                block
                disabled={loading.main || loading.submit}
                icon={'check-double'}
                label={'add_approved:approved'}
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
  con_time_process: { backgroundColor: colors.SECONDARY },
});

export default AddRequest;
