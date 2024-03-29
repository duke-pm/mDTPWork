/**
 ** Name: CContent
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContent.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {ScrollView, RefreshControl, SafeAreaView, View} from 'react-native';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function CContent(props) {
  const {
    containerStyle = {},
    contentStyle = {},
    padder = false,
    hasSafeArea = true,
    scrollEnabled = true,
  } = props;

  /************
   ** RENDER **
   ************/
  let stylePadder = {};
  if (padder) {
    stylePadder = cStyles.p16;
  }
  if (hasSafeArea && !scrollEnabled) {
    return <SafeAreaView style={cStyles.flex1}>{props.children}</SafeAreaView>;
  }
  if (!hasSafeArea && !scrollEnabled) {
    return <View style={cStyles.flex1}>{props.children}</View>;
  }

  return (
    <ScrollView
      style={[cStyles.flex1, containerStyle]}
      contentContainerStyle={[
        stylePadder,
        IS_IOS && cStyles.pb32,
        contentStyle,
      ]}
      contentInsetAdjustmentBehavior={'automatic'}
      keyboardShouldPersistTaps={'always'}
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

CContent.propTypes = {
  containerStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  padder: PropTypes.bool,
  hasSafeArea: PropTypes.bool,
  scrollEnabled: PropTypes.bool,
  children: PropTypes.element,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default React.memo(CContent);
