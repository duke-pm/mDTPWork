/**
 ** Name: SocialItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of SocialItem.js
 **/
import React from 'react';
import {StyleSheet, Linking, View, TouchableOpacity, Image} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

function SocialItem(props) {
  const {key, index, data} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSocial = () => Linking.openURL(data.url);

  /**************
   ** RENDER **
   **************/
  return (
    <TouchableOpacity key={key} onPress={handleSocial}>
      <View
        style={[
          cStyles.rounded1,
          cStyles.center,
          cStyles.p8,
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
  social: {height: moderateScale(20), width: moderateScale(20)},
});

export default SocialItem;
