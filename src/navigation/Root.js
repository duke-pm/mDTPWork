/**
 ** Name: Root
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import Routes from './Routes';
import {IS_ANDROID, scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

/** INIT NAVIGATOR OF APP */
const StackMain = createStackNavigator();
const TabMain = createBottomTabNavigator();

export function RootTab(props) {
  const {customColors} = useTheme();

  return (
    <TabMain.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      backBehavior={'history'}
      headerMode={'none'}
      lazy={true}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          switch (route.name) {
            case Routes.MAIN.ACCOUNT.name:
              iconName = 'user';
              break;
          }
          return <Icon name={iconName} size={scalePx(2.8)} color={color} />;
        },
        tabBarLabel: ({focused, color}) => {
          let label = 'dashboard:title';
          switch (route.name) {
            case Routes.MAIN.ACCOUNT.name:
              label = 'account:title';
              break;
          }
          return (
            <CText
              customStyles={[
                cStyles.textMeta,
                focused && cStyles.fontBold,
                {color: color, fontSize: scalePx(1.7)},
              ]}
              label={label}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.SECONDARY,
        inactiveTintColor: customColors.icon,
        keyboardHidesTabBar: true,
      }}>
      <TabMain.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
      />
      <TabMain.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={Routes.MAIN.ACCOUNT.path}
      />
    </TabMain.Navigator>
  );
}

export function RootMain(props) {
  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      screenOptions={{
        headerShown: false,
        ...(IS_ANDROID
          ? TransitionPresets.SlideFromRightIOS
          : TransitionPresets.DefaultTransition),
      }}>
      <StackMain.Screen
        name={Routes.AUTHENTICATION.SIGN_IN.name}
        component={Routes.AUTHENTICATION.SIGN_IN.path}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.FORGOT_PASSWORD.name}
        component={Routes.AUTHENTICATION.FORGOT_PASSWORD.path}
      />
      <StackMain.Screen name={Routes.ROOT_TAB.name} component={RootTab} />
      <StackMain.Screen
        name={Routes.MAIN.HELP_AND_INFO.name}
        component={Routes.MAIN.HELP_AND_INFO.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.CONTACT_US.name}
        component={Routes.MAIN.CONTACT_US.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.SETTINGS.name}
        component={Routes.MAIN.SETTINGS.path}
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
          ...(IS_ANDROID
            ? TransitionPresets.FadeFromBottomAndroid
            : TransitionPresets.ModalTransition),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
        options={{
          ...(IS_ANDROID
            ? TransitionPresets.FadeFromBottomAndroid
            : TransitionPresets.ModalTransition),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_MANAGEMENT.name}
        component={Routes.MAIN.PROJECT_MANAGEMENT.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_DETAIL.name}
        component={Routes.MAIN.PROJECT_DETAIL.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_FILTER.name}
        component={Routes.MAIN.PROJECT_FILTER.path}
        options={{
          ...(IS_ANDROID
            ? TransitionPresets.FadeFromBottomAndroid
            : TransitionPresets.ModalTransition),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.name}
        component={Routes.MAIN.TASK_DETAIL.path}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.path}
        options={{
          ...(IS_ANDROID
            ? TransitionPresets.FadeFromBottomAndroid
            : TransitionPresets.ModalTransition),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.path}
        options={{
          ...(IS_ANDROID
            ? TransitionPresets.FadeFromBottomAndroid
            : TransitionPresets.ModalTransition),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.SALES_VISIT.name}
        component={Routes.MAIN.SALES_VISIT.path}
      />
    </StackMain.Navigator>
  );
}

export default RootMain;
