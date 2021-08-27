/**
 ** Name: CTouchable
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CTouchable.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View, TouchableNativeFeedback, TouchableHighlight} from 'react-native';
/* COMMON */
import {IS_IOS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

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
        underlayColor={colors.BG_TOUCHABLE}
        activeOpacity={activeOpacity}
        onPress={onPress}>
        {children}
      </Touchable>
    </View>
  );
}

CTouchable.propTypes = {
  key: PropTypes.string,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  activeOpacity: PropTypes.number,
  children: PropTypes.element,
  onPress: PropTypes.func,
};

export default CTouchable;
