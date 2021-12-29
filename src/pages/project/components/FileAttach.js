/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: File Attach
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FileAttach.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTheme, Button, Icon, Text, Spinner} from '@ui-kitten/components';
import {StyleSheet, View, Image} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
/* COMMON */
import API from '~/services/axios';
import {Extensions} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {checkExistsFile, moderateScale, sW} from '~/utils/helper';

const RenderDownloadIcon = props => (
  <Icon {...props} name="download-outline" />
);

const RenderPreviewIcon = props => (
  <Icon {...props} name="eye-outline" />
);

function FileAttach(props) {
  const theme = useTheme();
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
    <View style={[cStyles.row, cStyles.itemsCenter]}>
      <Image
        style={styles.file}
        source={Extensions[extFile] || Extensions.file}
        resizeMode={'contain'}
      />
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.ml10]}>
        <View style={{flex: 0.8}}>
          <Text category="c1" ellipsizeMode="middle" numberOfLines={2}>
            {shortFileName}
          </Text>
          {loading && (
            <View style={cStyles.mt10}>
              <Progress.Bar
                animated={false}
                width={styles.process_bar.width}
                height={styles.process_bar.height}
                borderColor={cStyles.borderAllDark.borderColor}
                progress={progress / 100}
                color={theme['color-primary-500']}
                useNativeDriver={true}
              />
            </View>
          )}
        </View>
        {loading
        ? <Spinner size="tiny" />
        : (
          <Button
            size="tiny"
            disabled={loading.preview}
            accessoryLeft={isFileExisted
              ? RenderPreviewIcon
              : RenderDownloadIcon}
            onPress={handlePreviewFile}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  file: {width: moderateScale(25), height: moderateScale(25)},
  process_bar: {width: sW('22%'), height: moderateScale(2)},
});

FileAttach.propTypes = {
  file: PropTypes.string,
};

export default FileAttach;
