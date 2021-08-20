/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: App Main
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import '~/utils/language/config-i18n';
import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {StatusBar, Text} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import axios from 'axios';
/** COMPONENTS */
import Navigator from '~/navigation/Navigator';
import Unconnected from '~/screens/connection/Unconnected';
/** COMMON */
import Configs from '~/config';
import {colors} from '~/utils/style';
import jwtServiceConfig from '~/services/jwtServiceConfig';
import {IS_IOS} from '~/utils/helper';
/** REDUX */
import Store from './src/redux/store';

const MyDarkTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
  },
  customColors: {
    ...DarkTheme.colors,
    backgroundActivity: colors.BLACK,
    primary: IS_IOS ? colors.BLUE_DARK : colors.SECONDARY,
    secondary: colors.SECONDARY,
    group: colors.GRAY_900,
    header: colors.BACKGROUND_HEADER_DARK,
    combobox: colors.TRANSPARENT,
    icon: colors.WHITE,
    textInput: colors.GRAY_860,
    text: colors.WHITE,
    textDisable: colors.GRAY_700,
    card: colors.GRAY_900,
    cardDisable: colors.BACKGROUND_INPUT_FOCUS,
    cardHolder: colors.GRAY_800,
    tab: colors.GRAY_900,
    tabActive: colors.GRAY_700,
    listItem: colors.GRAY_900,
    statusNew: colors.STATUS_NEW_DARK,
    stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE_DARK,
    statusScheduled: colors.STATUS_SCHEDULE_DARK,
    statusInProgress: colors.STATUS_IN_PROGRESS_DARK,
    statusClosed: colors.STATUS_CLOSE_DARK,
    statusOnHold: colors.STATUS_ON_HOLD_DARK,
    statusRejected: colors.STATUS_REJECT_DARK,
    typeMilestone: colors.TYPE_MILESTONE_DARK,
    typePhase: colors.TYPE_PHASE_DARK,
    typeTask: colors.TYPE_TASK_DARK,
    red: colors.RED_DARK,
    orange: colors.ORANGE_DARK,
    yellow: colors.YELLOW_DARK,
    green: colors.GREEN_DARK,
    green2: colors.GREEN_2_DARK,
    teal: colors.TEAL_DARK,
    blue: colors.BLUE_DARK,
    indigo: colors.INDIGO_DARK,
    purple: colors.PURPLE_DARK,
    pink: colors.PINK_DARK,
  },
};
const MyDefaultTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
  },
  customColors: {
    ...DefaultTheme.colors,
    backgroundActivity: colors.WHITE,
    header: colors.PRIMARY,
    primary: IS_IOS ? colors.BLUE : colors.PRIMARY,
    secondary: colors.SECONDARY,
    background: colors.BACKGROUND_MAIN,
    group: colors.BACKGROUND_CARD,
    combobox: colors.WHITE,
    icon: colors.ICON_BASE,
    textInput: colors.GRAY_100,
    text: colors.TEXT_BASE,
    textDisable: colors.GRAY_700,
    card: colors.BACKGROUND_CARD,
    cardDisable: colors.GRAY_200,
    cardHolder: colors.GRAY_300,
    tab: colors.GRAY_600,
    tabActive: colors.WHITE,
    listItem: colors.WHITE,
    statusNew: colors.STATUS_NEW,
    stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE,
    statusScheduled: colors.STATUS_SCHEDULE,
    statusInProgress: colors.STATUS_IN_PROGRESS,
    statusClosed: colors.STATUS_CLOSE,
    statusOnHold: colors.STATUS_ON_HOLD,
    statusRejected: colors.STATUS_REJECT,
    typeMilestone: colors.TYPE_MILESTONE,
    typePhase: colors.TYPE_PHASE,
    typeTask: colors.TYPE_TASK,
    red: colors.RED,
    orange: colors.ORANGE,
    yellow: colors.YELLOW,
    green: colors.GREEN,
    green2: colors.GREEN_2,
    teal: colors.TEAL,
    blue: colors.BLUE,
    indigo: colors.INDIGO,
    purple: colors.PURPLE,
    pink: colors.PINK,
  },
};
const linking = {
  prefixes: __DEV__ ? Configs.prefixesDev : Configs.prefixesProd,
  config: {screens: Configs.routePath},
};

const App = () => {
  /** Use states */
  const [state, setState] = useState({
    checked: false,
    connected: true,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleNetInfo = obj => {
    obj.isConnected ? onReverseAnimate() : onAnimate();
  };

  /**********
   ** FUNC **
   **********/
  const onAnimate = () => {
    setState({...state, connected: false});
  };

  const onReverseAnimate = () => {
    setState({...state, connected: true});
  };

  const setDefaultAxios = () => {
    axios.defaults.baseURL = jwtServiceConfig.baseURL;
    axios.defaults.timeout = 30000;
    axios.defaults.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    axios.defaults.responseType = 'json';
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    setDefaultAxios();
    NetInfo.addEventListener(handleNetInfo);
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor(colors.TRANSPARENT, true);
  }, []);

  const isDark = useColorScheme() === 'dark';
  useEffect(() => {
    if (isDark) {
      StatusBar.setBarStyle('light-content', true);
    } else {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, [isDark]);

  /************
   ** RENDER **
   ************/
  return (
    <AppearanceProvider>
      <NavigationContainer
        independent
        theme={isDark ? MyDarkTheme : MyDefaultTheme}
        linking={linking}
        fallback={<Text>Loading</Text>}>
        <Provider store={Store}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <Navigator />
            <FlashMessage position={'top'} />
            <Unconnected connected={state.connected} />
          </SafeAreaProvider>
        </Provider>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
