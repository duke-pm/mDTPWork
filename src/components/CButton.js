/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: CButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale, verticalScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CButton(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    style = {},
    textStyle = {},
    loading = false,
    fullWidth = false,
    block = false,
    disabled = false,
    variant = 'contained', // contained | outlined | text
    label = '',
    color = colors.SECONDARY,
    icon = null,
    onPress = () => {},
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <CTouchable disabled={disabled || loading} onPress={onPress}>
      <View
        style={[
          cStyles.row,
          cStyles.center,
          cStyles.rounded1,
          styles.container,
          fullWidth && cStyles.deviceWidth,
          block && cStyles.fullWidth,
          {backgroundColor: color},
          variant === 'text' && styles.con_variant_text,
          variant === 'outlined' && {
            borderColor: color,
            borderWidth: 0.5,
            backgroundColor: isDark ? colors.TRANSPARENT : colors.WHITE,
          },
          style,
        ]}>
        {icon && (
          <Icon
            name={icon}
            color={
              disabled || loading
                ? styles.textDisabled.color
                : variant === 'contained'
                ? colors.WHITE
                : color
            }
            size={moderateScale(16)}
          />
        )}

        <CText
          customStyles={[
            cStyles.textButton,
            cStyles.textCenter,
            cStyles.m6,
            {color: variant === 'contained' ? colors.WHITE : color},
            (disabled || loading) && styles.textDisabled,
            IS_ANDROID && {fontWeight: '500'},
            textStyle,
          ]}
          label={t(label)}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  container: {paddingVertical: verticalScale(3)},
  con_variant_text: {backgroundColor: colors.TRANSPARENT},
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
});

export default CButton;
