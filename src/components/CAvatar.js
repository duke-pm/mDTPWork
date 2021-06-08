/**
 ** Name: CAvatar
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import React, {useState} from 'react';
import {StyleSheet, View, Animated, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
/* COMMON */
import {Assets} from '~/utils/asset';
import {IS_ANDROID, scalePx, sW} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CAvatar(props) {
  const {
    containerStyle = {},
    imageStyle = {},
    size = 'small', // very small | small | medium | large
    source = null,
    isEdit = false,
    customColors = {},
  } = props;

  /** Use state */
  const [anim, setAnim] = useState(new Animated.Value(1));
  const [src, setSrc] = useState(source);

  /** FUNC */
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

  /** RENDER */
  return (
    <View
      style={[
        cStyles.p2,
        cStyles.rounded10,
        cStyles.center,
        cStyles.shadow1,
        styles.container,
        size === 'vsmall' && styles.container_vsmall,
        size === 'small' && styles.container_small,
        size === 'medium' && styles.container_medium,
        size === 'large' && styles.container_large,
        containerStyle,
        {backgroundColor: customColors.card},
      ]}>
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
            cStyles.center,
            cStyles.rounded10,
            styles.container_icon_camera,
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
  container: {backgroundColor: colors.WHITE},
  container_vsmall: {
    height: sW('6%'),
    width: sW('6%'),
  },
  container_small: {
    height: sW('9%'),
    width: sW('9%'),
  },
  container_medium: {
    height: sW('17%'),
    width: sW('17%'),
  },
  container_large: {
    height: sW('24%'),
    width: sW('24%'),
  },

  image_vsmall: {
    height: sW('5%'),
    width: sW('5%'),
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

  container_icon_camera: {
    bottom: 0,
    right: 0,
    backgroundColor: colors.WHITE,
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
