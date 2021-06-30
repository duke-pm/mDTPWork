/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: CAvatar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import {Assets} from '~/utils/asset';
import {IS_ANDROID, askPermissionsCamera, sW, fS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CAvatar(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
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
  const [showChooseType, setShowChooseType] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChange = async () => {
    let isGranted = await askPermissionsCamera();
    if (isGranted) {
      setShowChooseType(true);
    }
  };

  /************
   ** FUNC **
   ************/
  const onChooseFromCamera = async () => {
    // Do choose from camera
  };

  const onChooseFromGallery = async () => {
    // Do choose from gallery
  };

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

  const onCloseChooseType = () => {
    setShowChooseType(false);
  };

  /**************
   ** RENDER **
   **************/
  const Touchable = isEdit ? TouchableOpacity : View;
  let customLabel = '';
  if (!source && label) {
    customLabel = label.split(' ');
    customLabel = customLabel[customLabel.length - 1].charAt(0).toUpperCase();
  }
  return (
    <>
      <Touchable
        style={[
          cStyles.rounded10,
          cStyles.center,
          size === 'vsmall' && styles.image_vsmall,
          size === 'small' && styles.image_small,
          size === 'medium' && styles.image_medium,
          size === 'large' && styles.image_large,
          containerStyle,
          {backgroundColor: customColors.card},
        ]}
        onPress={handleChange}>
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
              {backgroundColor: isDark ? colors.GRAY_800 : colors.GRAY_300},
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
              size={fS(size === 'small' ? 10 : size === 'medium' ? 14 : 18)}
            />
          </View>
        )}
      </Touchable>

      <Modal
        style={[cStyles.m0, cStyles.justifyEnd]}
        isVisible={showChooseType}
        onBackButtonPress={onCloseChooseType}
        onBackdropPress={onCloseChooseType}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        hardwareAccelerated={true}
        backdropOpacity={0.4}
        deviceWidth={cStyles.deviceWidth}
        deviceHeight={cStyles.deviceHeight}>
        <SafeAreaView>
          <View style={[cStyles.justifyEnd, cStyles.p8]}>
            <View
              style={[
                cStyles.mb8,
                cStyles.rounded2,
                {backgroundColor: customColors.card},
              ]}>
              <View
                style={[
                  cStyles.roundedTopLeft2,
                  cStyles.roundedTopRight2,
                  cStyles.fullWidth,
                  cStyles.center,
                  {height: 55, backgroundColor: customColors.card},
                ]}>
                <CText
                  customStyles={cStyles.textMeta}
                  label={'common:from_upload'}
                />
              </View>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: colors.GRAY_500,
                  width: '100%',
                }}
              />
              <TouchableOpacity
                style={[
                  cStyles.fullWidth,
                  cStyles.center,
                  {height: 55, backgroundColor: customColors.card},
                ]}
                onPress={onCloseChooseType}>
                <CText
                  customStyles={[
                    cStyles.H5,
                    cStyles.fontRegular,
                    {color: customColors.blue},
                  ]}
                  label={'common:from_camera'}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: colors.GRAY_500,
                  width: '100%',
                }}
              />
              <TouchableOpacity
                style={[
                  cStyles.roundedBottomLeft2,
                  cStyles.roundedBottomRight2,
                  cStyles.fullWidth,
                  cStyles.center,
                  {height: 55, backgroundColor: customColors.card},
                ]}
                onPress={onCloseChooseType}>
                <CText
                  customStyles={[
                    cStyles.H5,
                    cStyles.fontRegular,
                    {color: customColors.blue},
                  ]}
                  label={'common:from_gallery'}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[cStyles.rounded2, {backgroundColor: customColors.card}]}>
              <TouchableOpacity
                style={[
                  cStyles.rounded2,
                  cStyles.fullWidth,
                  cStyles.center,
                  {height: 55, backgroundColor: customColors.card},
                ]}
                onPress={onCloseChooseType}>
                <CText
                  customStyles={[cStyles.H5, {color: customColors.blue}]}
                  label={'common:cancel'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
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
