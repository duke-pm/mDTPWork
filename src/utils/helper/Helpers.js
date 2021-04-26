/**
 ** Name: 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  PixelRatio,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;

export const { height, width } = Dimensions.get('window');
const STANDARD_LENGTH = width > height ? width : height;
const OFFSET =
  width > height ? 0 : Platform.OS === 'ios' ? 150 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight =
  isIphoneX() || Platform.OS === 'android'
    ? STANDARD_LENGTH - OFFSET
    : STANDARD_LENGTH;

export function RFPercentage(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

/* PARSE WIDTH WITH SREEN SIZE */
export function sH(heightPercent) {
  let screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  let elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export function sW(widthPercent) {
  let screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  let elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export function alert(t, message, onPressOK) {
  return Alert.alert(
    t('common:app_name'),
    t(message),
    [
      {
        text: t('common:cancel'),
        style: 'cancel',
        onPress: () => console.log('[LOG] === Alert Cancel === '),
      },
      {
        text: t('common:ok'),
        style: 'default',
        onPress: onPressOK,
      },
    ],
    {
      cancelable: true,
    }
  );
};
