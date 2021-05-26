/**
 ** Name: CFooterList
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

function CFooterList(props) {
  /** RENDER */
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <ActivityIndicator color={colors.GRAY_500} />
      <CText styles={'textMeta pt10 textCenter'} label={'common:loading'} />
    </View>
  );
}

export default CFooterList;
