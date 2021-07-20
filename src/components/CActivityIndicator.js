/**
 ** Name: CActivityIndicator
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActivityIndicator.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {ActivityIndicator} from 'react-native';
/* COMMON */
import {colors} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CActivityIndicator(props) {
  const isDark = useColorScheme() === THEME_DARK;

  /************
   ** RENDER **
   ************/
  return (
    <ActivityIndicator
      size={'small'}
      color={isDark ? colors.GRAY_900 : colors.GRAY_300}
      {...props}
    />
  );
}

export default CActivityIndicator;
