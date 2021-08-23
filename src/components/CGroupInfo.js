/**
 ** Name: CGroupInfo
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupInfo.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
import CActivityIndicator from './CActivityIndicator';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

function CGroupInfo({
  style = {},
  containerLabelStyle = {},
  contentStyle = {},
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
    <View style={style}>
      {label && (
        <View style={containerLabelStyle}>
          <CText
            customStyles={[cStyles.textHeadline, cStyles.px16, labelStyle]}
            label={label}
          />
        </View>
      )}
      <View
        style={[
          cStyles.flex1,
          cStyles.rounded2,
          cStyles.m16,
          cStyles.mt10,
          cStyles.p16,
          cStyles.shadowListItem,
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

CGroupInfo.propTypes = {
  style: PropTypes.object,
  containerLabelStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
  content: PropTypes.element,
  empty: PropTypes.bool,
};

export default CGroupInfo;
