/**
 ** Name: Root
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import Routes from './Routes';
import { IS_IOS, scalePx } from '~/utils/helper';
import { colors, cStyles } from '~/utils/style';
/** INIT NAVIGATOR OF APP */
const StackMain = createStackNavigator();
const TabMain = createBottomTabNavigator();

export function RootTab(props) {
  const { t } = useTranslation();

  return (
    <TabMain.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      backBehavior={'history'}
      headerMode={'none'}
      lazy={true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          let tmpSize = IS_IOS ? scalePx(3.5) : scalePx(3.3);

          switch (route.name) {
            case Routes.MAIN.DASHBOARD.name:
              iconName = focused ? 'home-variant' : 'home-variant-outline';
              break;
            case Routes.MAIN.ACCOUNT.name:
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return <Icon style={cStyles.mt6} name={iconName} size={tmpSize} color={color} />;
        },
        tabBarLabel: ({ focused, color, size }) => {
          let title = '';

          switch (route.name) {
            case Routes.MAIN.DASHBOARD.name:
              title = 'dashboard:title';
              break;
            case Routes.MAIN.ACCOUNT.name:
              title = 'account:title';
              break;
          }
          return (
            <CText
              styles={'textMeta ' + (focused ? 'colorPrimary' : 'colorGray600')}
              label={t(title)}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.PRIMARY,
        inactiveTintColor: colors.GRAY_600,
        keyboardHidesTabBar: true,
      }}
    >
      <TabMain.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path} />
      <TabMain.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={Routes.MAIN.ACCOUNT.path} />
    </TabMain.Navigator>
  );
};

export function RootMain(props) {

  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      headerMode={'none'}
      screenOptions={{ gestureEnabled: false }}
    >
      <StackMain.Screen
        name={Routes.AUTHENTICATION.SIGN_IN.name}
        component={Routes.AUTHENTICATION.SIGN_IN.path}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.FORGOT_PASSWORD.name}
        component={Routes.AUTHENTICATION.FORGOT_PASSWORD.path}
      />
      <StackMain.Screen
        name={Routes.ROOT_TAB.name}
        component={RootTab}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.name}
        component={Routes.MAIN.APPROVED.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS.name}
        component={Routes.MAIN.APPROVED_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_ASSETS.name}
        component={Routes.MAIN.ADD_APPROVED_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.APPROVED_LOST_DAMAGED.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
      />
    </StackMain.Navigator>
  );
};

export default RootMain;
