/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: App Main
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import '~/utils/language/config-i18n';
/** COMPOENNTS */
import Navigator from '~/navigation/Navigator';
import Unconnected from '~/screens/connection/Unconnected';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import jwtServiceConfig from '~/services/jwtServiceConfig';
/** REDUX */
import Store from './src/redux/store';

const App = () => {
  const [state, setState] = useState({
    checked: false,
    connected: true,
  });

  const onCheckConnection = () => {
    setState({
      ...state,
      checked: true,
    });
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
      StatusBar.setBackgroundColor(DarkTheme.colors.background);
    } else {
      StatusBar.setBackgroundColor(colors.PRIMARY);
    }
    setDefaultAxios();
    NetInfo.addEventListener(stateConnect => {
      const {isConnected} = stateConnect;
      if (!isConnected) {
        setState({
          ...state,
          connected: false,
        });
      }
      if (state.checked && isConnected) {
        setState({
          connected: true,
          checked: false,
        });
      }
    });
  }, []);

  /** RENDER */
  const MyDarkTheme = {
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: colors.SECONDARY,
      icon: colors.WHITE,
      text: colors.WHITE,
      textDisable: colors.GRAY_700,
      card: colors.GRAY_900,
    },
    customColors: {
      ...DarkTheme.colors,
      primary: colors.SECONDARY,
      header: colors.BACKGROUND_HEADER_DARK,
      combobox: colors.TRANSPARENT,
      icon: colors.WHITE,
      text: colors.WHITE,
      textDisable: colors.GRAY_700,
      card: colors.GRAY_900,
      cardDisable: colors.BACKGROUND_INPUT_FOCUS,
      listItem: colors.BACKGROUND_LIST_ITEM_DARK,
      statusNew: colors.STATUS_NEW_DARK,
      stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE_DARK,
      statusSchedule: colors.STATUS_SCHEDULE_DARK,
      statusInProcess: colors.STATUS_IN_PROCESS_DARK,
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
      primary: colors.PRIMARY,
      background: colors.BACKGROUND_MAIN,
      icon: colors.ICON_BASE,
      text: colors.TEXT_BASE,
      textDisable: colors.GRAY_700,
    },
    customColors: {
      ...DefaultTheme.colors,
      primary: colors.PRIMARY,
      background: colors.BACKGROUND_MAIN,
      combobox: colors.WHITE,
      icon: colors.ICON_BASE,
      text: colors.TEXT_BASE,
      textDisable: colors.GRAY_700,
      card: colors.BACKGROUND_CARD,
      cardDisable: colors.GRAY_200,
      listItem: colors.BACKGROUND_LIST_ITEM,
      statusNew: colors.STATUS_NEW,
      stausToBeSchedule: colors.STATUS_TO_BE_SCHEDULE,
      statusSchedule: colors.STATUS_SCHEDULE,
      statusInProcess: colors.STATUS_IN_PROCESS,
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
            {!state.connected ? (
              <Unconnected onTryAgain={onCheckConnection} />
            ) : (
              <Navigator />
            )}

            <FlashMessage position="top" />
          </SafeAreaProvider>
        </Provider>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
