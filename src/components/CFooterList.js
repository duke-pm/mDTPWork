/**
 ** Name: CFooterList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';

function CFooterList(props) {
  /**************
   ** RENDER **
   **************/
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <ActivityIndicator size={'small'} />
      <CText styles={'textMeta pt10 textCenter'} label={'common:loading'} />
    </View>
  );
}

export default CFooterList;
