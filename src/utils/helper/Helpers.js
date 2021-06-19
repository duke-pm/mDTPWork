/**
 ** Name: Helpers
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Helpers.js
 **/
import {PixelRatio, Platform, StatusBar, Dimensions, Alert} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;
const STANDARD_LENGTH =
  SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_WIDTH : SCREEN_HEIGHT;
const OFFSET =
  SCREEN_WIDTH > SCREEN_HEIGHT ? 0 : IS_IOS ? 150 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

const deviceHeight =
  isIphoneX() || IS_ANDROID ? STANDARD_LENGTH - OFFSET : STANDARD_LENGTH;

export function scalePx(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

/* PARSE WIDTH WITH SREEN SIZE */
export function sH(heightPercent) {
  // Convert string input to decimal number
  let elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
}

export function sW(widthPercent) {
  // Convert string input to decimal number
  let elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
}

export function borderRadius(number) {
  if (IS_ANDROID) {
    return number;
  } else {
    return number / 2;
  }
}

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
    },
  );
}

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
}

export async function askPermissionsCamera() {
  let perCamera = IS_ANDROID
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;
  let result = await request(perCamera);
  if (result !== 'granted') {
    alert(
      'You need allow permission for Camera to upload avatar or album in Settings!',
    );
    return false;
  } else {
    let perGallery = IS_ANDROID
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
}

export async function choosePhotoFromCamera(props) {
  let params = {
    mediaTypes: 'photo',
    includeBase64: true,
    forceJpg: true,
    cropping: true,
    height: 1024,
    width: 768,
  };
  if (props) {
    params = {...params, ...props};
  }
  let result = await ImagePicker.openCamera(params);
  return result;
}

export async function choosePhotoFromGallery(props) {
  let params = {
    mediaTypes: 'photo',
    includeBase64: true,
    forceJpg: true,
    cropping: true,
    height: 1024,
    width: 768,
  };
  if (props) {
    params = {...params, ...props};
  }
  let result = await ImagePicker.openPicker(params);
  return result;
}

/** LOCAL INFORMATION */
export async function saveLocalInfo({key, value}) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return false;
  }
}

export async function getLocalInfo(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return false;
  }
}

export async function removeSLocalInfo(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    return false;
  }
}

export async function clearLocalInfo(key) {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    return false;
  }
}

/** SECRET INFORMATION */
export async function saveSecretInfo({key, value}) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    return false;
  }
}

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
}

export async function removeSecretInfo(key) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    return false;
  }
}

export async function clearSecretInfo(key) {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    return false;
  }
}

export function checkEmpty(
  value,
  replaceValue,
  isNumber = false,
  formatDate = null,
) {
  if (value === 0 || value === '' || !value) {
    if (replaceValue) {
      if (isNumber) {
        return Number(replaceValue).format();
      } else {
        return replaceValue;
      }
    } else {
      return '-';
    }
  } else {
    if (isNumber) {
      return Number(value).format();
    } else if (formatDate) {
      return moment(value).format(formatDate);
    } else {
      return value;
    }
  }
}

export async function previewFile(url = '', name = null) {
  const localFile = `${RNFS.DocumentDirectoryPath}/${name}`;
  const isExistsFile = await RNFS.exists(localFile);
  if (isExistsFile) {
    FileViewer.open(localFile);
    return false;
  } else {
    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    await RNFS.downloadFile(options).promise;
    FileViewer.open(localFile);
    return false;
  }
}
