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
import { cStyles } from '~/utils/style';

function CContent(props) {
  const {
    style = {},
    contentStyle = {},
    padder = null
  } = props;

  let stylePadder = {};
  if (padder) stylePadder = cStyles.p16;

  if (IS_ANDROID) {
    return (
      <ScrollView
        style={cStyles.flex1}
        contentContainerStyle={[stylePadder, contentStyle]}
        keyboardShouldPersistTaps={'handled'}
        removeClippedSubviews={IS_ANDROID}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        <KeyboardAvoidingView style={cStyles.flex1} behavior={undefined}>
          {props.children}
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={cStyles.flex1}
      behavior={'padding'}
    >
      <ScrollView
        style={cStyles.flex1}
        contentContainerStyle={[stylePadder, contentStyle]}
        keyboardShouldPersistTaps={'handled'}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {props.children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
};

export default CContent;
