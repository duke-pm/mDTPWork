/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: File Attach
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FileAttach.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
/** COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import API from '~/services/axios';
import Icons from '~/utils/common/Icons';
import {Extensions} from '~/utils/asset';
import {THEME_DARK} from '~/config/constants';
import {cStyles, colors} from '~/utils/style';
import {checkExistsFile, moderateScale} from '~/utils/helper';

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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handlePreviewFile = async () => {
    if (!isFileExisted) {
      setLoading(true);
      let urlDownload = (
        API.defaults.baseURL.substring(0, API.defaults.baseURL.length - 3) +
        file
      ).replace(' ', '%20');
      let options = {
        background: true, // Continue the download in the background after the app terminates (iOS only)**
        discretionary: true, // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)**
        fromUrl: urlDownload,
        toFile: localFile,
        begin: res => console.log('[LOG] === Begin ===> '),
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

  /**********
   ** FUNC **
   **********/
  const onCheckExisted = async () => {
    let existed = await checkExistsFile(fileName);
    if (existed) {
      setFileExisted(true);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onCheckExisted(), []);

  /************
   ** RENDER **
   ************/
  let shortFileName = file.substring(file.lastIndexOf('/') + 1, file.length);
  return (
    <TouchableOpacity
      style={[
        cStyles.p10,
        cStyles.mt10,
        cStyles.center,
        cStyles.rounded1,
        isFileExisted && cStyles.borderAll,
        isFileExisted && isDark && cStyles.borderAllDark,
        cStyles.borderDashed,
        styles.container,
      ]}
      disabled={loading.preview}
      onPress={handlePreviewFile}>
      <>
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.py10,
          ]}>
          <View style={styles.con_left}>
            <Image
              style={styles.file}
              source={Extensions[extFile] || Extensions.file}
              resizeMode={'contain'}
            />
          </View>

          <View
            style={[
              cStyles.pt10,
              cStyles.itemsCenter,
              cStyles.fullWidth,
              styles.con_right,
            ]}>
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.textItalic,
                cStyles.textCenter,
                {color: customColors.primary},
              ]}
              customLabel={shortFileName}
              dataDetectorType={'link'}
            />
          </View>
        </View>

        {!isFileExisted && (
          <View
            style={[
              cStyles.abs,
              cStyles.inset0,
              cStyles.rounded1,
              cStyles.itemsEnd,
              cStyles.ofHidden,
              styles.con_bg,
            ]}>
            <View
              style={[
                cStyles.center,
                cStyles.rounded1,
                cStyles.m5,
                styles.con_icon_download,
                {backgroundColor: customColors.card},
              ]}>
              {loading && <CActivityIndicator />}
              {!loading && <CIcon name={Icons.download} size={'smaller'} />}
            </View>

            {loading && (
              <View style={[cStyles.abs, cStyles.bottom0]}>
                <Progress.Bar
                  animated={false}
                  width={styles.process_bar.width}
                  height={styles.process_bar.height}
                  borderColor={cStyles.borderAllDark.borderColor}
                  progress={progress / 100}
                  color={customColors.primary}
                  useNativeDriver={true}
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
  container: {width: moderateScale(250)},
  file: {width: moderateScale(60), height: moderateScale(60)},
  con_icon_download: {width: moderateScale(25), height: moderateScale(25)},
  con_bg: {zIndex: 5, backgroundColor: colors.BACKGROUND_DOWNLOAD},
  con_right: {flex: 0.7},
  con_left: {flex: 0.3},
  process_bar: {width: moderateScale(250), height: moderateScale(2)},
});

FileAttach.propTypes = {
  file: PropTypes.string,
};

export default FileAttach;
