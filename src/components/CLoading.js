/**
 ** Name: CLoading
 ** Author: DTP-Education ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
/** COMPONENTS */
import CActivityIndicator from './CActivityIndicator';
/** COMMON */
import {cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CLoading(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  /**************
   ** RENDER **
   **************/
  return (
    <Modal
      style={cStyles.m0}
      isVisible={props.visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      backdropOpacity={isDark ? 0.8 : 0.3}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      onBackButtonPress={null}
      onBackdropPress={null}>
      <View style={cStyles.flexCenter}>
        <View
          style={[
            cStyles.center,
            cStyles.rounded2,
            styles.con_activity,
            {backgroundColor: customColors.bgLoading},
          ]}>
          <CActivityIndicator />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_activity: {height: 50, width: 50},
});

CLoading.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default React.memo(CLoading);
