/**
 ** Name: Custom Avatar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme, Layout, Avatar, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';

/** All init */
const SIZE = {
  THIN: 'thin',
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  GIANT: 'giant',
};

function CAvatar(props) {
  const theme = useTheme();
  const {
    style = {},
    numberShow = 3,
    absolute = true,
    size = 'large',
    shape = 'round', // round | rounded | square
    sources = [],
    source = null,
  } = props;
  const bodColor = theme['border-basic-color-3'];

  /************
   ** RENDER **
   ************/
  let holderSize = {},
    borderRadiusHolder = {};
  switch (size) {
    case SIZE.TINY:
      holderSize = styles.img_tiny;
      borderRadiusHolder = cStyles.rounded5;
      break;
    case SIZE.SMALL:
      holderSize = styles.img_small;
      borderRadiusHolder = cStyles.rounded6;
      break;
    case SIZE.LARGE:
      holderSize = styles.img_large;
      borderRadiusHolder = cStyles.rounded10;
      break;
    case SIZE.GIANT:
      holderSize = styles.img_giant;
      borderRadiusHolder = cStyles.rounded10;
      break;
    default:
      holderSize = styles.img_medium;
      break;
  }
  
  if (sources.length === 0 && source) {
    return (
      <Avatar
        style={[cStyles.borderAll, {borderColor: bodColor}]}
        size={size}
        shape={shape}
        source={typeof source === 'string'
          ? {uri: source}
          : source
        }
      />
    );
  }
  if (sources.length > 0) {
    return (
      <View
        style={[
          cStyles.flex1,
          cStyles.row,
          cStyles.itemsCenter,
          style,
        ]}>
        {sources.map((itemA, indexA) => {
          if (indexA > numberShow) return null;
          if (indexA === numberShow) {
            return (
              <Layout
                key={'avatar_holder_' + indexA}
                style={[
                  cStyles.center,
                  cStyles.borderAll,
                  holderSize,
                  borderRadiusHolder,
                  {borderColor: bodColor},
                  absolute && cStyles.abs,
                  absolute && {left: indexA * 15},
                ]}
                level="3">
                <Text category="c1" numberOfLines={1}>
                  {`+${sources.length - numberShow}`}
                </Text>
              </Layout>
            )
          }
          return (
            <Avatar
              key={'avatar_' + indexA}
              style={[
                cStyles.borderAll,
                absolute && cStyles.abs,
                absolute && {left: indexA * 15},
                {borderColor: bodColor},
              ]}
              size={size}
              shape={shape}
              source={typeof itemA === 'string'
                ? {uri: itemA}
                : itemA
              }
            />
          )
        })}
      </View>
    )
  }
  return null;
}

const styles = StyleSheet.create({
  img_tiny: {height: 24, width: 24},
  img_small: {height: 32, width: 32},
  img_medium: {height: 40, width: 40},
  img_large: {height: 48, width: 48},
  img_giant: {height: 56, width: 56},

  con_group_avatar: {height: 42, width: 42},
  con_holder_avatar: {height: 18, width: 18},
});

CAvatar.propTypes = {
  style: PropTypes.object,
  numberShow: PropTypes.number,
  absolute: PropTypes.bool,
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'giant']),
  shape: PropTypes.oneOf(['round', 'rounded', 'square']),
  sources: PropTypes.array,
  source: PropTypes.object,
};

export default CAvatar;
