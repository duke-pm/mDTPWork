/**
 ** Name: CTouchable
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CTouchable.js
 **/
import React from 'react';
import {View, TouchableNativeFeedback, TouchableOpacity} from 'react-native';
/* COMMON */
import {IS_IOS} from '~/utils/helper';
import {cStyles} from '~/utils/style';
const Touchable = IS_IOS ? TouchableOpacity : TouchableNativeFeedback;

function CTouchable({
  key = 'dtp-education',
  containerStyle = {},
  disabled = false,
  activeOpacity = 0.5,
  children = null,
  onPress = () => null,
}) {
  /************
   ** RENDER **
   ************/
  return (
    <View
      key={key}
      style={[cStyles.rounded1, cStyles.ofHidden, containerStyle]}>
      <Touchable
        disabled={disabled}
        activeOpacity={activeOpacity}
        onPress={onPress}>
        {children}
      </Touchable>
    </View>
  );
}

export default CTouchable;
