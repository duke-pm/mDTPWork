/**
 ** Name: Tabbar Loading
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';

function TabbarLoading(props) {
  /**************
   ** RENDER **
   **************/
  if (!props.show) {
    return null;
  }
  return (
    <View style={[cStyles.flexCenter]}>
      <ActivityIndicator size={'small'} />
      <CText styles={'textMeta pt10 textCenter'} label={'loading'} />
    </View>
  );
}

export default React.memo(TabbarLoading);
