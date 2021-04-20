/**
 ** Name: App Main
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of App.js
 **/
import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>

    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
