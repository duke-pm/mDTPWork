/**
 ** Name: CIconButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconButton.js
 **/
import React from 'react';
import {StyleSheet, TouchableOpacity, TouchableNativeFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMMON */
import {IS_IOS, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

const Touchable = IS_IOS ? TouchableOpacity : TouchableNativeFeedback;

function CIconButton(props) {
  const {
    style,
    iconName = '',
    iconColor = colors.ICON_BASE,
    iconProps = {},
    disabled = false,
    onPress = () => {},
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.ofHidden, cStyles.rounded10]}>
      <Touchable
        style={[cStyles.rounded10, cStyles.center, styles.container, style]}
        disabled={disabled}
        onPress={onPress}>
        <Icon
          style={cStyles.p4}
          name={iconName}
          color={iconColor}
          size={moderateScale(21)}
          {...iconProps}
        />
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {height: moderateScale(50), width: moderateScale(50)},
});

export default CIconButton;
