/**
 ** Name: CIcon
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIcon.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CTouchable from './CTouchable';
/* COMMON */
import {moderateScale} from '~/utils/helper';

const INITIALS = {
  minium: moderateScale(9),
  smaller: moderateScale(14),
  small: moderateScale(18),
  medium: moderateScale(21),
  large: moderateScale(23),
  larger: moderateScale(28),
};

CIcon.propTypes = {
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  name: PropTypes.string,
  size: PropTypes.oneOf([
    'minium',
    'smaller',
    'small',
    'medium',
    'large',
    'larger',
  ]),
  customSize: PropTypes.number,
  color: PropTypes.string,
  customColor: PropTypes.string,
  onPress: PropTypes.func,
};

function CIcon(props) {
  const {customColors} = useTheme();
  const {
    style = {},
    iconStyle = {},
    name = '',
    size = 'medium',
    customSize = undefined,
    color = 'icon',
    customColor = undefined,
    onPress = undefined,
  } = props;
  const Touchable = onPress ? CTouchable : View;

  /************
   ** RENDER **
   ************/
  return (
    <Touchable style={style} onPress={onPress}>
      <Icon
        style={iconStyle}
        name={name}
        size={customSize || INITIALS[size]}
        color={customColor || customColors[color]}
      />
    </Touchable>
  );
}

export default CIcon;
