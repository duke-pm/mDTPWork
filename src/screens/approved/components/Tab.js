/**
 ** Name:
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import {IS_ANDROID} from '~/utils/helper';
/* COMMON */
import {cStyles} from '~/utils/style';

function Tab(props) {
  const {title, isFocus, onPress} = props;

  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <Touchable onPress={onPress}>
      <View style={[cStyles.flexCenter, cStyles.mx2, styles.tab]}>
        <CText styles={'textMeta fontRegular'} customLabel={title} />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  tab: {height: 40, width: cStyles.deviceWidth / 3 - 22},
});

export default Tab;
