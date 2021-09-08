/**
 ** Name: CActivityIndicator
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActivityIndicator.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {ActivityIndicator} from 'react-native';
/* COMMON */
import {colors} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CActivityIndicator(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {color = undefined} = props;

  /************
   ** RENDER **
   ************/
  return (
    <ActivityIndicator
      size={'small'}
      color={color || isDark ? colors.GRAY_300 : colors.GRAY_800}
      {...props}
    />
  );
}

CActivityIndicator.propTypes = {
  color: PropTypes.any,
};

export default React.memo(CActivityIndicator);
