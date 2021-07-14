/**
 ** Name: Root main of App
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {enableScreens} from 'react-native-screens';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import Routes from './Routes';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

/** INIT NAVIGATOR OF APP */
enableScreens(true);
const StackMain = createNativeStackNavigator();
const StackDashboard = createNativeStackNavigator();
const StackAccount = createNativeStackNavigator();
const TabMain = createBottomTabNavigator();

const headerAuthOptions = {headerShown: false};
const commonBottomTabStyles = {backgroundColor: colors.BACKGROUND_HEADER_IOS};

export function RootDashboard(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const headerStyles = {
    backgroundColor: IS_ANDROID
      ? isDark
        ? undefined
        : colors.PRIMARY
      : colors.BACKGROUND_HEADER_IOS,
    blurEffect: isDark ? 'dark' : 'light',
  };

  return (
    <StackDashboard.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      screenOptions={{
        headerTintColor: IS_IOS ? undefined : colors.WHITE,
        headerLargeTitle: true,
        headerLargeTitleHideShadow: true,
        headerTopInsetEnabled: false,
        headerTranslucent: IS_ANDROID ? false : true,
        disableBackButtonMenu: true,
        screenOrientation: 'portrait',
        headerLargeStyle: {backgroundColor: customColors.background},
      }}>
      <StackDashboard.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
        options={Object.assign(
          {title: t('dashboard:title'), headerStyle: headerStyles},
          IS_ANDROID
            ? {
                headerLeft: () => null,
                headerCenter: () => (
                  <CText
                    styles={'colorWhite fontMedium'}
                    label={'dashboard:title'}
                  />
                ),
              }
            : {},
        )}
      />
    </StackDashboard.Navigator>
  );
}

export function RootAccount(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const headerStyles = {
    backgroundColor: IS_ANDROID
      ? isDark
        ? undefined
        : colors.PRIMARY
      : colors.BACKGROUND_HEADER_IOS,
    blurEffect: isDark ? 'dark' : 'light',
  };

  return (
    <StackAccount.Navigator
      initialRouteName={Routes.MAIN.ACCOUNT.name}
      screenOptions={{
        headerTintColor: IS_IOS ? undefined : colors.WHITE,
        headerLargeTitle: true,
        headerLargeTitleHideShadow: true,
        headerTopInsetEnabled: false,
        headerTranslucent: IS_ANDROID ? false : true,
        disableBackButtonMenu: true,
        screenOrientation: 'portrait',
        headerLargeStyle: {backgroundColor: customColors.background},
      }}>
      <StackAccount.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={Routes.MAIN.ACCOUNT.path}
        options={Object.assign(
          {title: t('account:title'), headerStyle: headerStyles},
          IS_ANDROID
            ? {
                headerLeft: () => null,
                headerCenter: () => (
                  <CText
                    styles={'colorWhite fontMedium'}
                    label={'account:title'}
                  />
                ),
              }
            : {},
        )}
      />
    </StackAccount.Navigator>
  );
}

export function RootTab(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  return (
    <TabMain.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      backBehavior={'history'}
      headerMode={'none'}
      lazy
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          switch (route.name) {
            case Routes.MAIN.ACCOUNT.name:
              iconName = 'person';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: IS_IOS ? customColors.blue : customColors.primary,
        inactiveTintColor: customColors.text,
        keyboardHidesTabBar: true,
      }}
      tabBar={
        IS_IOS
          ? propsTab => (
              <BlurView
                style={[cStyles.abs, cStyles.insetX0, cStyles.bottom0]}
                blurType={isDark ? 'dark' : 'light'}
                blurAmount={30}>
                <BottomTabBar {...propsTab} style={commonBottomTabStyles} />
              </BlurView>
            )
          : undefined
      }>
      <TabMain.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={RootDashboard}
        options={{
          title: t('dashboard:title'),
        }}
      />
      <TabMain.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={RootAccount}
        options={{
          title: t('account:title'),
        }}
      />
    </TabMain.Navigator>
  );
}

export function RootMain(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const headerStyles = {
    backgroundColor: IS_ANDROID
      ? isDark
        ? undefined
        : colors.PRIMARY
      : colors.BACKGROUND_HEADER_IOS,
    blurEffect: isDark ? 'dark' : 'light',
  };
  const headerModalStyles = {
    backgroundColor: isDark
      ? undefined
      : IS_ANDROID
      ? colors.PRIMARY
      : colors.WHITE,
  };

  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      screenOptions={{
        headerTintColor: IS_IOS ? undefined : colors.WHITE,
        headerLargeTitle: true,
        headerLargeTitleHideShadow: true,
        headerTopInsetEnabled: false,
        headerTranslucent: IS_ANDROID ? false : true,
        disableBackButtonMenu: true,
        screenOrientation: 'portrait',
        headerLargeStyle: {backgroundColor: customColors.background},
      }}>
      <StackMain.Screen
        name={Routes.AUTHENTICATION.SIGN_IN.name}
        component={Routes.AUTHENTICATION.SIGN_IN.path}
        options={headerAuthOptions}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.FORGOT_PASSWORD.name}
        component={Routes.AUTHENTICATION.FORGOT_PASSWORD.path}
        options={headerAuthOptions}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.CHANGE_PASSWORD.name}
        component={Routes.AUTHENTICATION.CHANGE_PASSWORD.path}
        options={headerAuthOptions}
      />
      <StackMain.Screen
        name={Routes.ROOT_TAB.name}
        component={RootTab}
        options={headerAuthOptions}
      />
      <StackMain.Screen
        name={Routes.MAIN.SALES_VISIT.name}
        component={Routes.MAIN.SALES_VISIT.path}
        options={{
          title: t('sales_visit:title'),
          headerStyle: headerStyles,
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_MANAGEMENT.name}
        component={Routes.MAIN.PROJECT_MANAGEMENT.path}
        options={{
          title: t('project_management:title'),
          headerBackTitle: t('common:back'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_DETAIL.name}
        component={Routes.MAIN.PROJECT_DETAIL.path}
        options={{
          headerBackTitle: t('project_management:back_title'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.name}
        component={Routes.MAIN.TASK_DETAIL.path}
        options={{
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_FILTER.name}
        component={Routes.MAIN.PROJECT_FILTER.path}
        options={{
          title: t('project_management:filter'),
          stackPresentation: 'modal',
          headerStyle: headerModalStyles,
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.path}
        options={{
          title: t('project_management:title_activity'),
          headerLargeTitle: false,
          headerTranslucent: false,
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.path}
        options={{
          title: t('project_management:title_watcher'),
          headerLargeTitle: false,
          headerTranslucent: false,
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.name}
        component={Routes.MAIN.APPROVED.path}
        options={{
          title: t('approved:assets'),
          headerBackTitle: t('common:back'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.path}
        options={{
          title: t('list_request_assets:title'),
          headerStyle: headerModalStyles,
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.path}
        options={{
          title: t('list_request_assets_handling:title'),
          headerStyle: headerStyles,
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS.name}
        component={Routes.MAIN.APPROVED_ASSETS.path}
        options={{
          title: t('list_request_assets:title'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_DAMAGE.name}
        component={Routes.MAIN.APPROVED_ASSETS_DAMAGE.path}
        options={{
          title: t('list_request_assets:title'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_LOST.name}
        component={Routes.MAIN.APPROVED_ASSETS_LOST.path}
        options={{
          title: t('list_request_assets:title'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_ASSETS.name}
        component={Routes.MAIN.ADD_APPROVED_ASSETS.path}
        options={{
          headerStyle: headerStyles,
          headerBackTitle: t('common:back'),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
        options={{
          headerStyle: headerStyles,
          headerBackTitle: t('common:back'),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.HELP_AND_INFO.name}
        component={Routes.MAIN.HELP_AND_INFO.path}
        options={{
          title: t('help_and_info:title'),
          headerBackTitle: t('common:back'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.CHANGE_PASSWORD.name}
        component={Routes.MAIN.CHANGE_PASSWORD.path}
        options={{
          title: t('change_password:title'),
          headerBackTitle: t('common:back'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.CONTACT_US.name}
        component={Routes.MAIN.CONTACT_US.path}
        options={{
          title: t('contact_us:title'),
          headerStyle: headerStyles,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.SETTINGS.name}
        component={Routes.MAIN.SETTINGS.path}
        options={{
          title: t('settings:title'),
          headerBackTitle: t('common:back'),
          headerStyle: headerStyles,
        }}
      />
    </StackMain.Navigator>
  );
}

export default RootMain;
