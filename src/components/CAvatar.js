/**
 ** Name: Custom Avatar
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme, Layout} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

/** All init */
const SIZE = {
  THIN: 'thin',
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  LARGEST: 'largest',
};
const APPEARANCE = {
  ROUNDED: 'rounded',
  SQUARED: 'squared',
};

function CAvatar(props) {
  const theme = useTheme();
  const {
    containerStyle = {},
    imageStyle = {},
    size = 'large',
    appearance = 'rounded',
    sources = [],
    source = {},
    resizeMode = 'contain',
  } = props;

  /************
   ** RENDER **
   ************/
  let styleWithSize = {};
  let borRadWithAppearance = {};
  let holderSize = {};
  switch (size) {
    case SIZE.THIN:
      styleWithSize = styles.img_thin;
      holderSize = styles.img_thin;
      borRadWithAppearance = cStyles.rounded4;
      break;
    case SIZE.TINY:
      styleWithSize = styles.img_tiny;
      holderSize = styles.img_thin;
      borRadWithAppearance = cStyles.rounded4;
      break;
    case SIZE.SMALL:
      styleWithSize = styles.img_small;
      holderSize = styles.img_thin;
      borRadWithAppearance = cStyles.rounded6;
      break;
    case SIZE.LARGE:
      styleWithSize = styles.img_large;
      holderSize = styles.img_tiny;
      borRadWithAppearance = cStyles.rounded10;
      break;
    case SIZE.LARGEST:
      styleWithSize = styles.img_largest;
      holderSize = styles.img_small;
      borRadWithAppearance = cStyles.rounded12;
      break;
    default:
      styleWithSize = styles.img_medium;
      holderSize = styles.img_thin;
      borRadWithAppearance = cStyles.rounded8;
      break;
  }
  if (appearance === APPEARANCE.SQUARED) {
    borRadWithAppearance = cStyles.rounded1;
  }
  
  if (sources.length === 0) {
    return (
      <View style={containerStyle}>
        <View
          style={[
            cStyles.center,
            cStyles.p1,
            borRadWithAppearance,
            {backgroundColor: theme['border-basic-color-5']}
          ]}>
          <FastImage
            style={[styleWithSize, borRadWithAppearance, imageStyle]}
            source={{
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
              ...source,
            }}
            resizeMode={resizeMode}
          />
        </View>
      </View>
    );
  }
  if (sources.length > 0) {
    return (
      <View
        style={[
          cStyles.flexWrap,
          cStyles.ofHidden,
          cStyles.borderAll,
          cStyles.rounded8,
          cStyles.center,
          cStyles.row,
          styleWithSize,
        ]}>
        {sources.map((itemA, indexA) => {
          if (indexA > 3) return null;
          if (indexA === 3) {
            return (
              <Layout
                style={[
                  cStyles.rounded3,
                  cStyles.center,
                  cStyles.borderAll,
                  cStyles.ml1,
                  holderSize,
                ]}
                level={'3'}>
                <CText category={'c2'} numberOfLines={1}>+{sources.length - 3}</CText>
              </Layout>
            )
          }
          return (
            <FastImage
              style={[cStyles.rounded4, styleWithSize, holderSize]}
              source={{
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
                uri: itemA,
              }}
              resizeMode={resizeMode}
            />
          )
        })}
      </View>
    )
  }

  return null;
}

const styles = StyleSheet.create({
  img_thin: {height: moderateScale(18), width: moderateScale(18)},
  img_tiny: {height: moderateScale(23), width: moderateScale(23)},
  img_small: {height: moderateScale(28), width: moderateScale(28)},
  img_medium: {height: moderateScale(40), width: moderateScale(40)},
  img_large: {height: moderateScale(50), width: moderateScale(50)},
  img_largest: {height: moderateScale(60), width: moderateScale(60)},

  con_group_avatar: {
    height: moderateScale(42),
    width: moderateScale(42),
  },
  con_holder_avatar: {
    height: moderateScale(17),
    width: moderateScale(17),
  },
});

CAvatar.propTypes = {
  containerStyle: PropTypes.object,
  imageStyle: PropTypes.object, 
  size: PropTypes.oneOf(['thin', 'tiny', 'small', 'medium', 'large', 'largest']),
  appearance: PropTypes.oneOf(['rounded', 'squared']),
  sources: PropTypes.array,
  source: PropTypes.object,
  resizeMode: PropTypes.oneOf(['contain', 'cover']),
};

export default CAvatar;
