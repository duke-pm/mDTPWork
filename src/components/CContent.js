/**
 ** Name: CContent
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContent.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {ScrollView, RefreshControl} from 'react-native';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function CContent(props) {
  const {customColors} = useTheme();
  const {contentStyle = {}, padder = null} = props;

  let stylePadder = {};
  if (padder) {
    stylePadder = cStyles.p16;
  }

  /**************
   ** RENDER **
   **************/
  return (
    <ScrollView
      style={[stylePadder, {backgroundColor: customColors.background}]}
      contentContainerStyle={[IS_IOS && cStyles.pb32, contentStyle]}
      contentInsetAdjustmentBehavior={'automatic'}
      scrollToOverflowEnabled
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
