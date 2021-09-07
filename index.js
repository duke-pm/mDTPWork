/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import App from './App';
import {name as appName} from './app.json';
// Ignore log notification by message:
Orientation.lockToPortrait();
LogBox.ignoreLogs([
  'Warning:',
  'Non-serializable values were found in the navigation state',
]);
AppRegistry.registerComponent(appName, () => App);
