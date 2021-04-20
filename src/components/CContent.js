/**
* https://github.com/facebook/react-native
*
* @format
* @flow strict-local
*/
import React from 'react';
import { ScrollView } from 'react-native';
/** COMMON */
import { cStyles } from '~/utils/style';

function CContent(props) {
  const {
    style,
    contentStyle,
    padder
  } = props;

  let stylePadder = {};
  if (padder) stylePadder = cStyles.p12;

  return (
    <ScrollView
      style={[cStyles.flex1, style]}
      contentContainerStyle={[stylePadder, contentStyle]}
      keyboardShouldPersistTaps={'handled'}
      removeClippedSubviews={true}
      {...props}
    >
      {props.children}
    </ScrollView>
  )
};

export default CContent;
