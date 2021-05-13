/**
 ** Name: Item Dashboard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Item.js
 **/
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {sW} from '~/utils/helper';
/* REDUX */

function Item(props) {
  const {index = -1, data = null, onPress = () => {}} = props;

  if (!data) {
    return null;
  }
  return (
    <View style={[cStyles.itemsCenter, styles.item]}>
      <TouchableOpacity activeOpacity={1} onPress={() => onPress(data.name)}>
        <Image
          style={styles.image_item}
          source={data.icon}
          resizeMode={'contain'}
        />
      </TouchableOpacity>

      <CText styles={'pt10 textCenter'} label={data.title} numberOfLines={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: sW('20%'),
    width: sW('20%'),
    backgroundColor: colors.WHITE,
  },
  item: {flex: 0.33, width: sW('21%')},
  image_item: {
    height: sW('21%'),
    width: sW('21%'),
  },
});

export default Item;
