/**
 ** Name: CFooter
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import React from 'react';
import { StyleSheet, View } from 'react-native';
/** COMMON */
import { colors, cStyles } from '~/utils/style';

function CFooter(props) {
  const {
    content
  } = props;

  return (
    <View style={styles.con}>
      {content}
    </View>
  )
};

const styles = StyleSheet.create({
  con: {
    height: cStyles.isIphoneX ? 86 : 50,
    width: '100%',
  }
});

export default CFooter;
