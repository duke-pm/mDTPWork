/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: CButton
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';

function CButton(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === 'dark';
  const {
    style = {},
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

  /** RENDER */
  let customStylesButton =
    disabled || loading
      ? {color: colors.GRAY_500}
      : variant === 'contained'
      ? {color: colors.WHITE}
      : variant === 'outlined' || variant === 'text'
      ? {color}
      : {};

  return (
    <TouchableOpacity disabled={disabled || loading} onPress={onPress}>
      <View
        style={[
          cStyles.row,
          cStyles.center,
          cStyles.rounded1,
          cStyles.py6,
          cStyles.px16,
          styles.container,
          {backgroundColor: color},
          fullWidth && styles.full_width,
          block && cStyles.fullWidth,
          variant === 'outlined' && {
            borderColor: color,
            borderWidth: 0.5,
            backgroundColor: isDark ? colors.TRANSPARENT : colors.WHITE,
          },
          variant === 'text' && styles.con_variant_text,
          (disabled || loading) &&
            variant === 'contained' &&
            styles.disabled_contained,
          (disabled || loading) && variant === 'outlined' && cStyles.borderAll,
          style,
        ]}>
        {icon && (
          <Icon
            style={cStyles.pr10}
            name={icon}
            color={colors.WHITE}
            size={scalePx(2.3)}
          />
        )}

        <CText
          styles={'textButton'}
          customStyles={[
            {color: colors.WHITE},
            customStylesButton,
            (disabled || loading) && styles.disabled_text,
          ]}
          label={t(label)}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {height: 40},
  full_width: {width: cStyles.deviceWidth},
  disabled_contained: {backgroundColor: colors.GRAY_500},
  disabled_text: {color: colors.BLACK},
  con_variant_text: {backgroundColor: colors.TRANSPARENT},
});

export default CButton;
