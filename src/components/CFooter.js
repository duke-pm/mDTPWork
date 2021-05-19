/**
 ** Name: CFooter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useColorScheme} from 'react-native-appearance';
import {BlurView} from '@react-native-community/blur';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function CFooter(props) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View
      style={[
        cStyles.py6,
        cStyles.bottom0,
        cStyles.isIphoneX() && cStyles.pb24,
        isDark && cStyles.abs,
        !isDark && {
          backgroundColor: colors.BACKGROUND_FOOTER,
        },
        styles.con,
      ]}>
      {isDark && IS_IOS && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={'black'}
        />
      )}
      {props.content}
    </View>
  );
}

const styles = StyleSheet.create({
  con: {
    width: '100%',
  },
});

export default CFooter;
