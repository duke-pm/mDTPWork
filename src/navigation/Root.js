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
/** COMMON */
import Routes from './Routes';
import {IS_IOS} from '~/utils/helper';
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
  return (
    <StackDashboard.Navigator
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      screenOptions={{
        headerShown: false,
      }}>
      <StackDashboard.Screen
        name={Routes.MAIN.DASHBOARD.name}
        component={Routes.MAIN.DASHBOARD.path}
      />
    </StackDashboard.Navigator>
  );
}

export function RootAccount(props) {
  return (
    <StackAccount.Navigator
      initialRouteName={Routes.MAIN.ACCOUNT.name}
      screenOptions={{
        headerShown: false,
      }}>
      <StackAccount.Screen
        name={Routes.MAIN.ACCOUNT.name}
        component={Routes.MAIN.ACCOUNT.path}
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
      lazy
      initialRouteName={Routes.MAIN.DASHBOARD.name}
      backBehavior={'history'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = focused ? 'home' : 'home-outline';
          switch (route.name) {
            case Routes.MAIN.ACCOUNT.name:
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: customColors.primary,
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

  return (
    <StackMain.Navigator
      initialRouteName={Routes.AUTHENTICATION.SIGN_IN.name}
      screenOptions={{
        headerTitleStyle: {
          color: customColors.text,
          fontSize: cStyles.textSubheadline.fontSize,
          fontWeight: cStyles.fontBold.fontWeight,
        },
        headerTopInsetEnabled: true,
        headerLargeTitle: false,
        disableBackButtonMenu: true,
        headerBackTitleVisible: false,
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

      {/** ACCOUNT */}
      <StackMain.Screen
        name={Routes.MAIN.MY_ACCOUNT.name}
        component={Routes.MAIN.MY_ACCOUNT.path}
        options={{
          title: t('my_account:title'),
          headerTintColor: colors.WHITE,
          headerTranslucent: true,
          headerHideShadow: true,
          headerTitleStyle: {color: colors.WHITE},
          headerStyle: {
            backgroundColor: colors.TRANSPARENT,
          },
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.HELP_AND_INFO.name}
        component={Routes.MAIN.HELP_AND_INFO.path}
        options={{
          title: t('help_and_info:title'),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.CHANGE_PASSWORD.name}
        component={Routes.MAIN.CHANGE_PASSWORD.path}
        options={{
          title: t('change_password:title'),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.CONTACT_US.name}
        component={Routes.MAIN.CONTACT_US.path}
        options={{
          title: t('contact_us:title'),
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.SETTINGS.name}
        component={Routes.MAIN.SETTINGS.path}
        options={{
          title: t('settings:title'),
        }}
      />

      {/** PROJECT MANAGEMENT */}
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_MANAGEMENT.name}
        component={Routes.MAIN.PROJECT_MANAGEMENT.path}
        options={{
          title: t('project_management:main_title'),
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_OVERVIEW.name}
        component={Routes.MAIN.PROJECT_OVERVIEW.path}
        options={{
          title: t('project_overview:title'),
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT.name}
        component={Routes.MAIN.PROJECT.path}
        options={{
          title: t('project_management:title'),
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_DETAIL.name}
        component={Routes.MAIN.PROJECT_DETAIL.path}
        options={{
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.name}
        component={Routes.MAIN.TASK_DETAIL.path}
        options={{
          title: '',
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_OVERVIEW_FILTER.name}
        component={Routes.MAIN.PROJECT_OVERVIEW_FILTER.path}
        options={{
          title: t('common:filter'),
          stackPresentation: 'modal',
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.PROJECT_FILTER.name}
        component={Routes.MAIN.PROJECT_FILTER.path}
        options={{
          title: t('common:filter'),
          stackPresentation: 'modal',
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_ACTIVITIES.path}
        options={{
          title: t('project_management:title_activity'),
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.name}
        component={Routes.MAIN.TASK_DETAIL.childrens.TASK_WATCHERS.path}
        options={{
          title: t('project_management:title_watcher'),
          headerStyle: {backgroundColor: customColors.projectHeader},
          headerTintColor: customColors.text,
        }}
      />

      {/** APPROVED ASSETS */}
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.name}
        component={Routes.MAIN.APPROVED.path}
        options={{
          title: t('approved:assets'),
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_ASSETS.path}
        options={{
          title: t('list_request_assets:title'),
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.name}
        component={Routes.MAIN.APPROVED.childrens.LIST_REQUEST_HANDLING.path}
        options={{
          title: t('list_request_assets_handling:title'),
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS.name}
        component={Routes.MAIN.APPROVED_ASSETS.path}
        options={{
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_DAMAGE.name}
        component={Routes.MAIN.APPROVED_ASSETS_DAMAGE.path}
        options={{
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.APPROVED_ASSETS_LOST.name}
        component={Routes.MAIN.APPROVED_ASSETS_LOST.path}
        options={{
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_ASSETS.name}
        component={Routes.MAIN.ADD_APPROVED_ASSETS.path}
        options={{
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name}
        component={Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.path}
        options={{
          headerStyle: {backgroundColor: customColors.approvedHeader},
          headerTintColor: customColors.text,
        }}
      />

      {/** SALES VISIT */}
      <StackMain.Screen
        name={Routes.MAIN.SALES_VISIT.name}
        component={Routes.MAIN.SALES_VISIT.path}
        options={{
          title: t('sales_visit:title'),
        }}
      />

      {/** BOOKING */}
      <StackMain.Screen
        name={Routes.MAIN.BOOKING_MANAGEMENT.name}
        component={Routes.MAIN.BOOKING_MANAGEMENT.path}
        options={{
          title: t('booking_management:title'),
          headerStyle: {backgroundColor: customColors.bookingHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.BOOKINGS.name}
        component={Routes.MAIN.BOOKINGS.path}
        options={{
          title: t('bookings:title'),
          headerStyle: {backgroundColor: customColors.bookingHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.MY_BOOKINGS.name}
        component={Routes.MAIN.MY_BOOKINGS.path}
        options={{
          title: t('my_bookings:title'),
          headerStyle: {backgroundColor: customColors.bookingHeader},
          headerTintColor: customColors.text,
        }}
      />
      <StackMain.Screen
        name={Routes.MAIN.ADD_BOOKING.name}
        component={Routes.MAIN.ADD_BOOKING.path}
        options={{
          title: t('add_booking:title'),
          headerStyle: {backgroundColor: customColors.bookingHeader},
          headerTintColor: customColors.text,
        }}
      />
    </StackMain.Navigator>
  );
}

export default RootMain;
