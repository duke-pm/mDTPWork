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
import {IS_IOS} from '~/utils/helper';

const posTab1 = 2;
const posTab2 = cStyles.deviceWidth / 3 - 8;
const posTab3 = (cStyles.deviceWidth / 3) * 2 - 16;

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
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.mx16,
          cStyles.mt16,
          cStyles.rounded1,
          styles.tab_bar,
          {backgroundColor: customColors.tab},
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
  indicator_tab: {backgroundColor: colors.SECONDARY, height: 3},
  tab_bar: {height: 30},
  tab_active: {height: 26, width: cStyles.deviceWidth / 3 - 18},
});

export default React.memo(TabbarType);
