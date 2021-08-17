/**
 ** Name: CTouchable
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CTouchable.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View, TouchableNativeFeedback, TouchableHighlight} from 'react-native';
/* COMMON */
import {IS_IOS} from '~/utils/helper';
import {cStyles} from '~/utils/style';

const Touchable = IS_IOS ? TouchableHighlight : TouchableNativeFeedback;

function CTouchable({
  key = 'dtp-education',
  containerStyle = {},
  style = {},
  disabled = false,
  activeOpacity = 0.8,
  children = null,
  onPress = () => null,
}) {
  const {customColors} = useTheme();
  /************
   ** RENDER **
   ************/
  return (
    <View
      key={key}
      style={[cStyles.rounded1, cStyles.ofHidden, containerStyle]}>
      <Touchable
        style={style}
        disabled={disabled}
        underlayColor={customColors.cardDisable}
        activeOpacity={activeOpacity}
        onPress={onPress}>
        {children}
      </Touchable>
    </View>
  );
}

export default CTouchable;
