/**
 ** Name: CEmpty
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CEmpty.js
 **/
import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';

function CEmpty(props) {
  /** RENDER */
  return (
    <View style={[cStyles.flex1, cStyles.itemsCenter, cStyles.pt40]}>
      <Image
        style={styles.img_empty}
        source={Assets.iconEmpty}
        resizeMode={'contain'}
      />

      <CText styles={'fontBold pt16'} label={props.label} />
      <CText styles={'textMeta textCenter pt10'} label={props.description} />
    </View>
  );
}

const styles = StyleSheet.create({
  img_empty: {height: 100, width: 100},
});

export default CEmpty;
