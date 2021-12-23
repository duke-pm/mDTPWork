/**
 ** Name: Root main of App
 ** Author: Jerry
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {enableScreens} from 'react-native-screens';
import {useTheme} from '@ui-kitten/components';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import Routes from './Routes';

/** INIT NAVIGATOR OF APP */
enableScreens(true);
const StackMain = createNativeStackNavigator();
const TabMain = createBottomTabNavigator();

export function BottomTabMain(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  return (
    <TabMain.Navigator
      initialRouteName={Routes.TAB.DASHBOARD.name}
      backBehavior={'history'}
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: theme['background-basic-color-1'],
          borderTopColor: theme['border-basic-color-5']
        },
        tabBarActiveTintColor: theme['color-primary-500'],
        headerShown: false,
        lazy: true,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          switch (route.name) {
            case Routes.TAB.ACCOUNT.name:
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = focused ? 'home' : 'home-outline';
              break;
          }
          return <IoniIcon name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({focused, color, position}) => {
          let label = '';
          switch (route.name) {
            case Routes.TAB.ACCOUNT.name:
              label = 'account:title';
              break;
            default:
              label = 'dashboard:title';
              break;
          }
          return (
            <CText style={{color}} category={'c1'}>
              {t(label)}
            </CText>
          );
        },
      })}>
      <TabMain.Screen
        name={Routes.TAB.DASHBOARD.name}
        component={Routes.TAB.DASHBOARD.path}
      />
      <TabMain.Screen
        name={Routes.TAB.ACCOUNT.name}
        component={Routes.TAB.ACCOUNT.path}
      />
    </TabMain.Navigator>
  );
}

export function RootMain(props) {
  return (
    <StackMain.Navigator
      initialRouteName={Routes.LOGIN_IN.name}
      screenOptions={{
        headerShown: false,
      }}>
      <StackMain.Screen
        name={Routes.INTRO.name}
        component={Routes.INTRO.path}
      />
      <StackMain.Screen
        name={Routes.LOGIN_IN.name}
        component={Routes.LOGIN_IN.path}
      />
      <StackMain.Screen
        name={Routes.SIGN_UP.name}
        component={Routes.SIGN_UP.path}
      />
      <StackMain.Screen
        name={Routes.FORGOT_PASSWORD.name}
        component={Routes.FORGOT_PASSWORD.path}
      />
      <StackMain.Screen
        name={Routes.RESET_PASSWORD.name}
        component={Routes.RESET_PASSWORD.path}
      />
      <StackMain.Screen name={Routes.TAB.name} component={BottomTabMain} />
      {/** Account flow */}
      <StackMain.Screen
        name={Routes.MY_ACCOUNT.name}
        component={Routes.MY_ACCOUNT.path}
      />
      <StackMain.Screen
        name={Routes.CHANGE_PASSWORD.name}
        component={Routes.CHANGE_PASSWORD.path}
      />
      <StackMain.Screen
        name={Routes.HELP_AND_INFO.name}
        component={Routes.HELP_AND_INFO.path}
      />
      <StackMain.Screen
        name={Routes.CONTACT_US.name}
        component={Routes.CONTACT_US.path}
      />
      <StackMain.Screen
        name={Routes.SETTINGS.name}
        component={Routes.SETTINGS.path}
      />
      <StackMain.Screen
        name={Routes.APPEARANCE.name}
        component={Routes.APPEARANCE.path}
      />
      <StackMain.Screen
        name={Routes.LANGUAGES.name}
        component={Routes.LANGUAGES.path}
      />
      {/** Approved flow */}
      <StackMain.Screen
        name={Routes.APPROVED.name}
        component={Routes.APPROVED.path}
      />
      <StackMain.Screen
        name={Routes.LIST_REQUEST_ASSETS.name}
        component={Routes.LIST_REQUEST_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.ADD_APPROVED_ASSETS.name}
        component={Routes.ADD_APPROVED_ASSETS.path}
      />
      <StackMain.Screen
        name={Routes.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.ADD_APPROVED_LOST_DAMAGED.path}
      />
      <StackMain.Screen
        name={Routes.LIST_REQUEST_HANDLING.name}
        component={Routes.LIST_REQUEST_HANDLING.path}
      />
      {/** Project flow */}
      <StackMain.Screen
        name={Routes.PROJECT.name}
        component={Routes.PROJECT.path}
      />
      <StackMain.Screen
        name={Routes.PROJECT_OVERVIEW.name}
        component={Routes.PROJECT_OVERVIEW.path}
      />
      <StackMain.Screen
        name={Routes.PROJECTS.name}
        component={Routes.PROJECTS.path}
      />
      <StackMain.Screen
        name={Routes.TASKS.name}
        component={Routes.TASKS.path}
      />
      <StackMain.Screen
        name={Routes.TASK_DETAILS.name}
        component={Routes.TASK_DETAILS.path}
      />
      {/** Booking flow */}
      <StackMain.Screen
        name={Routes.BOOKING.name}
        component={Routes.BOOKING.path}
      />
      <StackMain.Screen
        name={Routes.BOOKINGS.name}
        component={Routes.BOOKINGS.path}
      />
      <StackMain.Screen
        name={Routes.MY_BOOKINGS.name}
        component={Routes.MY_BOOKINGS.path}
      />
      <StackMain.Screen
        name={Routes.ADD_BOOKING.name}
        component={Routes.ADD_BOOKING.path}
      />
    </StackMain.Navigator>
  );
}

export default RootMain;
