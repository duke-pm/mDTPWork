/**
 ** Name: Item Dashboard
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Item.js
 **/
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
/* COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import { cStyles, colors } from '~/utils/style';
import { sW } from '~/utils/helper';
/* REDUX */


function Item(props) {
  const {
    index = -1,
    data = null,
    onPress = () => { },
  } = props;

  if (!data) return null;
  return (
    <View
      style={[
        cStyles.itemsCenter,
        { width: styles.container.width },
      ]}>
      <TouchableOpacity activeOpacity={1} onPress={() => onPress('Approved')}>
        <View style={[
          styles.container,
          cStyles.m2,
          cStyles.ml3,
          cStyles.center,
          cStyles.rounded1,
          cStyles.shadow1
        ]}>
          <Icon name={'check-double'} size={30} color={colors.BLACK} />
        </View>
      </TouchableOpacity>

      <CText
        styles={'pt4 textCenter textMeta colorBlack'}
        label={'approved:title'}
        numberOfLines={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: sW('20%'),
    width: sW('20%'),
    backgroundColor: colors.WHITE,
  }
});

export default Item;
