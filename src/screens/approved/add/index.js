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
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Table,
  Row,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CDropdown from '~/components/CDropdown';
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import moment from 'moment';
import Configs from '~/config';
/* REDUX */

const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME: 'name',
  DEPARTMENT: 'department',
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
      ]
    },
    whereUse: null,
    reason: '',
    typeAssets: 'new',
    inPlanning: false,
    supplier: '',
    status: 'request',
  });

  /** FUNC */
  const onChangeDateRequest = (dateView, showPicker) => {
    if (dateView) {
      setForm({
        ...form,
        dateRequest: moment(dateView).format(Configs.dateFormat)
      });
    }
    setShowPickerDate(showPicker);
  };

  const onChangeCellItem = (value, rowIndex, cellIndex) => {
    let newData = form.assets.data;
    newData[rowIndex][cellIndex] = value;
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      }
    });
  }

  /** HANDLE FUNC */
  const handleDateInput = () => {
    setShowPickerDate(true);
  };

  const handleChangeInput = (inputRef) => {
    if (inputRef) inputRef.focus();
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
      contentStyle={cStyles.justifyEnd}
      safeArea={{
        top: true,
        bottom: true,
      }}
      loading={loading}
      header
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
                onChangeInput={() => handleChangeInput(departmentRef)}
              />
            </View>

            {/** Department & Area */}
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt12]}>
              {/** Department */}
              <View style={[cStyles.flex1, cStyles.pr4]}>
                <CText styles={'textTitle'} label={'add_approved:department'} />
                <CDropdown
                  data={[
                    { label: 'Bộ phận IT', value: 'it' },
                    { label: 'Bộ phận HR', value: 'hr' },
                    { label: 'Bộ phận Merketing', value: 'mk' },
                  ]}
                  defaultValue={form.department}
                  onChangeItem={item => setForm({ ...form, department: item.value, })}
                />
              </View>

              {/** Area */}
              <View style={[cStyles.flex1, cStyles.pl4]}>
                <CText styles={'textTitle'} label={'add_approved:area'} />
                <View>
                  <CDropdown
                    data={[
                      { label: 'Hồ Chí Minh', value: 'hcm' },
                      { label: 'Hà Nội', value: 'hn' },
                    ]}
                    defaultValue={form.area}
                    onChangeItem={item => setForm({ ...form, area: item.value, })}
                  />
                </View>
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
              <TouchableOpacity style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd, cStyles.pt10]} activeOpacity={0.5} onPress={handleAddAssets}>
                <Icon name={'plus-circle'} size={15} color={colors.GRAY_500} />
                <CText styles={'textMeta textUnderline pl6'} label={'add_approved:add_assets'} />
              </TouchableOpacity>
            </View>

            {/** where use */}
            <View style={cStyles.pr4}>
              <CText styles={'textTitle'} label={'add_approved:where_use'} />
              <View style={{ zIndex: 2 }}>
                <CDropdown
                  data={[
                    { label: 'Bộ phận IT', value: 'it' },
                    { label: 'Bộ phận HR', value: 'hr' },
                    { label: 'Bộ phận Merketing', value: 'mk' },
                  ]}
                  defaultValue={form.whereUse}
                  onChangeItem={item => setForm({ ...form, whereUse: item.value, })}
                />
              </View>
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
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEvenly, cStyles.pt10]}>
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
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
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
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEvenly, cStyles.pt10]}>
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
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
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
            <View style={cStyles.pt12}>
              <CText styles={'textTitle'} label={'add_approved:supplier'} />
              <CInput
                containerStyle={cStyles.mt6}
                style={styles.input}
                styleFocus={styles.input_focus}
                id={INPUT_NAME.SUPPLIER}
                inputRef={ref => supplierRef = ref}
                disabled={loading}
                holder={'add_approved:supplier'}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'done'}
              />
            </View>

          </View>
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
