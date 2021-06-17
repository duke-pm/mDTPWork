/**
 ** Name: CIconButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconButton.js
 **/
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/** COMMON */
import {scalePx} from '~/utils/helper';
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

  /** RENDER */
  return (
    <TouchableOpacity
      style={[cStyles.rounded10, cStyles.center, styles.container, style]}
      disabled={disabled}
      onPress={onPress}>
      <Icon
        style={cStyles.p4}
        name={iconName}
        color={iconColor}
        size={scalePx(3)}
        {...iconProps}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {height: 40, width: 40},
});

export default CIconButton;
