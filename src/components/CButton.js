/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CButton
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import React, {useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {usePrevious} from '~/utils/hook';
import {scalePx} from '~/utils/helper';

const MyIndicator = Animated.createAnimatedComponent(ActivityIndicator);

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
  const loadingPrev = usePrevious(loading);

  const opacityIndicator = useRef(new Animated.Value(0)).current;

  const onAnimIndicator = opacity => {
    Animated.timing(opacityIndicator, {
      toValue: opacity,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  /** LIFE CYCLE */
  useEffect(() => {
    if (loadingPrev !== loading) {
      if (loading) {
        onAnimIndicator(1);
      } else {
        onAnimIndicator(0);
      }
    }
  }, [loading, loadingPrev, opacityIndicator]);

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
            backgroundColor:isDark ? 'transparnet' : colors.WHITE,
          },
          variant === 'text' && {
            backgroundColor: 'transparent',
          },
          (disabled || loading) &&
            variant === 'contained' &&
            styles.disabled_contained,
          (disabled || loading) &&
            variant === 'outlined' &&
            styles.disabled_outlined,
          style,
        ]}>
        <MyIndicator
          style={{
            width: 0,
            opacity: opacityIndicator,
            transform: [
              {
                translateX: opacityIndicator.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          }}
          color={colors.WHITE}
          size={'small'}
        />

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
});

export default CButton;
