/**
 ** Name: CItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/* COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
/** COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale, sW} from '~/utils/helper';

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
  return (
    <CTouchable
      containerStyle={[
        cStyles.mb16,
        cStyles.mr16,
        cStyles.rounded2,
        cStyles.shadow1,
      ]}
      onPress={handleItem}>
      <View
        style={[
          cStyles.p10,
          cStyles.itemsCenter,
          {backgroundColor: customColors.card},
          styles.item,
        ]}>
        <Icon name={data.mIcon} color={color} size={moderateScale(60)} />
        <CText
          customStyles={[cStyles.textCenter, cStyles.pt10, cStyles.textBody]}
          label={data.menuName}
          numberOfLines={2}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('28%'), height: moderateScale(130)},
});

export default CItem;
