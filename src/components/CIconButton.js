/**
 ** Name:
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/** COMMON */
import {scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CIconButton(props) {
  const {
    style,
    iconName = '',
    iconColor = colors.ICON_BASE,
    iconProps = {},
    onPress = () => {},
  } = props;

  return (
    <TouchableOpacity
      style={[cStyles.rounded10, cStyles.center, styles.con, style]}
      activeOpacity={0.5}
      onPress={onPress}>
      <Icon
        style={cStyles.p4}
        name={iconName}
        color={iconColor}
        size={scalePx(3.5)}
        {...iconProps}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  con: {
    height: 40,
    width: 40,
  },
});

export default CIconButton;
