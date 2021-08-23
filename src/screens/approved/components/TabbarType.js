/**
 ** Name: Tab bar for request type
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TabbarType.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Animated, StyleSheet, View} from 'react-native';
/* COMPONENTS */
import Tab from './Tab';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, moderateScale} from '~/utils/helper';

const posTab1 = 1;
const posTab2 = moderateScale(350) / 3 - 1;
const posTab3 = (moderateScale(350) / 3) * 2 - 1;

function TabbarType(props) {
  const {customColors} = useTheme();
  const {navigationState, position, jumpTo} = props;
  const inputRange = navigationState.routes.map((x, i) => i);
  let translateX = null;

  /**************
   ** RENDER **
   **************/
  translateX = position.interpolate({
    inputRange,
    outputRange: [posTab1, posTab2, posTab3],
    extrapolate: 'clamp',
  });
  return (
    <View style={cStyles.itemsCenter}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.mx16,
          cStyles.my10,
          cStyles.rounded1,
          styles.tab_bar,
          {backgroundColor: customColors.cardDisable},
        ]}>
        {navigationState.routes.map((route, index) => (
          <Tab
            key={route.key.toString()}
            title={route.title}
            onPress={() => jumpTo(route.key)}
          />
        ))}
        <Animated.View
          style={[
            cStyles.rounded1,
            cStyles.abs,
            cStyles.shadow1,
            styles.tab_active,
            {
              backgroundColor: customColors.tabActive,
              transform: [{translateX}],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.SECONDARY, height: moderateScale(3)},
  tab_bar: {height: moderateScale(32), width: moderateScale(350)},
  tab_active: {
    height: IS_IOS ? moderateScale(30) : moderateScale(29),
    width: moderateScale(350) / 3,
    zIndex: 1,
  },
});

TabbarType.propTypes = {
  navigationState: PropTypes.object,
  position: PropTypes.any,
  jumpTo: PropTypes.func,
};

export default React.memo(TabbarType);
