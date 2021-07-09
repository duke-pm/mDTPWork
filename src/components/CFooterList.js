/**
 ** Name: CFooterList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
import CActivityIndicator from './CActivityIndicator';
/* COMMON */
import {cStyles} from '~/utils/style';

function CFooterList(props) {
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <CActivityIndicator />
      <CText styles={'textMeta pt10 textCenter'} label={'common:loading'} />
    </View>
  );
}

export default CFooterList;
