/* eslint-disable no-extend-native */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/**
 ** Name: Asset Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AssetItem.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Keyboard, TextInput} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
/** COMPONENTS */
import CIconButton from '~/components/CIconButton';
/* COMMON */
import {fS} from '~/utils/helper';
import {cStyles} from '~/utils/style';

Number.prototype.format = function (n, x) {
  if (n == 0) {
    return '';
  }
  let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function AssetItem(props) {
  const {customColors} = useTheme();
  const {rowIndex, cellIndex, onChangeCellItem, onRemoveRow} = props;

  if (cellIndex === 4) {
    return (
      <CIconButton
        iconName={'x-circle'}
        iconColor={customColors.red}
        iconProps={{
          size: fS(20),
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
          {color: customColors.text},
        ]}
        value={props.cellData}
        selectionColor={customColors.text}
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
        cStyles.textRight,
        cStyles.textDefault,
        styleText,
        {color: customColors.text},
      ]}
      keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
      returnKeyType={'done'}
      selectionColor={customColors.text}
      multiline
      editable={!props.disabled}
      value={
        typeof props.cellData === 'number'
          ? props.cellData + ''
          : props.cellData
      }
      onSubmitEditing={Keyboard.dismiss}
      onChangeText={value => onChangeCellItem(value, rowIndex, cellIndex)}
    />
  );
}

export default AssetItem;
