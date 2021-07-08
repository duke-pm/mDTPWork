/**
 ** Name: Tab bar for request type
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TabbarType.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Animated, StyleSheet, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';
/* COMPONENTS */
import CText from '~/components/CText';
import Tab from './Tab';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, moderateScale} from '~/utils/helper';

const posTab1 = 1;
const posTab2 = moderateScale(350) / 3 - 1;
const posTab3 = (moderateScale(350) / 3) * 2 - 2;

function TabbarType(props) {
  const {customColors} = useTheme();
  const {navigationState, position, jumpTo} = props;
  const inputRange = navigationState.routes.map((x, i) => i);
  let translateX = null;

  /**************
   ** RENDER **
   **************/
  if (IS_IOS) {
    translateX = position.interpolate({
      inputRange,
      outputRange: [posTab1, posTab2, posTab3],
      extrapolate: 'clamp',
    });
    return (
      <View style={[cStyles.itemsCenter]}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.mx16,
            cStyles.mt10,
            cStyles.rounded1,
            styles.tab_bar,
            {backgroundColor: customColors.cardDisable},
          ]}>
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
          {navigationState.routes.map((route, index) => (
            <Tab
              key={route.key.toString()}
              title={route.title}
              onPress={() => jumpTo(route.key)}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator_tab}
      style={{backgroundColor: customColors.background}}
      activeColor={colors.SECONDARY}
      inactiveColor={customColors.text}
      renderLabel={({route, focused, color}) => (
        <CText
          customStyles={[cStyles.py5, focused && cStyles.colorSecondary]}
          customLabel={route.title}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.SECONDARY, height: moderateScale(3)},
  tab_bar: {height: moderateScale(32)},
  tab_active: {height: moderateScale(30), width: moderateScale(350) / 3},
});

export default React.memo(TabbarType);
