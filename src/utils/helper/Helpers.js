/**
 ** Name: Helpers
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Helpers.js
 **/
import {
  PixelRatio,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImagePicker from 'react-native-image-crop-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import EncryptedStorage from 'react-native-encrypted-storage';

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

export function scalePx(percent) {
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

export function borderRadius(number) {
  if (IS_ANDROID) {
    return number;
  } else if (IS_IOS) {
    return number / 2;
  }
};

export function alert(t, message, onPressOK) {
  return Alert.alert(
    t('common:app_name'),
    t(message),
    [
      {
        text: t('common:close'),
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

export function resetRoute(navigation, routeName, params) {
  return navigation.reset({
    index: 0,
    routes: [
      {
        name: routeName,
        params,
      },
    ],
  });
};

export async function askPermissionsCamera() {
  let perCamera =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;
  let result = await request(perCamera);
  if (result !== 'granted') {
    alert(
      'You need allow permission for Camera to upload avatar or album in Settings!',
    );
    return false;
  } else {
    let perGallery =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    result = await request(perGallery);
    if (result !== 'granted') {
      alert(
        'You need allow permission for Gallery to upload avatar or album in Settings!',
      );
      return false;
    } else {
      return true;
    }
  }
};

export async function choosePhotoFromCamera(props) {
  let params = {
    mediaTypes: 'photo',
    includeBase64: true,
    forceJpg: true,
    cropping: true,
    height: 1024,
    width: 768,
  };
  if (props) params = { ...params, ...props };
  let result = await ImagePicker.openCamera(params);
  return result;
};

export async function choosePhotoFromGallery(props) {
  let params = {
    mediaTypes: 'photo',
    includeBase64: true,
    forceJpg: true,
    cropping: true,
    height: 1024,
    width: 768,
  };
  if (props) params = { ...params, ...props };
  let result = await ImagePicker.openPicker(params);
  return result;
};

export async function saveSecretInfo({ key, value }) {
  try {
    await EncryptedStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    return false;
  }
};

export async function getSecretInfo(key) {
  try {
    const data = await EncryptedStorage.getItem(key);
    if (data !== undefined) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return false;
  }
};

export async function removeSecretInfo(key) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    return false;
  }
};

export async function clearSecretInfo(key) {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    return false;
  }
};
