/**
 ** Name: CGroupInfo
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupInfo.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import CActivityIndicator from './CActivityIndicator';
import {moderateScale} from '~/utils/helper';

function CGroupInfo({
  style = {},
  contentStyle = {},
  containerLabelStyle = {},
  labelStyle = {},
  loading = false,
  label = null,
  content = null,
  empty = false,
}) {
  const {customColors} = useTheme();

  /************
   ** RENDER **
   ************/
  if (empty) {
    return null;
  }
  return (
    <View style={[cStyles.mb16, style]}>
      {label && (
        <View style={[containerLabelStyle]}>
          <CText
            customStyles={[cStyles.textHeadline, cStyles.px16, labelStyle]}
            label={label}
          />
        </View>
      )}
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
        {loading ? <CActivityIndicator /> : content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group_holder: {height: moderateScale(50)},
});

export default CGroupInfo;
