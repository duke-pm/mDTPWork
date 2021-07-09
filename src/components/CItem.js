/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/* COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale, sW} from '~/utils/helper';

function CItem(props) {
  const {customColors} = useTheme();
  const {data = null, color = 'blue', onPress = () => {}} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(data);

  /**************
   ** RENDER **
   **************/
  if (!data) {
    return null;
  }
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  return (
    <View
      style={[cStyles.rounded3, cStyles.mb16, cStyles.mr16, cStyles.ofHidden]}>
      <Touchable
        style={cStyles.rounded3}
        activeOpacity={0.5}
        onPress={handleItem}>
        <View
          style={[
            cStyles.p10,
            cStyles.itemsCenter,
            cStyles.rounded3,
            styles.item,
            {backgroundColor: customColors.card},
          ]}>
          <Icon name={data.mIcon} color={color} size={moderateScale(60)} />
          <CText
            customStyles={[
              cStyles.textCenter,
              cStyles.pt10,
              cStyles.fontMedium,
              cStyles.textSubTitle,
            ]}
            label={data.menuName}
            numberOfLines={2}
          />
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('28%'), height: moderateScale(125)},
});

export default CItem;
