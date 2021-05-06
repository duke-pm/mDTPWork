/**
 ** Name: Asset Item
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of AssetItem.js
 **/
import React from 'react';
import { View, TextInput } from 'react-native';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import { colors, cStyles } from '~/utils/style';

Number.prototype.format = function (n, x) {
  if (n == 0) return '';
  let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

function AssetItem(props) {
  const {
    rowIndex,
    cellIndex,
    onChangeCellItem,
    onRemoveRow
  } = props;

  if (cellIndex === 4 && rowIndex === 0) {
    return <View />;
  }

  if (cellIndex === 4 && rowIndex !== 0) {
    return (
      <CIconButton
        iconName={'times-circle'}
        iconColor={colors.RED}
        iconProps={{
          solid: true,
          size: 17
        }}
        onPress={() => onRemoveRow(rowIndex)}
      />
    )
  }

  let styleText = cellIndex === 0
    ? cStyles.textLeft
    : cellIndex === 1
      ? cStyles.textCenter
      : cStyles.textRight;
  return (
    <TextInput
      style={[
        cStyles.textMeta,
        cStyles.flexWrap,
        cStyles.p4,
        cStyles.fontMedium,
        styleText,
        { color: colors.BLACK }
      ]}
      keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
      selectionColor={colors.BLACK}
      multiline
      editable={!props.disabled}
      value={typeof props.cellData === 'string'
        ? (cellIndex === 3) ? props.cellData == '' ? '' : Number(props.cellData).format() : props.cellData
        : (cellIndex === 3 || cellIndex === 2)
          ? props.cellData === 0 ? '' : props.cellData == '' ? '' : Number(props.cellData).format()
          : props.cellData + ''}
      onChangeText={(value) => onChangeCellItem(value, rowIndex, cellIndex)}
    />
  );
};

export default AssetItem;
