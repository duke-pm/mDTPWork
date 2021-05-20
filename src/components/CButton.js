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
  const {t} = useTranslation();
  const isDark = useColorScheme() === 'dark';

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
          cStyles.my6,
          cStyles.px16,
          styles.con_button,
          {backgroundColor: color},
          fullWidth && styles.full_width,
          block && styles.block,
          variant === 'outlined' && {
            borderColor: color,
            borderWidth: 1,
            backgroundColor: isDark ? colors.TRANSPARENT : colors.WHITE,
          },
          variant === 'text' && styles.con_variant_text,
          (disabled || loading) &&
            variant === 'contained' &&
            styles.disabled_contained,
          (disabled || loading) &&
            variant === 'outlined' &&
            styles.disabled_outlined,
          style,
        ]}>
        {icon && (
          <Icon
            style={cStyles.pr6}
            name={icon}
            color={colors.WHITE}
            size={scalePx(3)}
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
  con_button: {
    height: 40,
  },
  full_width: {
    width: cStyles.deviceWidth,
  },
  block: {
    width: '100%',
  },
  disabled_contained: {
    backgroundColor: colors.GRAY_500,
  },
  disabled_outlined: {
    borderColor: colors.GRAY_500,
    borderWidth: 1,
  },
  disabled_text: {
    color: 'black',
  },
  con_variant_text: {
    backgroundColor: colors.TRANSPARENT,
  },
});

export default CButton;
