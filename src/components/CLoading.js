/**
 ** Name: CLoading
 ** Author: DTP-Education ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
/** COMMON */
import {colors, cStyles} from '~/utils/style';

function CLoading(props) {
  /**************
   ** RENDER **
   **************/
  return (
    <Modal
      style={cStyles.m0}
      isVisible={props.visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      deviceWidth={cStyles.deviceWidth}
      deviceHeight={cStyles.deviceHeight}
      backdropOpacity={0.3}
      onBackButtonPress={null}
      onBackdropPress={null}>
      <View style={cStyles.flexCenter}>
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
          <ActivityIndicator size={'small'} color={colors.GRAY_500} />
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  indicator: {height: 50, width: 50},
});

export default CLoading;
