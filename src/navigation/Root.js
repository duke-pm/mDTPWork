/* eslint-disable react-hooks/rules-of-hooks */
/**
 ** Name: Root
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Root.js
 **/
import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {enableScreens} from 'react-native-screens';
import {BlurView} from '@react-native-community/blur';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import Routes from './Routes';
import {fS, IS_ANDROID, IS_IOS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

/** INIT NAVIGATOR OF APP */
enableScreens(true);
const StackMain = createNativeStackNavigator();
const StackDashboard = createNativeStackNavigator();
const StackAccount = createNativeStackNavigator();
const TabMain = createBottomTabNavigator();

export function RootDashboard(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  return (
    <StackDashboard.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark
            ? undefined
            : IS_ANDROID
            ? colors.PRIMARY
            : undefined,
        },
        headerTintColor: IS_IOS ? undefined : colors.WHITE,
        headerBackTitleStyle: {
          fontSize: fS(16),
          fontWeight: cStyles.fontRegular.fontWeight,
        },
        headerTitleStyle: {
          color: isDark
            ? colors.WHITE
            : IS_ANDROID
            ? colors.WHITE
            : colors.BLACK,
          fontSize: fS(16),
          fontWeight: cStyles.fontMedium.fontWeight,
        },
        headerLargeTitle: true,
        headerLargeTitleHideShadow: true,
        headerLargeStyle: {backgroundColor: customColors.background},
        headerLargeTitleStyle: {
          color: isDark
            ? colors.WHITE
            : IS_ANDROID
            ? colors.WHITE
            : colors.BLACK,
          fontSize: fS(28),
          fontWeight: cStyles.fontBold.fontWeight,
        },
        headerTopInsetEnabled: false,
        disableBackButtonMenu: true,
        headerTranslucent: IS_ANDROID ? false : true,
        screenOrientation: 'portrait',
      }}>
      <StackDashboard.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
        options={Object.assign(
          {
            title: t('dashboard:title'),
          },
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
      <StackMain.Screen
        name={Routes.MAIN.SALES_VISIT.name}
        component={Routes.MAIN.SALES_VISIT.path}
        options={{
          title: t('sales_visit:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.PROJECT_MANAGEMENT.name}
        component={Routes.MAIN.PROJECT_MANAGEMENT.path}
        options={{
          title: t('project_management:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.PROJECT_DETAIL.name}
        component={Routes.MAIN.PROJECT_DETAIL.path}
        options={{
          headerBackTitle: t('common:back'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.TASK_DETAIL.name}
        component={Routes.MAIN.TASK_DETAIL.path}
        options={{
          title: '',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.PROJECT_FILTER.name}
        component={Routes.MAIN.PROJECT_FILTER.path}
        options={{
          title: t('project_management:filter'),
          stackPresentation: 'modal',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.path}
        options={{
          title: t('project_management:title_activity'),
          stackPresentation: 'modal',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.path}
        options={{
          title: t('project_management:title_watcher'),
          stackPresentation: 'modal',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED.name}
        component={Routes.MAIN.APPROVED.path}
        options={{
          title: t('approved:assets'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.path}
        options={{
          title: t('list_request_assets:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.path}
        options={{
          title: t('list_request_assets_handling:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED_ASSETS.name}
        component={Routes.MAIN.APPROVED_ASSETS.path}
        options={{
          title: t('list_request_assets:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED_ASSETS_DAMAGE.name}
        component={Routes.MAIN.APPROVED_ASSETS_DAMAGE.path}
        options={{
          title: t('list_request_assets:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.APPROVED_ASSETS_LOST.name}
        component={Routes.MAIN.APPROVED_ASSETS_LOST.path}
        options={{
          title: t('list_request_assets:title'),
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.ADD_APPROVED_ASSETS.name}
        component={Routes.MAIN.ADD_APPROVED_ASSETS.path}
        options={{
          stackPresentation: 'modal',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackDashboard.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
        options={{
          stackPresentation: 'modal',
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
    </StackDashboard.Navigator>
  );
}

export function RootAccount(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  return (
    <StackAccount.Navigator
      initialRouteName={Routes.MAIN.ACCOUNT.name}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark
            ? undefined
            : IS_ANDROID
            ? colors.PRIMARY
            : undefined,
        },
        headerTintColor: IS_IOS ? undefined : colors.WHITE,
        headerBackTitleStyle: {
          fontSize: fS(16),
          fontWeight: cStyles.fontRegular.fontWeight,
        },
        headerTitleStyle: {
          color: isDark
            ? colors.WHITE
            : IS_ANDROID
            ? colors.WHITE
            : colors.BLACK,
          fontSize: fS(16),
          fontWeight: cStyles.fontMedium.fontWeight,
        },
        headerLargeTitle: true,
        headerLargeTitleHideShadow: true,
        headerLargeStyle: {backgroundColor: customColors.background},
        headerLargeTitleStyle: {
          color: isDark
            ? colors.WHITE
            : IS_ANDROID
            ? colors.WHITE
            : colors.BLACK,
          fontSize: fS(28),
          fontWeight: cStyles.fontBold.fontWeight,
        },
        headerTopInsetEnabled: false,
        disableBackButtonMenu: true,
        headerTranslucent: IS_ANDROID ? false : true,
        screenOrientation: 'portrait',
      }}>
      <StackAccount.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={Routes.MAIN.ACCOUNT.path}
        options={Object.assign(
          {
            title: t('account:title'),
          },
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
      <StackMain.Screen
        name={Routes.MAIN.HELP_AND_INFO.name}
        component={Routes.MAIN.HELP_AND_INFO.path}
        options={{
          title: t('help_and_info:title'),
        }}
      />
      <StackAccount.Screen
        name={Routes.MAIN.CHANGE_PASSWORD.name}
        component={Routes.MAIN.CHANGE_PASSWORD.path}
        options={{
          title: t('change_password:title'),
          headerLargeTitle: false,
          headerTranslucent: false,
        }}
      />
      <StackAccount.Screen
        name={Routes.MAIN.CONTACT_US.name}
        component={Routes.MAIN.CONTACT_US.path}
        options={{
          headerBackTitle: t('common:back'),
          title: t('contact_us:title'),
        }}
      />
      <StackAccount.Screen
        name={Routes.MAIN.SETTINGS.name}
        component={Routes.MAIN.SETTINGS.path}
        options={{
          title: t('settings:title'),
        }}
      />
    </StackAccount.Navigator>
  );
}

export function RootTab() {
  const {customColors} = useTheme();
  const {t} = useTranslation();
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
          ? props => (
              <BlurView
                style={[cStyles.abs, cStyles.insetX0, cStyles.bottom0]}
                blurType={isDark ? 'dark' : 'xlight'}
                blurAmount={10}>
                <BottomTabBar
                  {...props}
                  style={{backgroundColor: colors.TRANSPARENT}}
                />
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
  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      screenOptions={{
        headerShown: false,
      }}>
      <StackMain.Screen
        name={Routes.AUTHENTICATION.SIGN_IN.name}
        component={Routes.AUTHENTICATION.SIGN_IN.path}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.FORGOT_PASSWORD.name}
        component={Routes.AUTHENTICATION.FORGOT_PASSWORD.path}
      />
      <StackMain.Screen
        name={Routes.AUTHENTICATION.CHANGE_PASSWORD.name}
        component={Routes.AUTHENTICATION.CHANGE_PASSWORD.path}
      />
      <StackMain.Screen name={Routes.ROOT_TAB.name} component={RootTab} />
    </StackMain.Navigator>
  );
}

export default RootMain;
