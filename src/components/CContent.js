/**
* https://github.com/facebook/react-native
*
* @format
* @flow strict-local
*/
import React from 'react';
import { Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { IS_ANDROID, IS_IOS } from '~/utils/helper';
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
    <ScrollView
      style={[cStyles.flex1, { backgroundColor: colors.BACKGROUND_MAIN }, style]}
      contentContainerStyle={[stylePadder, contentStyle]}
      keyboardShouldPersistTaps={'handled'}
      removeClippedSubviews={false}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {props.children}
    </ScrollView>
  )
};

export default CContent;
