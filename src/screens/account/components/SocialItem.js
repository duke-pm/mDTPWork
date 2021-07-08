/**
 ** Name: SocialItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of SocialItem.js
 **/
import React from 'react';
import {StyleSheet, Linking, View, TouchableOpacity, Image} from 'react-native';
import { moderateScale } from '~/utils/helper';
/* COMMON */
import {cStyles} from '~/utils/style';

function SocialItem(props) {
  const {key, index, data} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSocial = () => {
    Linking.openURL(data.url);
  };

  /**************
   ** RENDER **
   **************/
  return (
    <TouchableOpacity key={key} onPress={handleSocial}>
      <View
        style={[
          cStyles.rounded2,
          cStyles.center,
          styles.con_social,
          {backgroundColor: props.customColors.cardDisable},
          index !== 0 && cStyles.ml16,
        ]}>
        <Image
          style={styles.social}
          source={data.icon}
          resizeMode={'contain'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  con_social: {height: moderateScale(40), width: moderateScale(40)},
  social: {height: moderateScale(20), width: moderateScale(20)},
});

export default SocialItem;
