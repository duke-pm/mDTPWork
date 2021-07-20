/* eslint-disable no-useless-escape */
/**
 ** Name: Helpers
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Helpers.js
 **/
import {PixelRatio, Platform, Dimensions, Alert} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import moment from 'moment';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WIDTH = Dimensions.get('window').width;

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 592;
export const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = size =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const STANDARD_SIZE = {width: 375};
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const scale1 = SCREEN_WIDTH / STANDARD_SIZE.width;

export function fS(number) {
  // return (parseInt(number) * SCREEN_WIDTH) / STANDARD_SIZE.width;
  const newSize = number * scale1;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
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

export function validatEemail(data) {
  if (regex.test(data)) {
    return true;
  }
  return false;
}

export function alert(t, message, onPressOK) {
  return Alert.alert(
    t('common:app_name'),
    t(message),
    [
      {
        text: t('common:close'),
        style: 'cancel',
        onPress: () => null,
      },
      {
        text: t('common:ok'),
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

export async function removeLocalInfo(key) {
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

export async function checkExistsFile(name = null) {
  const localFile = `${RNFS.DocumentDirectoryPath}/${name}`;
  const isExistsFile = await RNFS.exists(localFile);
  if (isExistsFile) {
    return true;
  } else {
    return false;
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
      background: true, // Continue the download in the background after the app terminates (iOS only)**
      discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
      fromUrl: url,
      toFile: localFile,
      begin: res => {
        console.log('[LOG] === begin ===> ');
      },
      progress: res => {},
    };
    await RNFS.downloadFile(options).promise;
    FileViewer.open(localFile);
    return false;
  }
}
