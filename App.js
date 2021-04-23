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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from "react-native-flash-message";
import '~/utils/language/config-i18n';
/** COMPOENNTS */
import Navigator from '~/navigation/Navigator';
/** REDUX */
import Store from './src/redux/store';
import { colors } from '~/utils/style';

const App = () => {

  const [state, setState] = useState({
    checked: false,
    connected: true,
  });

  /** LIFE CYCLE */
  useEffect(() => {
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
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={colors.PRIMARY}
          />
          <Navigator />
          <FlashMessage position="top" />
        </SafeAreaProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
