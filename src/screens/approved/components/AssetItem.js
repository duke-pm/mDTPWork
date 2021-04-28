/**
 ** Name: Asset Item
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of AssetItem.js
 **/
import React from 'react';
import { View, TextInput } from 'react-native';
/* COMMON */
import { colors, cStyles } from '~/utils/style';

function AssetItem(props) {
  const {
    rowIndex,
    cellIndex,
    onChangeRow
  } = props;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  return (
    <View style={cStyles.flex1}>
      <TextInput
        style={[
          cStyles.textDefault,
          cStyles.flexWrap,
          cStyles.p4,
          cellIndex === 0 ? cStyles.textLeft : cStyles.textCenter,
          { color: colors.BLACK }
        ]}
        keyboardType={cellIndex !== 0 ? 'number-pad' : 'default'}
        selectionColor={colors.BLACK}
        multiline
        editable={!props.disabled}
        value={typeof props.cellData === 'string'
          ? props.cellData
          : (cellIndex === 2 || cellIndex === 3)
            ? formatter.format(props.cellData)
            : JSON.stringify(props.cellData)}
        onChangeText={(value) => onChangeRow(value, rowIndex, cellIndex)}
      />
    </View>
  );
};

export default AssetItem;
