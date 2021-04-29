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
import Icon from 'react-native-vector-icons/FontAwesome5';
/** COMMON */
import Routes from './Routes';
import { IS_IOS } from '~/utils/helper';
import CText from '~/components/CText';
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
          let tmpSize = IS_IOS ? 22 : 20;

          switch (route.name) {
            case Routes.MAIN.DASHBOARD.name:
              iconName = 'atom';
              break;
            case Routes.MAIN.ACCOUNT.name:
              iconName = 'user';
              break;
          }

          return <Icon style={cStyles.mt6} name={iconName} size={tmpSize} color={color} solid={focused} />;
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
        name={Routes.MAIN.ADD_APPROVED.name}
        component={Routes.MAIN.ADD_APPROVED.path}
      />
    </StackMain.Navigator>
  );
};

export default RootMain;
