/**
 ** Name: CEmpty
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CEmpty.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {Animations} from '~/utils/asset';
import {moderateScale} from '~/utils/helper';

function CEmpty(props) {
  const {style = {}} = props;
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.flex1, cStyles.itemsCenter, cStyles.pt40, style]}>
      <LottieView
        style={styles.img_empty}
        source={Animations.empty}
        autoPlay
        loop
      />

      <CText styles={'pt16 textSubheadline'} label={props.label} />
      <CText styles={'textCallout textCenter pt10'} label={props.description} />
    </View>
  );
}

const styles = StyleSheet.create({
  img_empty: {height: moderateScale(100), width: moderateScale(100)},
});

CEmpty.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  description: PropTypes.string,
};

export default CEmpty;
