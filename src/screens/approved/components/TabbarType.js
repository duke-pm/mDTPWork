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
import {colors, cStyles} from '~/utils/style';
/* REDUX */

function TabbarType(props) {
  const {customColors} = useTheme();

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
});

export default TabbarType;
