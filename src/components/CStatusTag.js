/**
 ** Name: CStatusTag
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatusTag.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
import CIcon from './CIcon';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';

function CStatusTag(props) {
  const {style, label, customLabel, color} = props;

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.py1,
        cStyles.px6,
        cStyles.rounded5,
        {backgroundColor: color},
        style,
      ]}>
      <CIcon name={Icons.dot} customColor={colors.WHITE} size={'minium'} />
      <CText
        customStyles={[
          cStyles.textCaption1,
          cStyles.fontMedium,
          cStyles.pl2,
          {color: colors.WHITE},
        ]}
        label={label || undefined}
        customLabel={customLabel || undefined}
      />
      <View style={[cStyles.abs, cStyles.inset0, cStyles.flex1, styles.abs]} />
    </View>
  );
}

const styles = StyleSheet.create({
  abs: {backgroundColor: 'rgba(255,255,255,.4)'},
});

CStatusTag.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  customLabel: PropTypes.string,
  color: PropTypes.string,
};

export default React.memo(CStatusTag);
