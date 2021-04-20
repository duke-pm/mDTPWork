/**
 ** Name: App Main
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
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
import '~/utils/language/config-i18n';
/** COMPOENNTS */
import Navigator from '~/navigation/Navigator';

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
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Navigator />
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
