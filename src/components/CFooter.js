/**
 ** Name: CFooter
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
/** COMMON */
import { cStyles } from '~/utils/style';

function CFooter(props) {

  return (
    <View style={[
      cStyles.py6,
      isIphoneX() && cStyles.pb24,
      styles.con
    ]}>
      {props.content}
    </View>
  )
};

const styles = StyleSheet.create({
  con: {
    width: '100%',
  }
});

export default CFooter;
