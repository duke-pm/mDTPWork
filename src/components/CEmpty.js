/**
 ** Name: CEmpty
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CEmpty.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CImage from '~/components/CImage';
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';
import {moderateScale} from '~/utils/helper';

function CEmpty(props) {
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.flex1, cStyles.itemsCenter, cStyles.pt40]}>
      <CImage
        style={styles.img_empty}
        source={Assets.iconEmpty}
        resizeMode={'contain'}
      />

      <CText styles={'pt16 textSubheadline'} label={props.label} />
      <CText styles={'textCallout textCenter pt10'} label={props.description} />
    </View>
  );
}

const styles = StyleSheet.create({
  img_empty: {height: moderateScale(100), width: moderateScale(100)},
});

export default CEmpty;
