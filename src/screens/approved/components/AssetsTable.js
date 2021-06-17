/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Table of assets
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AssetsTable.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import AssetItem from './AssetItem';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';

function AssetsTable(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {
    loading = false,
    checking = false,
    isDetail = false,
    assets = {
      header: ['', '', '', ''],
      data: [],
    },
    onCallbackValidate = () => {},
  } = props;

  /** Use state */
  const [form, setForm] = useState({
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
  });
  const [error, setError] = useState({
    status: false,
    helper: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddAssets = () => {
    let newData = [...form.assets.data];
    newData.push(['', '', '', '', null]);
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
  };

  /************
   ** FUNC **
   ************/
  const onChangeCellItem = (value, rowIndex, cellIndex) => {
    let newData = form.assets.data;
    newData[rowIndex][cellIndex] = value;
    if (newData[rowIndex][1] !== '') {
      if (newData[rowIndex][2] !== '') {
        newData[rowIndex][3] = JSON.stringify(
          Number(newData[rowIndex][1]) * Number(newData[rowIndex][2]),
        );
      } else {
        newData[rowIndex][3] = '';
      }
    } else {
      newData[rowIndex][3] = '';
    }
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
    if (error.status) {
      setError({status: false, helper: ''});
    }
  };

  const onRemoveRow = rowIndex => {
    let newData = [...form.assets.data];
    newData.splice(rowIndex, 1);
    setForm({
      ...form,
      assets: {
        ...form.assets,
        data: newData,
      },
    });
  };

  const onValidate = () => {
    setError({
      status: false,
      helper: '',
    });
    let tmpError = {
        status: false,
        helper: '',
      },
      item = null;
    if (form.assets.data.length > 0) {
      for (item of form.assets.data) {
        if (item[0].trim() === '') {
          tmpError.status = true;
          tmpError.helper = 'error:not_enough_assets';
        } else {
          if (item[1] === '' || (item[1] !== '' && Number(item[1]) < 1)) {
            tmpError.status = true;
            tmpError.helper = 'error:assets_need_larger_than_zero';
          }
        }
      }
    } else {
      tmpError.status = true;
      tmpError.helper = 'error:not_enough_assets';
    }
    setError(tmpError);
    onCallbackValidate({
      status: tmpError.status,
      data: form.assets.data,
    });
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    if (assets) {
      setForm({...form, assets: assets});
    }
  }, [assets, setForm]);

  useEffect(() => {
    if (checking) {
      onValidate();
    }
  }, [checking]);

  /**************
   ** RENDER **
   **************/
  return (
    <View style={cStyles.py16}>
      <View style={cStyles.flex1}>
        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <CText
            styles={'textMeta fontMedium pl16'}
            label={'add_approved_assets:assets'}
          />
          {!isDetail && form.assets.data.length === 0 && (
            <TouchableOpacity
              style={[
                cStyles.itemsEnd,
                cStyles.pt10,
                cStyles.pr16,
                styles.con_left,
              ]}
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <CText
                customStyles={[
                  cStyles.textMeta,
                  cStyles.textUnderline,
                  cStyles.pl6,
                  {color: customColors.text},
                ]}
                label={'add_approved_assets:add_assets'}
              />
            </TouchableOpacity>
          )}
        </View>
        {form.assets.data.length > 0 && (
          <ScrollView
          horizontal
          contentContainerStyle={cStyles.px16}
          keyboardShouldPersistTaps={'handled'}>
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: error.status ? customColors.red : colors.TABLE_LINE,
            }}
            style={cStyles.mt6}>
            <Row
              style={[
                styles.table_header,
                {backgroundColor: customColors.card},
              ]}
              textStyle={[
                cStyles.textMeta,
                cStyles.m3,
                cStyles.textCenter,
                cStyles.fontMedium,
                {color: customColors.text},
              ]}
              widthArr={
                isDetail ? [180, 70, 100, 100] : [180, 70, 100, 100, 42]
              }
              data={form.assets.header}
            />
            {form.assets.data.map((rowData, rowIndex) => {
                return (
                  <TableWrapper
                    key={rowIndex.toString()}
                    style={[cStyles.flex1, cStyles.row, {borderRadius: 5}]}>
                    {rowData.map((cellData, cellIndex) => {
                      let disabled = loading || cellIndex === 3 || isDetail;
                      return (
                        <Cell
                          key={cellIndex.toString()}
                          width={
                            cellIndex === 0
                              ? 180
                              : cellIndex === 1
                              ? 70
                              : cellIndex === 4
                              ? 42
                              : 100
                          }
                          // height={40}
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
                      );
                    })}
                  </TableWrapper>
                )
            })}
          </Table>
        </ScrollView>
        )}

        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.justifyBetween,
            cStyles.itemsCenter,
            cStyles.pt6,
          ]}>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.pl16,
              styles.con_right,
            ]}>
            {error.status && (
              <Icon
                name={'alert-circle'}
                size={scalePx(2)}
                color={customColors.red}
              />
            )}
            {error.status && (
              <CText
                styles={'textMeta fontRegular pl6'}
                customStyles={{
                  color: customColors.red,
                }}
                label={t(error.helper)}
              />
            )}
          </View>

          {!isDetail && form.assets.data.length > 0 && (
            <TouchableOpacity
              style={[
                cStyles.itemsEnd,
                cStyles.pt10,
                cStyles.pr16,
                styles.con_left,
              ]}
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <CText
                customStyles={[
                  cStyles.textMeta,
                  cStyles.textUnderline,
                  cStyles.pl6,
                  {color: customColors.text},
                ]}
                label={'add_approved_assets:add_assets'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {borderWidth: 1, borderColor: colors.TABLE_LINE},
  table_header: {height: 30, backgroundColor: colors.TABLE_HEADER},
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
});

export default AssetsTable;
