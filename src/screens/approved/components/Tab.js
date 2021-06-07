/**
 ** Name: Tab item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Tab.js
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
/* COMMON */
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';

function Tab(props) {
  const {key, title, onPress} = props;

  /** RENDER */
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <Touchable key={key} onPress={onPress}>
      <View style={[cStyles.flexCenter, cStyles.mx2, styles.tab]}>
        <CText
          customStyles={[cStyles.textMeta, cStyles.fontMedium]}
          customLabel={title}
        />
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  tab: {height: 40, width: cStyles.deviceWidth / 3 - 22},
});

export default React.memo(Tab);
