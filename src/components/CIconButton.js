/**
 ** Name: CIconButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconButton.js
 **/
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CTouchable from './CTouchable';
/** COMMON */
import {moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

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
    <CTouchable
      containerStyle={[
        cStyles.rounded10,
        cStyles.center,
        styles.container,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Icon
        style={cStyles.p4}
        name={iconName}
        color={iconColor}
        size={moderateScale(18)}
        {...iconProps}
      />
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  container: {height: moderateScale(35), width: moderateScale(35)},
});

export default CIconButton;
