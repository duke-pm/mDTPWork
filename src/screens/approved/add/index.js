/**
 ** Name: Add new request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Add.js
 **/
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
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
/* COMMON */
import Configs from '~/config';
import {
  alert
} from '~/utils/helper';
import { colors, cStyles } from '~/utils/style';
import { IS_IOS } from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME: 'name',
  DEPARTMENT: 'department',
  AREA: 'area',
  ASEETS: 'assets',
  WHERE_USE: 'whereUse',
  REASON: 'reason',
  TYPE_ASSETS: 'typeAssets',
  IN_PLANNING: 'inPlanning',
  SUPPLIER: 'supplier',
}

function AddApproved(props) {
  const { t } = useTranslation();

  let dateRequestRef = useRef();
  let nameRef = useRef();
  let departmentRef = useRef();
  let areaRef = useRef();
  let whereUseRef = useRef();
  let reasonRef = useRef();
  let supplierRef = useRef();

  const dispatch = useDispatch();
  const masterState = useSelector(({ masterData }) => masterData);
  const languageState = useSelector(({ language }) => language.data);
  const approvedState = useSelector(({ approved }) => approved);

  const [loading, setLoading] = useState({
    main: true,
    submit: false,
  });
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [form, setForm] = useState({
    dateRequest: moment().format(Configs.dateFormat),
    name: '',
    department: '',
    area: '',
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
  });
  const [error, setError] = useState({
    department: {
      status: false,
      helper: '',
    },
    area: {
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
      departmentRef.current.close();
      areaRef.current.open();
    } else if (field === INPUT_NAME.AREA) {
      setForm({
        ...form,
        area: data.value,
      });
      areaRef.current.close();
      whereUseRef.current.open();
    } else if (field === INPUT_NAME.WHERE_USE) {
      setForm({
        ...form,
        whereUse: data.value,
      });
      whereUseRef.current.close();
      if (nextField) nextField.focus();
    }
  };

  /** FUNC */
  const onCheckValidate = () => {
    let tmpError = error, status = true;
    if (form.department === '') {
      tmpError.department.status = true;
      tmpError.department.helper = 'error:not_choose_department';
      status = false;
    }
    if (form.area === '') {
      tmpError.area.status = true;
      tmpError.area.helper = 'error:not_choose_region';
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
    let isValid = onCheckValidate();
    if (isValid.status) {
      /** prepare assets */
      let assets = [];
      for (let item of form.assets.data) {
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
        'RegionCode': form.area,
        'DocDate': form.dateRequest,
        'Location': form.whereUse,
        'Reason': form.reason,
        'DocType': form.typeAssets,
        'IsBudget': form.inPlanning,
        'SupplierName': form.supplier,
        'Lang': languageState,
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
        areaRef.current.close();
        whereUseRef.current.close();
        break;
      case INPUT_NAME.AREA:
        departmentRef.current.close();
        whereUseRef.current.close();
        break;
      case INPUT_NAME.WHERE_USE:
        departmentRef.current.close();
        areaRef.current.close();
        break;
    }
  };

  const onPrepareData = () => {
    let params = {
      listType: 'Department',
    }
    dispatch(Actions.fetchMasterData(params));
  };

  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate(showPicker);
    if (newDate) {
      setForm({
        ...form,
        dateRequest: moment(newDate).format(Configs.dateFormat),
      });
    }
  };

  const onChangeCellItem = (value, rowIndex, cellIndex) => {
    let newData = form.assets.data;
    newData[rowIndex][cellIndex] = value;
    if (newData[rowIndex][1] !== '') {
      if (newData[rowIndex][2] !== '') {
        newData[rowIndex][3] = JSON.stringify(Number(newData[rowIndex][1]) * Number(newData[rowIndex][2]));
      } else newData[rowIndex][3] = '';
    } else newData[rowIndex][3] = '';
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
  }

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (masterState.department.length > 0) {
        setLoading({ ...loading, main: false });
      }
    }
  }, [
    loading.main,
    masterState.submitting,
  ]);

  useEffect(() => {
    if (loading.submit) {
      if (!approvedState.submitting) {
        setLoading({ ...loading, submit: false });
        if (approvedState.successAddRequest) {
          showMessage({
            message: t('common:app_name'),
            description: t('success:send_request'),
            type: 'success',
            icon: 'success'
          });
          props.navigation.goBack();
        }

        if (approvedState.errorAddRequest) {
          showMessage({
            message: t('common:app_name'),
            description: approvedState.errorHelperAddRequest,
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submit,
    approvedState.submitting,
    approvedState.successAddRequest,
    approvedState.errorAddRequest,
  ]);

  /** RENDER */
  const cellItem = (data, rowIndex, cellIndex, disabled, onChangeRow) => {
    return (
      <View style={cStyles.flex1}>
        <TextInput
          value={data}
          style={[
            cStyles.textDefault,
            cStyles.flexWrap,
            cStyles.p4,
            cellIndex === 0 ? cStyles.textLeft : cStyles.textCenter,
            { color: colors.BLACK }
          ]}
          keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
          selectionColor={colors.BLACK}
          multiline
          editable={!disabled}
          onChangeText={(value) => onChangeRow(value, rowIndex, cellIndex)}
        />
      </View>
    );
  };

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
        <CContent padder>
          <View style={cStyles.flex1}>
            {/** Date request */}
            <View>
              <CText styles={'textTitle'} label={'add_approved:date_request'} />
              <CInput
                containerStyle={cStyles.mt6}
                style={styles.input}
                id={INPUT_NAME.DATE_REQUEST}
                inputRef={ref => dateRequestRef = ref}
                disabled={true}
                dateTimePicker={true}
                holder={'add_approved:date_request'}
                value={moment(form.dateRequest).format(Configs.dateFormatView)}
                valueColor={colors.BLACK}
                iconLast={'calendar-alt'}
                iconLastColor={colors.GRAY_700}
                onPressIconLast={handleDateInput}
              />
            </View>

            {/** Name */}
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:name'} />
              <CInput
                containerStyle={cStyles.mt6}
                style={styles.input}
                styleFocus={styles.input_focus}
                id={INPUT_NAME.NAME}
                inputRef={ref => nameRef = ref}
                disabled={true}
                holder={'add_approved:name'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'next'}
                autoFocus
                onChangeInput={() => handleChangeInput(departmentRef, 'combobox')}
              />
            </View>

            {/** Department & Area */}
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt12, IS_IOS && { zIndex: 2000 }]}>
              {/** Department */}
              <View style={[cStyles.flex1, cStyles.pr4]}>
                <CText styles={'textTitle'} label={'add_approved:department'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => departmentRef.current = instance}
                  data={masterState.department}
                  disabled={loading.main || loading.submit}
                  error={error.department.status}
                  errorHelper={error.department.helper}
                  holder={'add_approved:holder_department'}
                  defaultValue={form.department}
                  onChangeItem={item => handleCombobox(item, INPUT_NAME.DEPARTMENT)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.DEPARTMENT)}
                />
              </View>

              {/** Area */}
              <View style={[cStyles.flex1, cStyles.pl4]}>
                <CText styles={'textTitle'} label={'add_approved:area'} />
                <CDropdown
                  loading={loading.main}
                  controller={instance => areaRef.current = instance}
                  data={masterState.region}
                  disabled={loading.main || loading.submit}
                  error={error.area.status}
                  errorHelper={error.area.helper}
                  holder={'add_approved:holder_area'}
                  defaultValue={form.area}
                  onChangeItem={item => handleCombobox(item, INPUT_NAME.AREA)}
                  onOpen={() => onOpenCombobox(INPUT_NAME.AREA)}
                />
              </View>
            </View>

            {/** Assets */}
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:assets'} />
              <Table borderStyle={styles.table} style={cStyles.mt6}>
                <Row
                  style={styles.table_header}
                  textStyle={[
                    cStyles.textMeta,
                    cStyles.m3,
                    cStyles.textCenter,
                    styles.table_text_header
                  ]}
                  flexArr={[1.97, 1, 1, 1]}
                  data={form.assets.header}
                />
                {form.assets.data.map((rowData, rowIndex) => (
                  <TableWrapper key={rowIndex.toString()} style={cStyles.row}>
                    {rowData.map((cellData, cellIndex) => {
                      let disabled = loading.main || loading.submit || cellIndex === 3;
                      return (
                        <Cell
                          key={cellIndex.toString()}
                          width={cellIndex === 0 ? '39.5%' : '20.2%'}
                          data={cellItem(cellData, rowIndex, cellIndex, disabled, onChangeCellItem)}
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

                <TouchableOpacity
                  style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd, { flex: 0.4 }]}
                  activeOpacity={0.5}
                  disabled={loading.main || loading.submit}
                  onPress={handleAddAssets}
                >
                  <Icon name={'plus-circle'} size={15} color={colors.GRAY_500} />
                  <CText styles={'textMeta textUnderline pl6'} label={'add_approved:add_assets'} />
                </TouchableOpacity>
              </View>
            </View>

            {/** where use */}
            <View style={[cStyles.pt12, cStyles.pr4, IS_IOS && { zIndex: 1000 }]}>
              <CText styles={'textTitle'} label={'add_approved:where_use'} />
              <CDropdown
                loading={loading.main}
                controller={instance => whereUseRef.current = instance}
                data={masterState.department}
                disabled={loading.main || loading.submit}
                error={error.whereUse.status}
                errorHelper={error.whereUse.helper}
                holder={'add_approved:holder_where_use'}
                defaultValue={form.whereUse}
                onChangeItem={item => handleCombobox(item, INPUT_NAME.WHERE_USE, reasonRef)}
                onOpen={() => onOpenCombobox(INPUT_NAME.WHERE_USE)}
              />
            </View>

            {/** Reason */}
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:reason'} />
              <CInput
                containerStyle={cStyles.mt6}
                style={styles.input}
                styleFocus={styles.input_focus}
                id={INPUT_NAME.REASON}
                inputRef={ref => reasonRef = ref}
                disabled={loading.main || loading.submit}
                holder={'add_approved:reason'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'next'}
                multiline
                textAlignVertical={'top'}
                onChangeInput={() => handleChangeInput(supplierRef)}
              />
            </View>

            {/** Type assets */}
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:type_assets'} />
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={loading.main || loading.submit}
                  onPress={() => handleChooseTypeAssets('N')}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Icon
                      name={form.typeAssets === 'N' ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.typeAssets === 'N' ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:buy_new'} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={loading.main || loading.submit}
                  onPress={() => handleChooseTypeAssets('A')}>
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pl32]}>
                    <Icon
                      name={form.typeAssets === 'A' ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.typeAssets === 'A' ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:additional'} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/** In Planning */}
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:in_planning'} />
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={loading.main || loading.submit}
                  onPress={() => handleChooseInPlanning(true)}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Icon
                      name={form.inPlanning ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.inPlanning ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:yes'} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={loading.main || loading.submit}
                  onPress={() => handleChooseInPlanning(false)}>
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pl32]}>
                    <Icon
                      name={!form.inPlanning ? 'check-circle' : 'circle'}
                      size={20}
                      color={!form.inPlanning ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:no'} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/** Supplier */}
            <View style={cStyles.py12}>
              <CText styles={'textTitle'} label={'add_approved:supplier'} />
              <CInput
                containerStyle={cStyles.mt6}
                style={styles.input}
                styleFocus={styles.input_focus}
                id={INPUT_NAME.SUPPLIER}
                inputRef={ref => supplierRef = ref}
                disabled={loading.main || loading.submit}
                holder={'add_approved:holder_supplier'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'done'}
              />
            </View>
          </View>

          <CButton
            block
            disabled={loading.main || loading.submit}
            label={'add_approved:send'}
            onPress={onSendRequest}
          />

          {/** PICKER */}
          <CDateTimePicker
            show={showPickerDate}
            value={form.dateRequest}
            onChangeDate={onChangeDateRequest}
          />
        </CContent>
      }
    />
  );
};

const styles = StyleSheet.create({
  input_focus: {
    borderColor: colors.PRIMARY,
    borderWidth: 0.5,
  },
  table: { borderWidth: 1, borderColor: '#c8e1ff' },
  table_header: { height: 30, backgroundColor: '#f1f8ff', },
  table_text_header: { color: colors.BLACK },
});

export default AddApproved;
