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
      primary: colors.PRIMARY,
      icon: colors.WHITE,
      text: colors.WHITE,
      textDisable: colors.GRAY_700,
      card: colors.GRAY_900,
    },
    customColors: {
      ...DarkTheme.colors,
      primary: colors.PRIMARY,
      header: colors.BACKGROUND_HEADER_DARK,
      combobox: colors.TRANSPARENT,
      icon: colors.WHITE,
      text: colors.WHITE,
      textDisable: colors.GRAY_700,
      card: colors.GRAY_900,
      listItem: colors.BACKGROUND_LIST_ITEM_DARK,
      shadowListItem: {},
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
      card: colors.BACKGROUND_CARD,
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
      listItem: colors.BACKGROUND_LIST_ITEM,
      shadowListItem: cStyles.shadowListItem,
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
