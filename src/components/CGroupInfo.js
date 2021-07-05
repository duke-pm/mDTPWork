/**
 ** Name: CGroupInfo
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupInfo.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

function CGroupInfo({
  style = {},
  contentStyle = {},
  loading = false,
  label = null,
  content = null,
  empty = false,
}) {
  const {customColors} = useTheme();

  if (empty) {
    return null;
  }
  return (
    <View style={[cStyles.mb16, style]}>
      {label && <CText styles={'H6 px16'} label={label} />}
      <View
        style={[
          cStyles.rounded2,
          cStyles.m16,
          cStyles.mt10,
          cStyles.p16,
          {backgroundColor: customColors.card},
          loading && styles.group_holder,
          contentStyle,
        ]}>
        {loading ? (
          <ActivityIndicator size={'small'} color={colors.GRAY_500} />
        ) : (
          content
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group_holder: {height: 50},
});

export default CGroupInfo;
