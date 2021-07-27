/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
/* COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_IOS, moderateScale, sW} from '~/utils/helper';
import {Assets} from '~/utils/asset';

function CItem(props) {
  const {data = null, onPress = () => {}} = props;

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
    <CTouchable
      containerStyle={[cStyles.mb16, cStyles.mr16, IS_IOS && cStyles.shadow1]}
      onPress={handleItem}>
      <View style={[cStyles.p10, cStyles.itemsCenter, styles.item]}>
        <FastImage
          style={styles.icon}
          source={Assets[data.mIcon]}
          resizeMode={'contain'}
          cache={FastImage.cacheControl.immutable}
        />
        <CText
          customStyles={[cStyles.textCenter, cStyles.pt10, cStyles.textBody]}
          label={data.menuName}
          numberOfLines={2}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('28%'), height: moderateScale(150)},
  icon: {width: moderateScale(70), height: moderateScale(80)},
});

export default CItem;
