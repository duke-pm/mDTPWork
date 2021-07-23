/**
 ** Name: CContent
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContent.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {ScrollView, RefreshControl, SafeAreaView} from 'react-native';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function CContent(props) {
  const {customColors} = useTheme();
  const {contentStyle = {}, padder = null, scrollEnabled = true} = props;

  /************
   ** RENDER **
   ************/
  let stylePadder = {};
  if (padder) {
    stylePadder = cStyles.p16;
  }
  if (!scrollEnabled) {
    return <SafeAreaView style={cStyles.flex1}>{props.children}</SafeAreaView>;
  }

  return (
    <ScrollView
      style={[
        cStyles.flex1,
        stylePadder,
        {backgroundColor: customColors.background},
      ]}
      contentContainerStyle={[IS_IOS && cStyles.pb32, contentStyle]}
      contentInsetAdjustmentBehavior={'automatic'}
      keyboardShouldPersistTaps={'handled'}
      scrollEventThrottle={16}
      refreshControl={
        props.onRefresh ? (
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
          />
        ) : undefined
      }
      {...props}>
      {props.children}
    </ScrollView>
  );
}

export default CContent;
