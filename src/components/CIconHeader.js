/**
 ** Name: CIconHeader
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CIconHeader.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
/** COMPONENTS */
import CIcon from './CIcon';
import CTouchable from './CTouchable';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {moderateScale} from '~/utils/helper';
import {cStyles} from '~/utils/style';

CIconHeader.propTypes = {
  icons: PropTypes.array,
};

function CIconHeader(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {icons = []} = props;

  /************
   ** RENDER **
   ************/
  if (icons.length === 0) {
    return null;
  }

  return (
    <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
      {icons.map((item, index) => {
        if (!item.show) {
          return null;
        }
        return (
          <CTouchable
            key={index.toString()}
            containerStyle={[
              cStyles.rounded10,
              index !== icons.length - 1 ? cStyles.mr16 : {},
            ]}
            onPress={item.onPress}>
            <View style={cStyles.p3}>
              <CIcon
                name={item.icon}
                size={'medium'}
                customColor={item.iconColor || customColors.icon}
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
