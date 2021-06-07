/**
 ** Name: CFooterList
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Lottie from 'lottie-react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {Animations} from '~/utils/asset';
import {cStyles} from '~/utils/style';

function CFooterList(props) {
  /** RENDER */
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <Lottie style={styles.icon} source={Animations.loading} autoPlay loop />
      <CText styles={'textMeta pt10 textCenter'} label={'common:loading'} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {width: 50, height: 50},
});

export default CFooterList;
