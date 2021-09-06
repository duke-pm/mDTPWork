/**
 ** Name: CIconButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconButton.js
 **/
import PropTypes from 'prop-types';
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
    style = {},
    iconName = '',
    iconColor = colors.ICON_BASE,
    iconProps = {},
    disabled = false,
    onPress = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <CTouchable
      containerStyle={[
        cStyles.rounded5,
        cStyles.center,
        styles.container,
        style,
      ]}
      style={cStyles.rounded5}
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

CIconButton.propTypes = {
  style: PropTypes.object,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconProps: PropTypes.object,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
};

export default CIconButton;
