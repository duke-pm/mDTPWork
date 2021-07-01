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
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CButton(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    style = {},
    textStyle = {},
    animationIconStyle = {},
    loading = false,
    fullWidth = false,
    block = false,
    disabled = false,
    variant = 'contained', // contained | outlined | text
    label = '',
    color = colors.SECONDARY,
    icon = null,
    animationIcon = null,
    onPress = () => {},
  } = props;

  /**************
   ** RENDER **
   **************/
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <Touchable
      accessibilityRole={'button'}
      disabled={disabled || loading}
      onPress={onPress}>
      <View
        style={[
          cStyles.row,
          cStyles.center,
          cStyles.rounded1,
          cStyles.py3,
          cStyles.px16,
          fullWidth && styles.full_width,
          block && cStyles.fullWidth,
          {backgroundColor: color},
          variant === 'contained' && {elevation: 3},
          variant === 'text' && styles.con_variant_text,
          variant === 'outlined' && {
            borderColor: color,
            borderWidth: 0.5,
            backgroundColor: isDark ? colors.TRANSPARENT : colors.WHITE,
          },
          (disabled || loading) && styles.disabled_contained,
          style,
        ]}>
        {icon && !animationIcon && (
          <Icon
            name={icon}
            color={
              disabled || loading
                ? styles.textDisabled.color
                : variant === 'contained'
                ? colors.WHITE
                : color
            }
            size={fS(16)}
          />
        )}
        {loading ? (
          <ActivityIndicator style={cStyles.pr10} />
        ) : (
          !icon &&
          animationIcon && (
            <LottieView
              style={[styles.img_icon, animationIconStyle]}
              source={animationIcon}
              duration={900}
              autoPlay
              loop={false}
            />
          )
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
    </Touchable>
  );
}

const styles = StyleSheet.create({
  full_width: {width: cStyles.deviceWidth},
  disabled_contained: {
    elevation: 0,
    backgroundColor: '#dfdfdf',
  },
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd',
    },
    android: {
      color: '#a1a1a1',
    },
  }),
  con_variant_text: {backgroundColor: colors.TRANSPARENT},
  img_icon: {height: 35, width: 35},
});

export default CButton;
