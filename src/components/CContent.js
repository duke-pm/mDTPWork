/**
 ** Name: CContent
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CContent.js
 **/
import React from 'react';
import {
  View,
  SafeAreaView
} from 'react-native';
/** COMMON */
import { colors, cStyles } from '~/utils/style';

function CContent(props) {
  const {
    style = {},
    contentStyle = {},
    padder = null
  } = props;

  let stylePadder = {};
  if (padder) stylePadder = cStyles.p16;

  return (
    <SafeAreaView style={cStyles.flex1}>
      <View style={[
        cStyles.flex1,
        stylePadder,
        contentStyle
      ]}>
        {props.children}
      </View>
    </SafeAreaView>
  )
};

export default CContent;
