/**
 ** Name: SocialItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of SocialItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Linking, View, Image} from 'react-native';
/** COMPONENTS */
import CTouchable from '~/components/CTouchable';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

function SocialItem(props) {
  const {key = '', customColors = {}, index = 0, data = null} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSocial = () => Linking.openURL(data.url);

  /**************
   ** RENDER **
   **************/
  return (
    <CTouchable
      key={key}
      containerStyle={[index !== 0 && cStyles.ml16, {}]}
      onPress={handleSocial}>
      <View
        style={[
          cStyles.rounded1,
          cStyles.center,
          cStyles.p8,
          {backgroundColor: customColors.cardDisable},
        ]}>
        <Image
          style={styles.social}
          source={data.icon}
          resizeMode={'contain'}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  social: {height: moderateScale(20), width: moderateScale(20)},
});

SocialItem.propTypes = {
  key: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
  customColors: PropTypes.object,
};

export default SocialItem;
