/**
 ** Name: Custom Empty
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CEmpty.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
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

      <Text style={cStyles.mt10} category="s1">{t(label)}</Text>
      <Text style={cStyles.mt5} category="c1">{t(description)}</Text>
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
