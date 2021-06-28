/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: CAvatar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
/* COMMON */
import {Assets} from '~/utils/asset';
import {IS_ANDROID, scalePx, sW} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CAvatar(props) {
  const {customColors} = useTheme();
  const {
    containerStyle = {},
    imageStyle = {},
    size = 'small', // very small | small | medium | large
    source = null,
    isEdit = false,
    label = null,
  } = props;

  /** Use state */
  const [anim, setAnim] = useState(new Animated.Value(source ? 1 : 0));
  const [src, setSrc] = useState(source);

  /************
   ** FUNC **
   ************/
  const onLoad = () => {
    let animationParams = {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    };
    Animated.timing(anim, animationParams).start();
  };

  const onError = () => {
    setAnim(1);
    setSrc(Assets.iconUserDefault);
  };

  /**************
   ** RENDER **
   **************/
  let customLabel = '';
  if (!source && label) {
    customLabel = label.split(' ');
    customLabel = customLabel[customLabel.length - 1].charAt(0).toUpperCase();
  }
  return (
    <View
      style={[
        cStyles.rounded10,
        cStyles.center,
        size === 'vsmall' && styles.image_vsmall,
        size === 'small' && styles.image_small,
        size === 'medium' && styles.image_medium,
        size === 'large' && styles.image_large,
        containerStyle,
        {backgroundColor: customColors.card},
      ]}>
      {source ? (
        <FastImage
          style={[
            cStyles.rounded10,
            size === 'vsmall' && styles.image_vsmall,
            size === 'small' && styles.image_small,
            size === 'medium' && styles.image_medium,
            size === 'large' && styles.image_large,
            imageStyle,
          ]}
          source={
            typeof src === 'string'
              ? {
                  uri: src,
                  priority: FastImage.priority.normal,
                }
              : src
          }
          resizeMode={FastImage.resizeMode.contain}
          cache={FastImage.cacheControl.immutable}
          onLoad={onLoad}
          onError={onError}
        />
      ) : (
        <View
          style={[
            cStyles.rounded10,
            cStyles.flexCenter,
            size === 'vsmall' && styles.image_vsmall,
            size === 'small' && styles.image_small,
            size === 'medium' && styles.image_medium,
            size === 'large' && styles.image_large,
            imageStyle,
            {backgroundColor: colors.GRAY_300},
          ]}>
          <Text
            style={[
              cStyles.fontMedium,
              cStyles.textCenter,
              {
                fontSize:
                  size === 'vsmall'
                    ? 9
                    : size === 'small'
                    ? 15
                    : size === 'medium'
                    ? 30
                    : 40,
                color: customColors.text,
              },
            ]}>
            {customLabel}
          </Text>
        </View>
      )}

      <Animated.View
        style={[
          cStyles.flexCenter,
          cStyles.abs,
          cStyles.inset0,
          styles.con_loading,
          {opacity: anim},
        ]}>
        <ActivityIndicator
          color={colors.GRAY_500}
          size={
            IS_ANDROID
              ? size === 'small'
                ? 10
                : size === 'medium'
                ? 15
                : 20
              : 'small'
          }
        />
      </Animated.View>

      {isEdit && (
        <View
          style={[
            cStyles.abs,
            cStyles.bottom0,
            cStyles.right0,
            cStyles.center,
            cStyles.rounded10,
            size === 'vsmall' && styles.icon_camera_vsmall,
            size === 'small' && styles.icon_camera_small,
            size === 'medium' && styles.icon_camera_medium,
            size === 'large' && styles.icon_camera_large,
            {backgroundColor: customColors.card},
          ]}>
          <Icon
            name={'camera'}
            color={customColors.text}
            size={scalePx(
              size === 'small' ? 1.6 : size === 'medium' ? 2.3 : 2.8,
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image_vsmall: {
    height: sW('4.5%'),
    width: sW('4.5%'),
  },
  image_small: {
    height: sW('8%'),
    width: sW('8%'),
  },
  image_medium: {
    height: sW('15.5%'),
    width: sW('15.5%'),
  },
  image_large: {
    height: sW('22%'),
    width: sW('22%'),
  },

  icon_camera_vsmall: {
    height: sW('2%'),
    width: sW('2%'),
  },
  icon_camera_small: {
    height: sW('2.8%'),
    width: sW('2.8%'),
  },
  icon_camera_medium: {
    height: sW('6%'),
    width: sW('6%'),
  },
  icon_camera_large: {
    height: sW('7.5%'),
    width: sW('7.5%'),
  },
  con_loading: {backgroundColor: 'transparent'},
});

export default CAvatar;
