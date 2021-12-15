/**
 ** Name: CFooter
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CFooter(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.py6,
        cStyles.bottom0,
        cStyles.isIphoneX() && cStyles.pb24,
        cStyles.fullWidth,
        {
          backgroundColor: customColors.background,
        },
      ]}>
      {isDark && IS_IOS && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={colors.BLACK}
        />
      )}
      {props.content}
    </View>
  );
}

CFooter.propTypes = {
  content: PropTypes.element,
};

export default React.memo(CFooter);
