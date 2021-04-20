/**
 ** Name: CFooter
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import React from 'react';
import { StyleSheet, View } from 'react-native';
/** COMMON */
import { cStyles } from '~/utils/style';

function CFooter(props) {
  const {
    content
  } = props;

  return (
    <View style={[
      cStyles.flex1,
      styles.con,
    ]}>
      {content}
    </View>
  )
};

const styles = StyleSheet.create({
  con: {
    height: cStyles.isIphoneX ? 60 : 50,
    width: '100%'
  }
});

export default CFooter;
