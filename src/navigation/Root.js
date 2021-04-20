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

export function RootStack(props) {

  return (
    <StackMain.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      headerMode={'none'}
    >
      <StackMain.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
      />
    </StackMain.Navigator>
  );
};

export function RootMain(props) {

  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      headerMode={'none'}
    >
      <StackMain.Screen
        name={Routes.AUTHENTICATION.SIGN_IN.name}
        component={Routes.AUTHENTICATION.SIGN_IN.path}
      />

      <StackMain.Screen
        name={'RootStack'}
        component={RootStack}
      />
    </StackMain.Navigator>
  );
};

export default RootMain;
