/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
/* COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
/** COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale, sW} from '~/utils/helper';

CItem.propTypes = {
  itemStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  textStyle: PropTypes.object,
  key: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
  onPress: PropTypes.func,
};

function CItem(props) {
  const {
    itemStyle = {},
    iconStyle = {},
    textStyle = {},
    key = '',
    data = null,
    onPress = () => null,
  } = props;
  const {customColors} = useTheme();

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(data);

  /**************
   ** RENDER **
   **************/
  if (!data) {
    return null;
  }
  return (
    <View
      key={key}
      style={[
        cStyles.px16,
        cStyles.mx16,
        cStyles.mt16,
        cStyles.itemsCenter,
        styles.item,
        itemStyle,
      ]}>
      <CTouchable
        containerStyle={cStyles.rounded3}
        style={[cStyles.m16, cStyles.rounded3]}
        onPress={handleItem}>
        <View
          style={[
            cStyles.shadowListItem,
            cStyles.rounded2,
            cStyles.p10,
            {backgroundColor: customColors.card},
          ]}>
          <FastImage
            style={[styles.icon, iconStyle]}
            source={Assets[data.mIcon]}
            resizeMode={'contain'}
            cache={FastImage.cacheControl.immutable}
          />
        </View>
      </CTouchable>

      <CText
        customStyles={[
          cStyles.textCaption2,
          cStyles.fontBold,
          cStyles.textCenter,
          IS_ANDROID && cStyles.pt10,
          textStyle,
        ]}
        label={data.menuName}
        numberOfLines={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('24%')},
  icon: {width: moderateScale(50), height: moderateScale(50)},
});

export default CItem;
