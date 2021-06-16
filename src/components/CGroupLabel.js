/**
 ** Name: CGroupLabel
 ** Author:
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
  const {containerStyle, label} = props;
  return (
    <View
      style={[
        cStyles.px16,
        cStyles.pt24,
        cStyles.pb10,
        cStyles.justifyEnd,
        styles.row_header,
        containerStyle,
      ]}>
      <CText styles={'textMeta'} customLabel={label.toUpperCase()} />
    </View>
  );
}

const styles = StyleSheet.create({
  row_header: {height: 50, zIndex: 1},
});

export default CGroupLabel;
