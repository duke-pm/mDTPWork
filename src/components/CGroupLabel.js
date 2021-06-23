/**
 ** Name: CGroupLabel
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupLabel.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';

function CGroupLabel(props) {
  const {containerStyle, labelLeft, labelRight} = props;
  return (
    <View
      style={[
        cStyles.px16,
        cStyles.row,
        cStyles.itemsEnd,
        cStyles.justifyBetween,
        styles.row_header,
        containerStyle,
      ]}>
      {labelLeft && (
        <CText styles={'textMeta'} customLabel={labelLeft.toUpperCase()} />
      )}
      {labelRight && <CText styles={'textMeta'} customLabel={labelRight} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row_header: {height: 50, zIndex: 1},
});

export default CGroupLabel;
