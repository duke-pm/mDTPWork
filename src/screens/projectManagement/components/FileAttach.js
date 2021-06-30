/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: File Attach
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of FileAttach.js
 **/
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
/* COMMON */
import {Extensions} from '~/utils/asset';
import {THEME_DARK} from '~/config/constants';
import {cStyles, colors} from '~/utils/style';
import {checkExistsFile, fS, IS_IOS} from '~/utils/helper';
import API from '~/services/axios';

function FileAttach(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {file} = props;
  const fileName = file.substring(file.lastIndexOf('/') + 1, file.length);
  const extFile = file.substring(file.lastIndexOf('.') + 1, file.length);
  const localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [isFileExisted, setFileExisted] = useState(false);
  const [progress, setProgress] = useState(0);

  /** HANDLE FUNC */
  const handlePreviewFile = async () => {
    if (!isFileExisted) {
      setLoading(true);
      let url = (
        API.defaults.baseURL.substring(0, API.defaults.baseURL.length - 3) +
        file
      ).replace(' ', '%20');
      let options = {
        background: true, // Continue the download in the background after the app terminates (iOS only)**
        discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
        fromUrl: url,
        toFile: localFile,
        begin: res => {
          console.log('[LOG] === Begin download ===> ');
        },
        progress: res => {
          setProgress(
            ((res.bytesWritten / res.contentLength) * 100).toFixed(0),
          );
        },
      };
      await RNFS.downloadFile(options).promise;
      FileViewer.open(localFile);
      setLoading(false);
      setFileExisted(true);
    } else {
      FileViewer.open(localFile);
    }
  };

  /** FUNC */
  const onCheckExisted = async () => {
    let existed = await checkExistsFile(fileName);
    if (existed) {
      setFileExisted(true);
    }
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onCheckExisted();
  }, []);

  /** RENDER */
  let shortFileName = file.substring(file.lastIndexOf('/') + 1, file.length);
  return (
    <TouchableOpacity
      style={[
        cStyles.p10,
        cStyles.mb10,
        cStyles.mt6,
        cStyles.center,
        cStyles.rounded2,
        isFileExisted && cStyles.borderAll,
        isFileExisted && isDark && cStyles.borderAllDark,
        styles.container,
      ]}
      disabled={loading.preview}
      onPress={handlePreviewFile}>
      <>
        <Image
          style={styles.file}
          source={Extensions[extFile] || Extensions.file}
          resizeMode={'contain'}
        />

        <Text
          dataDetectorType={'link'}
          style={[
            cStyles.textMeta,
            cStyles.textItalic,
            cStyles.textCenter,
            cStyles.pt10,
            {color: customColors.primary},
          ]}>
          {shortFileName}
        </Text>

        {!isFileExisted && (
          <View
            style={[
              cStyles.abs,
              cStyles.inset0,
              cStyles.rounded2,
              cStyles.itemsEnd,
              styles.con_bg,
              {backgroundColor: colors.BACKGROUND_DOWNLOAD},
            ]}>
            <View
              style={[
                cStyles.center,
                cStyles.rounded1,
                cStyles.m5,
                styles.con_icon_download,
                {backgroundColor: customColors.card},
              ]}>
              {loading && (
                <ActivityIndicator
                  color={customColors.icon}
                  size={IS_IOS ? 'small' : 12}
                />
              )}
              {!loading && (
                <Icon
                  name={'download'}
                  color={customColors.icon}
                  size={fS(14)}
                />
              )}
            </View>

            {loading && (
              <View style={[cStyles.abs, cStyles.bottom0]}>
                <Progress.Bar
                  animated={false}
                  width={150}
                  height={2}
                  borderColor={cStyles.borderAllDark.borderColor}
                  progress={progress / 100}
                  useNativeDriver={true}
                  color={customColors.primary}
                />
              </View>
            )}
          </View>
        )}
      </>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {width: 150},
  file: {width: 60, height: 60},
  con_icon_download: {width: 25, height: 25},
  con_bg: {zIndex: 5, overflow: 'hidden'},
});

export default FileAttach;
