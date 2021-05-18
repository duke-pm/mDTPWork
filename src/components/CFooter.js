/**
 ** Name: CFooter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CFooter.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/** COMMON */
import {colors, cStyles} from '~/utils/style';

function CFooter(props) {
  const isDark = useColorScheme() === 'dark';
  const {customColors} = useTheme();

  return (
    <View
      style={[
        cStyles.py6,
        cStyles.isIphoneX() && cStyles.pb24,
        {
          backgroundColor: isDark
            ? customColors.header
            : colors.BACKGROUND_FOOTER,
        },
        styles.con,
      ]}>
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
