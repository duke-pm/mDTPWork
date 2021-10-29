/**
 ** Name: CStatusTag
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatusTag.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
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
          cStyles.colorWhite,
          cStyles.pl2,
        ]}
        label={label || undefined}
        customLabel={customLabel || undefined}
      />
    </View>
  );
}

CStatusTag.propTypes = {
  style: PropTypes.object,
  label: PropTypes.string,
  customLabel: PropTypes.string,
  color: PropTypes.string,
};

export default React.memo(CStatusTag);
