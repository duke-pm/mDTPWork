/**
 ** Name: CLoading
 ** Author: DTP-Education ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Lottie from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
/** COMMON */
import {Animations} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';

function CLoading(props) {
  /** RENDER */
  return (
    <Modal
      style={cStyles.m0}
      isVisible={props.visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackButtonPress={null}
      onBackdropPress={null}
      backdropOpacity={0.3}>
      <View style={[cStyles.flex1, cStyles.itemsCenter, cStyles.justifyCenter]}>
        <Animatable.View
          style={[
            cStyles.rounded2,
            cStyles.center,
            styles.indicator,
            {backgroundColor: props.customColors.cardDisable},
          ]}
          animation={'pulse'}
          duration={1000}
          easing={'ease-out'}
          iterationCount={'infinite'}>
          <Lottie
            style={styles.icon}
            source={Animations.loading}
            autoPlay
            loop
          />
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_modal: {backgroundColor: colors.BACKGROUND_MODAL},
  indicator: {height: 50, width: 50},
  icon: {width: 70, height: 70},
});

export default CLoading;
