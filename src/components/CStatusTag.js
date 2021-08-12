/**
 ** Name: CStatusTag
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatusTag.js
 **/
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

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
      <Icon name={Icons.dot} color={colors.WHITE} size={moderateScale(10)} />
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
