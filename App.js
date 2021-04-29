/**
 ** Name: App Main
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme
} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import '~/utils/language/config-i18n';
/** COMPOENNTS */
import Navigator from '~/navigation/Navigator';
import Unconnected from '~/screens/connection/Unconnected';
/** COMMON */
import { colors } from '~/utils/style';
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
    })
  };

  const setDefaultAxios = () => {
    axios.defaults.baseURL = jwtServiceConfig.baseURL;
    axios.defaults.timeout = 30000;
    axios.defaults.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    axios.defaults.responseType = 'json';
  }

  /** LIFE CYCLE */
  useEffect(() => {
    setDefaultAxios();
    NetInfo.addEventListener(stateConnect => {
      const { isConnected } = stateConnect;
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
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Provider store={Store}>
        <SafeAreaProvider>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={colors.PRIMARY}
          />

          {!state.connected
            ? <Unconnected onTryAgain={onCheckConnection} />
            : <Navigator />
          }

          <FlashMessage position="top" />
        </SafeAreaProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
