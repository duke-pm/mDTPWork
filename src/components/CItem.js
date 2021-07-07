/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import React from 'react';
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
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, sW} from '~/utils/helper';

function CItem(props) {
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
      style={[cStyles.rounded3, cStyles.mb16, cStyles.mr16, styles.container]}>
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
            {backgroundColor: colors.WHITE},
          ]}>
          <Icon name={data.mIcon} color={color} size={sW('16%')} />
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
  container: {overflow: 'hidden'},
  item: {width: sW('28%'), height: sW('35%')},
});

export default CItem;
