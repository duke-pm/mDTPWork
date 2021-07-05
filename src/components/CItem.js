/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CImage from '~/components/CImage';
/** COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {sW} from '~/utils/helper';

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
    <View style={[cStyles.itemsCenter, styles.item]}>
      <TouchableOpacity
        style={[cStyles.shadow1, cStyles.rounded10]}
        onPress={handleItem}>
        <CImage style={styles.image_item} source={Assets[data.mIcon]} />
      </TouchableOpacity>

      <CText
        customStyles={[cStyles.textCenter, cStyles.pt10, cStyles.fontMedium]}
        label={data.menuName}
        numberOfLines={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {flex: 0.33, width: sW('21%')},
  image_item: {
    height: sW('21%'),
    width: sW('21%'),
  },
});

export default CItem;
