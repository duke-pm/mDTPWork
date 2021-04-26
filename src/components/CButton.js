/**
 ** Name: CButton
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import { colors, cStyles } from '~/utils/style';
import { usePrevious } from '~/utils/hook';

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
    color = colors.PRIMARY,
    onPress = () => { },
  } = props;
  const { t } = useTranslation();
  const loadingPrev = usePrevious(loading);

  const opacityIndicator = useRef(new Animated.Value(0)).current;

  const onAnimIndicator = (opacity) => {
    Animated.timing(
      opacityIndicator,
      {
        toValue: opacity,
        duration: 80,
        useNativeDriver: true,
      }
    ).start();
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
  }, [
    loading,
    loadingPrev,
    opacityIndicator,
  ]);

  /** RENDER */
  let customStylesButton = (disabled || loading)
    ? { color: colors.GRAY_500 }
    : (variant === 'contained')
      ? { color: colors.WHITE }
      : (variant === 'outlined' || variant === 'text')
        ? { color }
        : {};

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={[
        cStyles.row,
        cStyles.center,
        cStyles.rounded1,
        cStyles.my6,
        cStyles.px16,
        styles.con_button,
        { backgroundColor: color },
        fullWidth && styles.full_width,
        block && styles.block,
        variant === 'outlined' && {
          borderColor: color,
          borderWidth: 1,
          backgroundColor: 'transparent',
        },
        variant === 'text' && {
          backgroundColor: 'transparent',
        },
        ((disabled || loading) && variant === 'contained') && styles.disabled_contained,
        ((disabled || loading) && variant === 'outlined') && styles.disabled_outlined,
        style,
      ]}>
        <MyIndicator
          style={{
            width: 0,
            opacity: opacityIndicator,
            transform: [{
              translateX: opacityIndicator.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              }),
            }],
          }}
          color={colors.GRAY_700}
          size={'small'}
        />

        <CText
          styles={'textButton'}
          customStyles={[
            { color: colors.WHITE },
            customStylesButton
          ]}
          label={t(label)}
        />
      </View>
    </TouchableOpacity>
  );
};

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
    backgroundColor: colors.GRAY_100,
  },
  disabled_outlined: {
    borderColor: colors.GRAY_500,
    borderWidth: 1,
  },
  disabled_text: {

  },
});

export default CButton;
