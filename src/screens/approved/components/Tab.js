/**
 ** Name: Tab item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Tab.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {IS_ANDROID, IS_IOS, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function Tab(props) {
  const {key, title, onPress} = props;

  /**************
   ** RENDER **
   **************/
  return (
    <TouchableOpacity
      key={key}
      style={[cStyles.flexCenter, IS_ANDROID && cStyles.shadow1, styles.tab]}
      onPress={onPress}>
      <CText
        customStyles={[cStyles.textCaption1, cStyles.fontBold]}
        customLabel={title}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: colors.TRANSPARENT,
    height: IS_IOS ? moderateScale(30) : moderateScale(29),
    width: moderateScale(350) / 3,
    zIndex: 10000,
  },
});

Tab.propTypes = {
  key: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(Tab);
