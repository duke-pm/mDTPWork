/**
 ** Name: Unconnected screen
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React from 'react';
import {
  View,
  Image,
  StyleSheet
} from 'react-native';
import CText from '~/components/CText';
/* COMPONENTS */
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import Assets from '~/utils/asset/Assets';
import CButton from '~/components/CButton';
/* REDUX */


function Unconnected(props) {
  const {
    onTryAgain = () => { },
  } = props;

  /** RENDER */
  return (
    <View style={[cStyles.flexCenter, cStyles.p16, styles.container]}>
      <Image
        style={styles.img_lost_network}
        source={Assets.iconLostNetwork}
        resizeMode={'contain'}
      />
      <CText styles={'H5 textCenter'} label={'error:title'} />
      <CText styles={'textMeta pt10 textCenter'} label={'error:lost_network'} />
      <CButton
        style={cStyles.mt16}
        label={'common:try_connect'}
        onPress={onTryAgain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
  },
  img_lost_network: {
    height: 250,
    width: 250,
  },
});

export default Unconnected;
