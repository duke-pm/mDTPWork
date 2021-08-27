/**
 ** Name: CLoading
 ** Author: DTP-Education ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
/** COMPONENTS */
import CActivityIndicator from './CActivityIndicator';
/** COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CLoading(props) {
  const isDark = useColorScheme() === THEME_DARK;
  /**************
   ** RENDER **
   **************/
  return (
    <Modal
      style={cStyles.m0}
      isVisible={props.visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      backdropOpacity={isDark ? 0.8 : 0.2}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      onBackButtonPress={null}
      onBackdropPress={null}
      {...props}>
      <View style={cStyles.flexCenter}>
        <Animatable.View
          style={[cStyles.rounded2, cStyles.center, styles.indicator]}
          animation={'pulse'}
          duration={1000}
          easing={'ease-out'}
          iterationCount={'infinite'}>
          <CActivityIndicator />
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  indicator: {height: moderateScale(40), width: moderateScale(40)},
});

CLoading.propTypes = {
  visible: PropTypes.bool,
};

export default CLoading;
