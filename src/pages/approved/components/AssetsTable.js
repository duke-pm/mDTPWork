/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Table of assets
** Author: DTP-Education
** CreateAt: 2021
** Description: Description of AssetsTable.js
**/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  ScrollView,
  View,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import AssetItem from './AssetItem';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID, verticalScale} from '~/utils/helper';
import { useTheme, Button, Icon } from '@ui-kitten/components';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const HEIGHT_ITEM_TABLE = IS_ANDROID ? verticalScale(38) : verticalScale(30);
export const WIDTH_ITEM_TABLE = [
  moderateScale(35),
  moderateScale(220),
  moderateScale(80),
  moderateScale(120),
  moderateScale(120),
];

const RenderAddIcon = props => (
  <Icon {...props} name="plus-circle-outline" />
);

function AssetsTable(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    style = {},
    loading = false,
    checking = false,
    isDetail = false,
    assets = {
      width: WIDTH_ITEM_TABLE,
      header: ['', '', '', '', ''],
      data: [],
    },
    onCallbackValidate = () => {},
  } = props;

  /** Use state */
  const [form, setForm] = useState({
    assets: {
      width: WIDTH_ITEM_TABLE,
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
    setForm({...form, assets: {...form.assets, data: newData}});
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
    setForm({...form, assets: {...form.assets, data: newData}});
    if (error.status) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({status: false, helper: ''});
    }
  };

  const onRemoveRow = rowIndex => {
    let newData = [...form.assets.data];
    newData.splice(rowIndex, 1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setForm({...form, assets: {...form.assets, data: newData}});
  };

  const onValidate = () => {
    setError({status: false, helper: ''});
    let tmpError = {status: false, helper: ''},
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
    onCallbackValidate({status: tmpError.status, data: form.assets.data});
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
    <View style={[cStyles.flex1, style]}>
      <View style={cStyles.itemsCenter}>
        {!isDetail && form.assets.data.length === 0 && (
          <View style={cStyles.mt10}>
            <Button
              appearance={'ghost'}
              size="small"
              accessoryLeft={RenderAddIcon}
              onPress={handleAddAssets}>
              {propsB => (
                <CText style={cStyles.textUnderline} category="c1" status="primary">
                  {t('add_approved_assets:add_assets')}
                </CText>
              )}
            </Button>
          </View>
        )}
      </View>

      {form.assets.data.length > 0 && (
        <ScrollView horizontal keyboardShouldPersistTaps={'handled'}>
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: error.status
                ? theme['border-danger-color-1']
                : theme['border-basic-color-3'],
            }}
            style={cStyles.mt6}>
            <Row
              style={[styles.table_header, {backgroundColor: theme['background-basic-color-2']}]}
              textStyle={[
                cStyles.textCenter,
                cStyles.textCallout,
                {color: theme['text-basic-color']},
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
              style={{height: moderateScale(10), width: moderateScale(10)}}
              name={'alert-circle-outline'}
              fill={theme['color-danger-500']}
            />
          )}
          {error.status && (
            <CText style={cStyles.pl5} category='c1' status="danger">
              {t(error.helper)}
            </CText>
          )}
        </View>

        {!isDetail && form.assets.data.length > 0 && (
          <View style={cStyles.mt10}>
            <Button
              appearance={'ghost'}
              size="small"
              accessoryLeft={RenderAddIcon}
              onPress={handleAddAssets}>
              {propsB => (
                <CText style={cStyles.textUnderline} category="c1" status="primary">
                  {t('add_approved_assets:add_assets')}
                </CText>
              )}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table_header: {
    height: HEIGHT_ITEM_TABLE,
  },
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
});

AssetsTable.propTypes = {
  loading: PropTypes.bool,
  checking: PropTypes.bool,
  isDetail: PropTypes.bool,
  assets: PropTypes.object,
  onCallbackValidate: PropTypes.func,
};

export default AssetsTable;
