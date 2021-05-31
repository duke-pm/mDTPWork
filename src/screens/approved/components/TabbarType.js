/**
 ** Name: Tab bar for request type
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TabbarType.js
 **/
import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';
import {useTheme} from '@react-navigation/native';
/* COMPONENTS */
import CText from '~/components/CText';
import Tab from './Tab';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function TabbarType(props) {
  const {customColors} = useTheme();
  const {navigationState, position, jumpTo} = props;
  let translateX = null;
  if (IS_IOS) {
    translateX = position.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        2,
        cStyles.deviceWidth / 3 - 8,
        (cStyles.deviceWidth / 3) * 2 - 16,
      ],
    });
    return (
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.mx16,
          cStyles.mt16,
          cStyles.rounded2,
          styles.tab_bar,
          {backgroundColor: customColors.tab},
        ]}>
        <Animated.View
          style={[
            cStyles.rounded2,
            cStyles.abs,
            cStyles.mx2,
            cStyles.shadow1,
            styles.tab_active,
            {
              backgroundColor: customColors.tabActive,
              transform: [{translateX}],
            },
          ]}
        />
        {navigationState.routes.map((route, index) => {
          return <Tab title={route.title} onPress={() => jumpTo(route.key)} />;
        })}
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
          customStyles={[
            cStyles.py5,
            focused && cStyles.fontBold,
            focused && cStyles.colorSecondary,
          ]}
          customLabel={route.title}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.SECONDARY, height: 3},

  tab_bar: {height: 40},
  tab_active: {height: 34, width: cStyles.deviceWidth / 3 - 22},
});

export default TabbarType;
