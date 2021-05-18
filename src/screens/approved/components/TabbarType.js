/**
 ** Name: Tab bar for request type
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TabbarType.js
 **/
import React from 'react';
import {StyleSheet} from 'react-native';
import {TabBar} from 'react-native-tab-view';
import {useTheme} from '@react-navigation/native';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
/* REDUX */

function TabbarType(props) {
  const {colors} = useTheme();

  return (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator_tab}
      style={{backgroundColor: colors.background}}
      renderLabel={({route, focused, color}) => (
        <CText
          styles={'py5 fontLight ' + (focused ? 'fontBold' : '')}
          customLabel={route.title}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.SECONDARY, height: 3},
});

export default TabbarType;
