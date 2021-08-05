/**
 ** Name: CStatusTag
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatusTag.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

function CStatusTag(props) {
  const {customColors} = useTheme();
  const {label, customLabel, color} = props;

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.py2,
        cStyles.px6,
        cStyles.rounded5,
        {backgroundColor: color},
      ]}>
      <Icon
        name={Icons.dot}
        color={customColors.card}
        size={moderateScale(10)}
      />
      <CText
        customStyles={[
          cStyles.textCaption2,
          cStyles.fontBold,
          cStyles.pl6,
          {color: colors.WHITE},
        ]}
        label={label || undefined}
        customLabel={customLabel || undefined}
      />
    </View>
  );
}

export default CStatusTag;
