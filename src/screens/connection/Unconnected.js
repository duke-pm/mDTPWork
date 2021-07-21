/**
 ** Name: Unconnected screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import Icons from '~/config/Icons';
import {moderateScale} from '~/utils/helper';

function Unconnected(props) {
  const {customColors} = useTheme();

  /************
   ** RENDER **
   ************/
  if (props.connected) {
    return null;
  }
  return (
    <View
      style={[
        cStyles.flexCenter,
        cStyles.p16,
        cStyles.abs,
        cStyles.inset0,
        {backgroundColor: customColors.background},
      ]}>
      <View style={cStyles.pb32}>
        <Icon
          name={Icons.failedSad}
          color={customColors.orange}
          size={moderateScale(80)}
        />
      </View>
      <CText
        customStyles={[
          cStyles.textTitle3,
          cStyles.textCenter,
          {color: customColors.text},
        ]}
        label={'error:title'}
      />
      <CText
        customStyles={[
          cStyles.textCaption1,
          cStyles.pt10,
          cStyles.textCenter,
          {color: customColors.text},
        ]}
        label={'error:lost_network'}
      />
    </View>
  );
}

export default Unconnected;
