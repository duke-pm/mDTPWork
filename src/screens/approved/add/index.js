/**
 ** Name: Add new request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Add.js
 **/
import React, { useRef, useState } from 'react';
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
import { colors, cStyles } from '~/utils/style';
import { IS_IOS } from '~/utils/helper';
/* REDUX */

const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME: 'name',
  DEPARTMENT: 'department',
  AREA: 'area',
  ASEETS: 'ASSETS',
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

  const [loading, setLoading] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [form, setForm] = useState({
    dateRequest: moment().format(Configs.dateFormat),
    name: '',
    department: null,
    area: null,
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
    whereUse: null,
    reason: '',
    typeAssets: 'new',
    inPlanning: false,
    supplier: '',
    status: 'request',
  });

  /** FUNC */
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
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
  }

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

  const handleSendRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showMessage({
        message: t('common:app_name'),
        description: t('success:send_request'),
        icon: "success",
        type: "success",
      });
      props.navigation.goBack();
    }, 2000);
  };

  /** RENDER */
  const cellItem = (data, rowIndex, cellIndex) => {
    return (
      <View style={cStyles.flex1}>
        <TextInput
          value={data}
          style={[
            cStyles.textDefault,
            cStyles.flexWrap,
            cStyles.p4,
            cellIndex === 0 ? cStyles.textLeft : cStyles.textCenter,
            { color: colors.BLACK }]}
          keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
          selectionColor={colors.BLACK}
          multiline
          onChangeText={(value) => onChangeCellItem(value, rowIndex, cellIndex)}
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
      loading={loading}
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
                disabled={loading}
                holder={'add_approved:name'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'next'}
                autoFocus
                onChangeInput={() => handleChangeInput(departmentRef, 'combobox')}
              />
            </View>

            {/** Department & Area */}
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt12, IS_IOS && { zIndex: 6000 }]}>
              {/** Department */}
              <View style={[cStyles.flex1, cStyles.pr4]}>
                <CText styles={'textTitle'} label={'add_approved:department'} />
                <CDropdown
                  controller={instance => departmentRef.current = instance}
                  data={[
                    { label: 'Bộ phận IT', value: 'it' },
                    { label: 'Bộ phận HR', value: 'hr' },
                    { label: 'Bộ phận Marketing', value: 'mk' },
                  ]}
                  holder={'add_approved:holder_department'}
                  defaultValue={form.department}
                  onChangeItem={item => handleCombobox(item, INPUT_NAME.DEPARTMENT)}
                />
              </View>

              {/** Area */}
              <View style={[cStyles.flex1, cStyles.pl4]}>
                <CText styles={'textTitle'} label={'add_approved:area'} />
                <CDropdown
                  controller={instance => areaRef.current = instance}
                  data={[
                    { label: 'Hồ Chí Minh', value: 'hcm' },
                    { label: 'Hà Nội', value: 'hn' },
                  ]}
                  holder={'add_approved:holder_area'}
                  defaultValue={form.area}
                  onChangeItem={item => handleCombobox(item, INPUT_NAME.AREA)}
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
                      return (
                        <Cell
                          key={cellIndex.toString()}
                          width={cellIndex === 0 ? '39.5%' : '20.2%'}
                          data={cellItem(cellData, rowIndex, cellIndex)}
                        />
                      )
                    })}
                  </TableWrapper>
                ))}
              </Table>
              <View style={[cStyles.flex1, cStyles.itemsEnd, cStyles.pt10]}>
                <TouchableOpacity
                  style={[cStyles.row, cStyles.itemsCenter]}
                  activeOpacity={0.5}
                  onPress={handleAddAssets}
                >
                  <Icon name={'plus-circle'} size={15} color={colors.GRAY_500} />
                  <CText styles={'textMeta textUnderline pl6'} label={'add_approved:add_assets'} />
                </TouchableOpacity>
              </View>
            </View>

            {/** where use */}
            <View style={[cStyles.pr4, IS_IOS && { zIndex: 6000 }]}>
              <CText styles={'textTitle'} label={'add_approved:where_use'} />
              <CDropdown
                controller={instance => whereUseRef.current = instance}
                data={[
                  { label: 'Bộ phận IT', value: 'it' },
                  { label: 'Bộ phận HR', value: 'hr' },
                  { label: 'Bộ phận Marketing', value: 'mk' },
                ]}
                holder={'add_approved:holder_where_use'}
                defaultValue={form.whereUse}
                onChangeItem={item => handleCombobox(item, INPUT_NAME.WHERE_USE, reasonRef)}
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
                disabled={loading}
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
                <TouchableOpacity activeOpacity={0.5} onPress={() => handleChooseTypeAssets('new')}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Icon
                      name={form.typeAssets === 'new' ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.typeAssets === 'new' ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:buy_new'} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => handleChooseTypeAssets('additional')}>
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pl32]}>
                    <Icon
                      name={form.typeAssets === 'additional' ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.typeAssets === 'additional' ? colors.PRIMARY : colors.GRAY_500}
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
                <TouchableOpacity activeOpacity={0.5} onPress={() => handleChooseInPlanning(true)}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Icon
                      name={form.inPlanning ? 'check-circle' : 'circle'}
                      size={20}
                      color={form.inPlanning ? colors.PRIMARY : colors.GRAY_500}
                    />
                    <CText styles={'pl10'} label={'add_approved:yes'} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => handleChooseInPlanning(false)}>
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
                disabled={loading}
                holder={'add_approved:holder_supplier'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'done'}
              />
            </View>
          </View>

          <CButton
            block
            disabled={loading}
            label={'add_approved:send'}
            onPress={handleSendRequest}
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
