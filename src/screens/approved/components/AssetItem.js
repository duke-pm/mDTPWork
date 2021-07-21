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
import {moderateScale} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import Icons from '~/config/icons';

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

  if (cellIndex === 0) {
    return (
      <CIconButton
        iconName={Icons.close}
        iconColor={customColors.red}
        iconProps={{size: moderateScale(21)}}
        onPress={() => onRemoveRow(rowIndex)}
      />
    );
  }
  if (cellIndex === 3 || cellIndex === 4) {
    return (
      <CurrencyInput
        style={[
          cStyles.p4,
          cStyles.flexWrap,
          cStyles.textRight,
          cStyles.textBody,
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
    cellIndex === 1
      ? cStyles.textLeft
      : cellIndex === 2 || cellIndex === 0
      ? cStyles.textCenter
      : cStyles.textRight;
  return (
    <TextInput
      style={[
        cStyles.p4,
        cStyles.flexWrap,
        cStyles.textBody,
        styleText,
        {color: customColors.text},
      ]}
      keyboardType={cellIndex !== 1 ? 'number-pad' : 'default'}
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
