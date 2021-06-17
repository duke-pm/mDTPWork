/**
 ** Name:
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Lottie from 'lottie-react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Animations} from '~/utils/asset';
import {cStyles} from '~/utils/style';

function TabbarLoading(props) {
  /** RENDER */
  if (!props.show) {
    return null;
  }
  return (
    <View style={[cStyles.flexCenter]}>
      <Lottie style={styles.icon} source={Animations.loading} autoPlay loop />
      <CText styles={'textMeta pt10 textCenter'} label={'loading'} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {width: 50, height: 50},
});

export default React.memo(TabbarLoading);
