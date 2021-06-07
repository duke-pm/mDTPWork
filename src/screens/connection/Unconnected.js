/**
 ** Name: Unconnected screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Animations} from '~/utils/asset';
import {cStyles} from '~/utils/style';

function Unconnected(props) {
  const {customColors} = useTheme();

  /** RENDER */
  if (props.connected) return null;

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
        <LottieView
          style={{height: 200, width: 200}}
          source={Animations.connection}
          autoPlay
          loop
        />
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
    </View>
  );
}

export default Unconnected;
