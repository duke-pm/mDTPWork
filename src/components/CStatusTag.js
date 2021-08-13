/**
 ** Name: CStatusTag
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatusTag.js
 **/
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
import CIcon from './CIcon';
/* COMMON */
import Icons from '~/config/Icons';
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
        cStyles.py2,
        cStyles.px8,
        cStyles.rounded5,
        {backgroundColor: color},
        style,
      ]}>
      <CIcon name={Icons.dot} customColor={colors.WHITE} size={'minium'} />
      <CText
        customStyles={[
          cStyles.textCaption2,
          cStyles.fontRegular,
          cStyles.pl2,
          {color: colors.WHITE},
        ]}
        label={label || undefined}
        customLabel={customLabel || undefined}
      />
    </View>
  );
}

export default CStatusTag;
