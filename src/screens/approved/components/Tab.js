/**
 ** Name: Tab item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Tab.js
 **/
import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {moderateScale} from '~/utils/helper';
import {cStyles} from '~/utils/style';

function Tab(props) {
  const {key, title, onPress} = props;

  /**************
   ** RENDER **
   **************/
  return (
    <TouchableOpacity key={key} onPress={onPress}>
      <View style={[cStyles.flexCenter, styles.tab]}>
        <CText
          customStyles={[cStyles.textMeta, cStyles.fontMedium]}
          customLabel={title}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    height: moderateScale(30),
    width: moderateScale(350) / 3,
  },
});

export default React.memo(Tab);
