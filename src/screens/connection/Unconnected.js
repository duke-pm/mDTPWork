/**
 ** Name: Unconnected screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/* COMMON */
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';

function Unconnected(props) {
  const {customColors} = useTheme();
  const {onTryAgain} = props;

  /** RENDER */
  return (
    <View
      style={[
        cStyles.flexCenter,
        cStyles.p16,
        {backgroundColor: customColors.background},
      ]}>
      <View style={cStyles.pb32}>
      <Icon name={'cloud-off'} color={customColors.icon} size={scalePx(10)} />
      </View>
      <CText
        customStyles={[
          cStyles.H5,
          cStyles.textCenter,
          {color: customColors.text},
        ]}
        label={'error:title'}
      />
      <CText
        customStyles={[
          cStyles.textMeta,
          cStyles.pt10,
          cStyles.textCenter,
          {color: customColors.text},
        ]}
        label={'error:lost_network'}
      />
      <CButton
        style={cStyles.mt16}
        label={'common:try_connect'}
        onPress={onTryAgain}
      />
    </View>
  );
}

export default Unconnected;
