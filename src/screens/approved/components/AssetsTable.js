/* eslint-disable react-hooks/exhaustive-deps */
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
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import AssetItem from './AssetItem';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID, verticalScale, IS_IOS} from '~/utils/helper';
import Icons from '~/config/Icons';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const heightItemTable = IS_ANDROID ? verticalScale(38) : verticalScale(30);
export const widthItemTable = [
  moderateScale(35),
  moderateScale(180),
  moderateScale(80),
  moderateScale(120),
  moderateScale(120),
];

function AssetsTable(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {
    loading = false,
    checking = false,
    isDetail = false,
    assets = {
      width: widthItemTable,
      header: ['', '', '', '', ''],
      data: [],
    },
    onCallbackValidate = () => {},
  } = props;

  /** Use state */
  const [form, setForm] = useState({
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
    newData.push([null, '', '', '', '']);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    if (newData[rowIndex][2] !== '') {
      if (newData[rowIndex][3] !== '') {
        newData[rowIndex][4] = JSON.stringify(
          Number(newData[rowIndex][2]) * Number(newData[rowIndex][3]),
        );
      } else {
        newData[rowIndex][4] = '';
      }
    } else {
      newData[rowIndex][4] = '';
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        if (item[1].trim() === '') {
          tmpError.status = true;
          tmpError.helper = 'error:not_enough_assets';
        } else {
          if (item[2] === '' || (item[2] !== '' && Number(item[2]) < 1)) {
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
    <View>
      <View style={cStyles.flex1}>
        <View style={cStyles.itemsCenter}>
          {!isDetail && form.assets.data.length === 0 && (
            <TouchableOpacity
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.pr16,
                  styles.con_left,
                ]}>
                <Icon
                  name={Icons.addNew}
                  color={customColors.orange}
                  size={moderateScale(18)}
                />
                <CText
                  customStyles={[
                    cStyles.textUnderline,
                    cStyles.textCaption1,
                    cStyles.pl4,
                    {color: customColors.orange},
                  ]}
                  label={'add_approved_assets:add_assets'}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {form.assets.data.length > 0 && (
          <ScrollView horizontal keyboardShouldPersistTaps={'handled'}>
            <Table
              borderStyle={{
                borderWidth: moderateScale(0.7),
                borderColor: error.status
                  ? customColors.red
                  : customColors.cardDisable,
              }}
              style={cStyles.mt6}>
              <Row
                style={styles.table_header}
                textStyle={[
                  cStyles.textCenter,
                  cStyles.textCaption1,
                  {color: customColors.text},
                ]}
                widthArr={form.assets.width}
                data={form.assets.header}
              />
              {form.assets.data.map((rowData, rowIndex) => {
                return (
                  <TableWrapper
                    key={rowIndex.toString()}
                    style={[cStyles.flex1, cStyles.row]}>
                    {rowData.map((cellData, cellIndex) => {
                      let disabled = loading || cellIndex === 4 || isDetail;
                      return (
                        <Cell
                          key={cellIndex.toString()}
                          width={form.assets.width[cellIndex]}
                          height={heightItemTable}
                          data={
                            <AssetItem
                              isDetail={isDetail}
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
                size={moderateScale(18)}
                color={customColors.red}
              />
            )}
            {error.status && (
              <CText
                customStyles={[
                  cStyles.textCaption1,
                  cStyles.pl4,
                  {color: customColors.red},
                ]}
                label={t(error.helper)}
              />
            )}
          </View>

          {!isDetail && form.assets.data.length > 0 && (
            <TouchableOpacity
              disabled={loading || isDetail}
              onPress={handleAddAssets}>
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.mt10,
                  styles.con_left,
                ]}>
                <Icon
                  name={Icons.addNew}
                  color={customColors.orange}
                  size={moderateScale(18)}
                />
                <CText
                  customStyles={[
                    cStyles.textUnderline,
                    cStyles.textCaption1,
                    cStyles.pl4,
                    {color: customColors.orange},
                  ]}
                  label={'add_approved_assets:add_assets'}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {borderWidth: 1, borderColor: colors.TABLE_LINE},
  table_header: {
    height: heightItemTable,
    backgroundColor: colors.TABLE_HEADER,
  },
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
});

export default AssetsTable;
