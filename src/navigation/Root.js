/**
 ** Name: Root
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
/** COMMON */
import Routes from './Routes';
import { IS_ANDROID, IS_IOS, scalePx } from '~/utils/helper';
import { colors } from '~/utils/style';
/** INIT NAVIGATOR OF APP */
const StackMain = createStackNavigator();
const TabMain = createBottomTabNavigator();

export function RootTab(props) {
  return (
    <TabMain.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      backBehavior={'history'}
      headerMode={'none'}
      lazy={true}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          let tmpSize = IS_IOS ? scalePx(4) : scalePx(3.5);

          switch (route.name) {
            case Routes.MAIN.DASHBOARD.name:
              iconName = focused ? 'home-variant' : 'home-variant-outline';
              break;
            case Routes.MAIN.ACCOUNT.name:
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return <Icon name={iconName} size={tmpSize} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.SECONDARY,
        inactiveTintColor: colors.PRIMARY,
        keyboardHidesTabBar: true,
        showLabel: false,
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
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
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
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS.name}
        component={Routes.MAIN.APPROVED_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_DAMAGE.name}
        component={Routes.MAIN.APPROVED_ASSETS_DAMAGE.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_LOST.name}
        component={Routes.MAIN.APPROVED_ASSETS_LOST.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_ASSETS.name}
        component={Routes.MAIN.ADD_APPROVED_ASSETS.path}
        options={{
          ...IS_ANDROID
            ? TransitionPresets.RevealFromBottomAndroid
            : TransitionPresets.ModalTransition
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
        options={{
          ...IS_ANDROID
            ? TransitionPresets.RevealFromBottomAndroid
            : TransitionPresets.ModalTransition
        }}
      />
    </StackMain.Navigator>
  );
};

export default RootMain;
