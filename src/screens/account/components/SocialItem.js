/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: SocialItem
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of SocialItem.js
 **/
import React from 'react';
import {StyleSheet, Linking, View, TouchableOpacity, Image} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';

function SocialItem(props) {
  const {index, data} = props;

  /** HANDLE FUNC */
  const handleSocial = () => {
    Linking.openURL(data.url);
  };

  /** RENDER */
  return (
    <TouchableOpacity key={data.id} onPress={handleSocial}>
      <View
        style={[
          cStyles.rounded2,
          cStyles.borderAll,
          cStyles.center,
          index !== 0 && cStyles.ml16,
          styles.con_social,
          props.darkMode && {
            backgroundColor: props.customColors.card,
            borderWidth: 0,
          },
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
  con_social: {height: 40, width: 40},
  social: {height: 20, width: 20},
});

export default SocialItem;
