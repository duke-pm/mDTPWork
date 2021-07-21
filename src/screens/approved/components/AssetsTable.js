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
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableHighlight,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import AssetItem from './AssetItem';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';
import Icons from '~/config/icons';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

  /**********
   ** FUNC **
   **********/
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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setError(tmpError);
    onCallbackValidate({
      status: tmpError.status,
      data: form.assets.data,
    });
  };

  /****************
   ** LIFE CYCLE **
   ****************/
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

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.py16}>
      <View style={cStyles.flex1}>
        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <CText
            styles={'textCaption1 fontMedium pl16'}
            label={'add_approved_assets:assets'}
          />
          {!isDetail && form.assets.data.length === 0 && (
            <TouchableHighlight
              style={[
                cStyles.itemsEnd,
                cStyles.pt10,
                cStyles.pr16,
                styles.con_left,
              ]}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <CText
                customStyles={[
                  cStyles.textCaption1,
                  cStyles.textUnderline,
                  cStyles.pl6,
                  {color: customColors.text},
                ]}
                label={'add_approved_assets:add_assets'}
              />
            </TouchableHighlight>
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
                borderColor: error.status
                  ? customColors.red
                  : customColors.cardDisable,
              }}
              style={cStyles.mt6}>
              <Row
                style={[
                  styles.table_header,
                  {backgroundColor: customColors.cardDisable},
                ]}
                textStyle={[
                  cStyles.m3,
                  cStyles.textCenter,
                  {color: customColors.text, fontSize: moderateScale(10)},
                ]}
                widthArr={[
                  moderateScale(180),
                  moderateScale(100),
                  moderateScale(100),
                  moderateScale(100),
                  isDetail ? moderateScale(42) : undefined,
                ]}
                data={form.assets.header}
              />
              {form.assets.data.map((rowData, rowIndex) => {
                return (
                  <TableWrapper
                    key={rowIndex.toString()}
                    style={[cStyles.flex1, cStyles.row]}>
                    {rowData.map((cellData, cellIndex) => {
                      let disabled = loading || cellIndex === 3 || isDetail;
                      return (
                        <Cell
                          key={cellIndex.toString()}
                          width={
                            cellIndex === 0
                              ? moderateScale(180)
                              : cellIndex === 4
                              ? moderateScale(42)
                              : moderateScale(100)
                          }
                          height={moderateScale(35)}
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
                );
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
                name={Icons.alert}
                size={moderateScale(14)}
                color={customColors.red}
              />
            )}
            {error.status && (
              <CText
                styles={'textCaption1 fontRegular pl6'}
                customStyles={{
                  color: customColors.red,
                }}
                label={t(error.helper)}
              />
            )}
          </View>

          {!isDetail && form.assets.data.length > 0 && (
            <TouchableHighlight
              style={[
                cStyles.itemsEnd,
                cStyles.pt10,
                cStyles.pr16,
                styles.con_left,
              ]}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <CText
                customStyles={[
                  cStyles.textCaption1,
                  cStyles.textUnderline,
                  cStyles.pl6,
                  {color: customColors.text},
                ]}
                label={'add_approved_assets:add_assets'}
              />
            </TouchableHighlight>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {borderWidth: 1, borderColor: colors.TABLE_LINE},
  table_header: {
    height: moderateScale(30),
    backgroundColor: colors.TABLE_HEADER,
  },
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
});

export default AssetsTable;
