/* eslint-disable no-extend-native */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/**
 ** Name: Asset Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of AssetItem.js
 **/
import React from 'react';
import {View, TextInput} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
/** COMPONENTS */
import CIconButton from '~/components/CIconButton';
/* COMMON */
import {scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

Number.prototype.format = function (n, x) {
  if (n == 0) {
    return '';
  }
  let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function AssetItem(props) {
  const {rowIndex, cellIndex, onChangeCellItem, onRemoveRow} = props;

  if (cellIndex === 4 && rowIndex === 0) {
    return <View />;
  }

  if (cellIndex === 4 && rowIndex !== 0) {
    return (
      <CIconButton
        iconName={'x-circle'}
        iconColor={colors.RED}
        iconProps={{
          size: scalePx(3),
        }}
        onPress={() => onRemoveRow(rowIndex)}
      />
    );
  }

  if (cellIndex === 2 || cellIndex === 3) {
    return (
      <CurrencyInput
        style={[
          cStyles.flexWrap,
          cStyles.p4,
          cStyles.textRight,
          cStyles.fontMedium,
          styleText,
          {color: colors.TEXT_BASE},
        ]}
        value={props.cellData}
        selectionColor={colors.PRIMARY}
        editable={!props.disabled}
        onChangeValue={value => onChangeCellItem(value, rowIndex, cellIndex)}
        // prefix="đ"
        delimiter={','}
        separator={'.'}
        precision={0}
      />
    );
  }

  let styleText =
    cellIndex === 0
      ? cStyles.textLeft
      : cellIndex === 1
      ? cStyles.textCenter
      : cStyles.textRight;
  return (
    <TextInput
      style={[
        cStyles.flexWrap,
        cStyles.p4,
        cStyles.fontMedium,
        cStyles.textRight,
        styleText,
        {color: colors.TEXT_BASE},
      ]}
      keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
      selectionColor={colors.PRIMARY}
      multiline
      editable={!props.disabled}
      value={
        typeof props.cellData === 'number'
          ? props.cellData + ''
          : props.cellData
      }
      onChangeText={value => onChangeCellItem(value, rowIndex, cellIndex)}
    />
  );
}

export default AssetItem;
