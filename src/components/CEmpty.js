/**
 ** Name: Custom Empty
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CEmpty.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {Animations} from '~/utils/asset';
import {moderateScale} from '~/utils/helper';

function CEmpty(props) {
  const {t} = useTranslation();
  const {
    style = {},
    label = 'common:empty_data',
    description = 'common:cannot_find_data_filter',
  } = props;
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.flex1, cStyles.itemsCenter, cStyles.pt40, style]}>
      <LottieView
        style={styles.img_empty}
        source={Animations.empty}
        autoPlay
        loop={false}
      />

      <CText style={cStyles.mt10} category="s1">{t(label)}</CText>
      <CText style={cStyles.mt5} category='c1'>{t(description)}</CText>
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

export default React.memo(CEmpty);
