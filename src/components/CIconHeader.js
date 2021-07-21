/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: CIconHeader
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconHeader.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CTouchable from './CTouchable';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CIconHeader(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {icons} = props;

  return (
    <View style={[cStyles.row, cStyles.itemsCenter]}>
      {icons.map((item, index) => {
        if (!item.show) {
          return null;
        }
        return (
          <CTouchable
            key={index.toString()}
            containerStyle={[
              cStyles.rounded10,
              index !== icons.length - 1 ? cStyles.mr20 : {},
            ]}
            onPress={item.onPress}>
            <View style={cStyles.p3}>
              <Icon
                name={item.icon}
                color={
                  item.iconColor ||
                  (IS_ANDROID ? colors.WHITE : customColors.icon)
                }
                size={moderateScale(21)}
              />
              {item.showRedDot && (
                <View
                  style={[
                    cStyles.abs,
                    cStyles.rounded2,
                    cStyles.borderAll,
                    isDark && cStyles.borderAllDark,
                    {backgroundColor: customColors.red},
                    styles.badge,
                  ]}
                />
              )}
            </View>
          </CTouchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: moderateScale(10),
    width: moderateScale(10),
    left: moderateScale(15),
    top: moderateScale(5),
  },
});

export default CIconHeader;
