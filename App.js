/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: App Main
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import '~/utils/language/config-i18n';
import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import axios from 'axios';
/** COMPOENNTS */
import Navigator from '~/navigation/Navigator';
import Unconnected from '~/screens/connection/Unconnected';
/** COMMON */
import {colors} from '~/utils/style';
import jwtServiceConfig from '~/services/jwtServiceConfig';
import {IS_ANDROID} from '~/utils/helper';
/** REDUX */
import Store from './src/redux/store';

const App = () => {
  const [state, setState] = useState({
    checked: false,
    connected: true,
  });

  /** HANDLE FUNC */
  const handleNetInfo = obj => {
    obj.isConnected ? onReverseAnimate() : onAnimate();
  };

  /** FUNC */
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

  /** LIFE CYCLE */
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (isDarkMode) {
      IS_ANDROID && StatusBar.setBackgroundColor(DarkTheme.colors.background);
    } else {
      IS_ANDROID && StatusBar.setBackgroundColor(colors.PRIMARY);
    }
    setDefaultAxios();
    NetInfo.addEventListener(handleNetInfo);
  }, []);

  /** RENDER */
  const MyDarkTheme = {
    dark: true,
    colors: {
      ...DarkTheme.colors,
    },
    customColors: {
      ...DarkTheme.colors,
      primary: colors.SECONDARY,
      secondary: colors.SECONDARY,
      group: colors.GRAY_900,
      header: colors.BACKGROUND_HEADER_DARK,
      combobox: colors.TRANSPARENT,
      icon: colors.WHITE,
      text: colors.WHITE,
      textDisable: colors.GRAY_700,
      card: colors.GRAY_900,
      cardDisable: colors.BACKGROUND_INPUT_FOCUS,
      tab: colors.GRAY_900,
      tabActive: colors.GRAY_700,
      listItem: colors.GRAY_900,
      statusNew: colors.STATUS_NEW_DARK,
      stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE_DARK,
      statusSchedule: colors.STATUS_SCHEDULE_DARK,
      statusInProgress: colors.STATUS_IN_PROGRESS_DARK,
      statusClose: colors.STATUS_CLOSE_DARK,
      statusOnHold: colors.STATUS_ON_HOLD_DARK,
      statusReject: colors.STATUS_REJECT_DARK,
      red: colors.RED_DARK,
      orange: colors.ORANGE_DARK,
      yellow: colors.YELLOW_DARK,
      green: colors.GREEN_DARK,
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
      primary: colors.PRIMARY,
      secondary: colors.SECONDARY,
      background: colors.BACKGROUND_MAIN,
      group: colors.BACKGROUND_CARD,
      combobox: colors.WHITE,
      icon: colors.ICON_BASE,
      text: colors.TEXT_BASE,
      textDisable: colors.GRAY_700,
      card: colors.BACKGROUND_CARD,
      cardDisable: colors.GRAY_200,
      tab: colors.GRAY_200,
      tabActive: colors.WHITE,
      listItem: colors.WHITE,
      statusNew: colors.STATUS_NEW,
      stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE,
      statusSchedule: colors.STATUS_SCHEDULE,
      statusInProgress: colors.STATUS_IN_PROGRESS,
      statusClose: colors.STATUS_CLOSE,
      statusOnHold: colors.STATUS_ON_HOLD,
      statusReject: colors.STATUS_REJECT,
      red: colors.RED,
      orange: colors.ORANGE,
      yellow: colors.YELLOW,
      green: colors.GREEN,
      teal: colors.TEAL,
      blue: colors.BLUE,
      indigo: colors.INDIGO,
      purple: colors.PURPLE,
      pink: colors.PINK,
    },
  };
  return (
    <AppearanceProvider>
      <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyDefaultTheme}>
        <Provider store={Store}>
          <SafeAreaProvider>
            <StatusBar barStyle={'light-content'} />
            <Navigator />
            <FlashMessage position="top" />
            <Unconnected connected={state.connected} />
          </SafeAreaProvider>
        </Provider>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
