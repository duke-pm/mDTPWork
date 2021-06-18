/**
 ** Name: CContent
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContent.js
 **/
import React from 'react';
import {View, SafeAreaView, ScrollView} from 'react-native';
/** COMPONENT */
import CAvoidKeyboard from './CAvoidKeyboard';
/** COMMON */
import {cStyles} from '~/utils/style';

function CContent(props) {
  const {contentStyle = {}, padder = null, scroll = false} = props;

  let stylePadder = {};
  if (padder) {
    stylePadder = cStyles.p16;
  }

  /**************
   ** RENDER **
   **************/
  const ScrollComponent = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={cStyles.flex1}>
      <CAvoidKeyboard>
        <ScrollComponent
          style={[cStyles.flex1, stylePadder, contentStyle]}
          keyboardShouldPersistTaps={'handled'}>
          {props.children}
        </ScrollComponent>
      </CAvoidKeyboard>
    </SafeAreaView>
  );
}

export default CContent;
