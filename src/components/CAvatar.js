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
import Icon from 'react-native-vector-icons/Ionicons';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import Icons from '~/config/icons';
import {Assets} from '~/utils/asset';
import {
  askPermissionsCamera,
  IS_ANDROID,
  IS_IOS,
  moderateScale,
} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CAvatar(props) {
  const isDark = useColorScheme() === THEME_DARK;
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

  /**********
   ** FUNC **
   **********/
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

  /************
   ** RENDER **
   ************/
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
          <LinearGradient
            style={cStyles.rounded10}
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            colors={['#8e9eab', '#eef2f3']}>
            <View
              style={[
                cStyles.rounded10,
                cStyles.flexCenter,
                size === 'vsmall' && styles.image_vsmall,
                size === 'small' && styles.image_small,
                size === 'medium' && styles.image_medium,
                size === 'large' && styles.image_large,
                imageStyle,
              ]}>
              <Text
                style={[
                  cStyles.textCenter,
                  cStyles.colorGray800,
                  {
                    fontSize:
                      size === 'vsmall'
                        ? moderateScale(9)
                        : size === 'small'
                        ? moderateScale(14)
                        : size === 'medium'
                        ? moderateScale(18)
                        : moderateScale(30),
                  },
                ]}>
                {customLabel}
              </Text>
            </View>
            {IS_IOS && isEdit && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.center,
                  cStyles.fullWidth,
                  cStyles.ofHidden,
                  styles.con_edit,
                  {backgroundColor: isDark ? colors.GRAY_800 : colors.BLACK},
                ]}>
                <CText
                  customStyles={[
                    cStyles.pb1,
                    cStyles.colorWhite,
                    styles.text_edit,
                  ]}
                  label={'common:edit'}
                />
              </View>
            )}
          </LinearGradient>
        )}

        {IS_ANDROID && isEdit && (
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
              name={Icons.camera}
              color={customColors.text}
              size={moderateScale(
                size === 'small' ? 10 : size === 'medium' ? 14 : 18,
              )}
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
                  {
                    height: moderateScale(50),
                    backgroundColor: customColors.card,
                  },
                ]}>
                <CText
                  customStyles={cStyles.textMeta}
                  label={'common:from_upload'}
                />
              </View>
              <View
                style={{
                  height: moderateScale(0.5),
                  backgroundColor: colors.GRAY_500,
                  width: '100%',
                }}
              />
              <TouchableOpacity
                style={[
                  cStyles.fullWidth,
                  cStyles.center,
                  {
                    height: moderateScale(50),
                    backgroundColor: customColors.card,
                  },
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
                  height: moderateScale(0.5),
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
                  {
                    height: moderateScale(50),
                    backgroundColor: customColors.card,
                  },
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
                  {
                    height: moderateScale(50),
                    backgroundColor: customColors.card,
                  },
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
    height: moderateScale(20),
    width: moderateScale(20),
  },
  image_small: {
    height: moderateScale(26),
    width: moderateScale(26),
  },
  image_medium: {
    height: moderateScale(36),
    width: moderateScale(36),
  },
  image_large: {
    height: moderateScale(60),
    width: moderateScale(60),
  },

  icon_camera_vsmall: {
    height: moderateScale(10),
    width: moderateScale(10),
  },
  icon_camera_small: {
    height: moderateScale(15),
    width: moderateScale(15),
  },
  icon_camera_medium: {
    height: moderateScale(19),
    width: moderateScale(19),
  },
  icon_camera_large: {
    height: moderateScale(22),
    width: moderateScale(22),
  },
  con_loading: {backgroundColor: 'transparent'},
  con_edit: {bottom: -moderateScale(1)},
  text_edit: {fontSize: moderateScale(9)},
});

export default CAvatar;
