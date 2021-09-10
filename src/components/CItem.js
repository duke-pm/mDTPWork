/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
/* COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {moderateScale, sW} from '~/utils/helper';

function CItem(props) {
  const {
    itemStyle = {},
    iconStyle = {},
    textStyle = {},
    key = '',
    index = 0,
    data = null,
    bgColor = [],
    onPress = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(data, index);

  /**************
   ** RENDER **
   **************/
  if (!data) {
    return null;
  }
  return (
    <CTouchable
      key={key}
      containerStyle={[cStyles.rounded1, cStyles.mt16, styles.item, itemStyle]}
      style={cStyles.rounded1}
      onPress={handleItem}>
      <View style={[cStyles.itemsCenter, cStyles.py10]}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.center,
            {backgroundColor: bgColor},
            styles.con_icon,
          ]}>
          <LinearGradient
            style={[cStyles.center, cStyles.rounded5, cStyles.p8, iconStyle]}
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            colors={props.colors}>
            <Icon
              name={data.mIcon}
              color={colors.WHITE}
              size={moderateScale(30)}
            />
          </LinearGradient>
        </View>

        <CText
          customStyles={[
            cStyles.textCaption2,
            cStyles.fontBold,
            cStyles.textCenter,
            cStyles.pt10,
            textStyle,
          ]}
          label={data.menuName}
          numberOfLines={3}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('22.5%')},
  con_icon: {height: moderateScale(60), width: moderateScale(60)},
  icon: {width: moderateScale(40), height: moderateScale(40)},
});

CItem.propTypes = {
  itemStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  textStyle: PropTypes.object,
  key: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
  colors: PropTypes.array,
  bgColor: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(CItem);
