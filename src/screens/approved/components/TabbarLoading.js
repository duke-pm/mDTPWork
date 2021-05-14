/**
 ** Name:
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {ActivityIndicator, View} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

function TabbarLoading(props) {
  if (!props.show) {
    return null;
  }
  return (
    <View style={[cStyles.flexCenter]}>
      <ActivityIndicator color={colors.PRIMARY} />
      <CText styles={'textMeta pt10 textCenter'} label={'loading'} />
    </View>
  );
}

export default TabbarLoading;
