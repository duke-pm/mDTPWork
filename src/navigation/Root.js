/**
 ** Name: Root
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
/** COMMON */
import Routes from './Routes';
/** INIT NAVIGATOR OF APP */
const StackMain = createStackNavigator();
const StackChild = createStackNavigator();

export function RootStack(props) {

  return (
    <StackChild.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      headerMode={'none'}
      screenOptions={{ gestureEnabled: false }}
    >
      <StackChild.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
      />
      <StackChild.Screen
        name={Routes.MAIN.APPROVED.name}
        component={Routes.MAIN.APPROVED.path}
      />
      <StackChild.Screen
        name={Routes.MAIN.ADD_APPROVED.name}
        component={Routes.MAIN.ADD_APPROVED.path}
      />
    </StackChild.Navigator>
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
        name={Routes.ROOT_STACK.name}
        component={RootStack}
      />
    </StackMain.Navigator>
  );
};

export default RootMain;
