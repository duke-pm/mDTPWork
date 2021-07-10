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
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
          <TouchableOpacity key={index.toString()} onPress={item.onPress}>
            <View style={index !== icons.length - 1 ? cStyles.pr20 : {}}>
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
                    styles.badge,
                    isDark && cStyles.borderAllDark,
                    {
                      backgroundColor: customColors.red,
                      top: 0,
                      left: moderateScale(10),
                    },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  con_tab: {width: cStyles.deviceWidth},
  badge: {
    height: moderateScale(10),
    width: moderateScale(10),
    top: 16,
    right: 15,
  },
});

export default CIconHeader;
