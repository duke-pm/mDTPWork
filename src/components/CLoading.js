/**
 ** Name: CLoading
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View, StyleSheet, Modal} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {Animations} from '~/utils/asset';

function CLoading(props) {
  const {customColors} = useTheme();
  /** RENDER */
  return (
    <Modal visible={props.visible} animationType={'fade'} transparent>
      <View
        style={[
          cStyles.flex1,
          cStyles.itemsCenter,
          cStyles.justifyCenter,
          styles.con_modal,
        ]}>
        <Animatable.View
          style={[
            cStyles.rounded2,
            cStyles.center,
            styles.indicator,
            {backgroundColor: customColors.cardDisable},
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
