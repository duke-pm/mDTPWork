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
import {NavigationContainer} from '@react-navigation/native';
import {
  ApplicationProvider,
  IconRegistry,
  Text,
  ModalService,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {StatusBar} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import FlashMessage from 'react-native-flash-message';
import axios from 'axios';
/** COMPONENTS */
import Navigator from '~/navigator/Navigator';
// import Unconnected from '~/screens/connection/Unconnected';
/** COMMON */
import Configs from '~/configs';
import {ThemeContext} from '~/configs/theme-context';
import {colors} from '~/utils/style';
import jwtServiceConfig from '~/services/jwtServiceConfig';
import {getLocalInfo, IS_ANDROID} from '~/utils/helper';
import {AST_DARK_MODE, DARK} from '~/configs/constants';
import {default as mapping} from './assets/themes/mapping.json';
/** REDUX */
import Store from './src/redux/store';

ModalService.setShouldUseTopInsets = true;

const linking = {
  prefixes: Configs.prefixesDeepLink,
  config: {screens: Configs.routePath},
};

const App = () => {
  /** Use states */
  const [state, setState] = useState({
    checked: false,
    connected: true,
  });
  const [themeApp, setThemeApp] = useState('light');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleNetInfo = obj => {
    obj.isConnected ? onReverseAnimate() : onAnimate();
  };

  const toggleTheme = () => {
    const nextTheme = themeApp === 'light' ? 'dark' : 'light';
    setThemeApp(nextTheme);
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
  useEffect(async () => {
    IS_ANDROID && StatusBar.setTranslucent(true);

    /** Check config network */
    setDefaultAxios();
    NetInfo.addEventListener(handleNetInfo);

    /** Check dark mode */
    let astDarkMode = await getLocalInfo(AST_DARK_MODE);
    if (astDarkMode) {
      if (astDarkMode === DARK) {
        toggleTheme();
        /** Set status bar */
        if (IS_ANDROID) {
          StatusBar.setTranslucent(true);
          StatusBar.setBackgroundColor(colors.PRIMARY_DARK, true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (themeApp === DARK) {
      StatusBar.setBarStyle('light-content', true);
    } else {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, [themeApp]);

  /************
   ** RENDER **
   ************/
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{themeApp, toggleTheme}}>
        <ApplicationProvider
          {...eva}
          theme={{...eva[themeApp]}}
          customMapping={mapping}>
          <NavigationContainer
            linking={linking}
            fallback={<Text>Loading</Text>}>
            <Provider store={Store}>
              <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                <Navigator />
                <FlashMessage
                  position="top"
                  statusBarHeight={IS_ANDROID ? StatusBar.currentHeight : 50}
                  floating
                />
                {/* <Unconnected connected={state.connected} /> */}
              </SafeAreaProvider>
            </Provider>
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
