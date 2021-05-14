/**
 ** Name: Tab bar for request type
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of TabbarType.js
 **/
import React from 'react';
import {StyleSheet} from 'react-native';
import {TabBar} from 'react-native-tab-view';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
/* REDUX */

function TabbarType(props) {
  return (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator_tab}
      style={styles.tab}
      renderLabel={({route, focused, color}) => (
        <CText
          styles={'p10 ' + (focused ? 'colorPrimary fontBold' : 'colorGray700')}
          customLabel={route.title}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.PRIMARY},
  tab: {backgroundColor: colors.WHITE},
  con_tab: {width: cStyles.deviceWidth},
});

export default TabbarType;
