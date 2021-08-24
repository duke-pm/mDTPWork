/**
 ** Name: CUploadImage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CUploadImage.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, ActionSheetIOS, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import moment from 'moment';
/* COMPONENTS */
import CButton from './CButton';
import CText from './CText';
import CIcon from './CIcon';
import Icons from '~/utils/common/Icons';
/* COMMON */
import Configs from '~/config';
import {colors, cStyles} from '~/utils/style';
import {
  IS_IOS,
  askPermissionsCamera,
  choosePhotoFromCamera,
  choosePhotoFromGallery,
  IS_ANDROID,
} from '~/utils/helper';

function CUploadImage(props) {
  const {t} = useTranslation();
  const {onChange} = props;

  /** Use State */
  const [showUpload, setShowUpload] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleCloseUpload = () => {
    setShowUpload(false);
  };

  const handleUpload = () => {
    if (IS_IOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: t('common:from_upload'),
          options: [
            t('common:from_camera'),
            t('common:from_gallery'),
            t('common:cancel'),
          ],
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            // Camera
            onChangeByCamera();
          } else if (buttonIndex === 1) {
            // Gallery
            onChangeByGallery();
          }
        },
      );
    } else {
      setShowUpload(true);
    }
  };

  /************
   ** FUNC **
   ************/
  const onChangeByCamera = async () => {
    let agreeP = await askPermissionsCamera();
    if (agreeP) {
      try {
        let result = await choosePhotoFromCamera();
        if (result) {
          onChange({
            file: {
              type: result.mime,
              name: IS_ANDROID
                ? 'image' + Configs.toDay.valueOf()
                : result.filename,
              path: result.path,
            },
            fileBase64: `data:${result.mime};base64,${result.data}`,
          });
          if (IS_ANDROID) {
            setShowUpload(false);
          }
        }
      } catch (e) {
        console.log('Error: ', e);
        if (IS_ANDROID) {
          setShowUpload(false);
        }
      }
    }
  };

  const onChangeByGallery = async () => {
    let agreeP = await askPermissionsCamera();
    if (agreeP) {
      try {
        let result = await choosePhotoFromGallery();
        if (result) {
          onChange({
            file: {
              type: result.mime,
              name: IS_ANDROID
                ? 'image' + Configs.toDay.valueOf()
                : result.filename,
              path: result.path,
            },
            fileBase64: `data:${result.mime};base64,${result.data}`,
          });
          if (IS_ANDROID) {
            setShowUpload(false);
          }
        }
      } catch (e) {
        console.log('Error: ', e);
        if (IS_ANDROID) {
          setShowUpload(false);
        }
      }
    }
  };

  /**************
   ** RENDER **
   **************/
  return (
    <View style={cStyles.pt16}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <CText
          styles={'textHeadline'}
          label={'add_approved_lost_damaged:file_upload'}
        />
        <CButton
          style={styles.button_upload}
          disabled={props.loading.submitAdd}
          label={
            props.file.data
              ? 'add_approved_lost_damaged:button_choose_again'
              : 'common:upload'
          }
          icon={Icons.upload}
          onPress={handleUpload}
        />
      </View>

      <Modal
        style={[cStyles.m0, cStyles.justifyEnd]}
        isVisible={showUpload}
        swipeDirection={['up', 'left', 'right', 'down']}
        onSwipeComplete={handleCloseUpload}
        onBackButtonPress={handleCloseUpload}
        onBackdropPress={handleCloseUpload}>
        <View style={[cStyles.pt10, cStyles.pb24, styles.container]}>
          <View style={[cStyles.py10, cStyles.px16]}>
            <CText styles={'textCaption1'} label={'common:from_upload'} />
          </View>
          <TouchableOpacity activeOpacity={0.5} onPress={onChangeByCamera}>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.py16,
                cStyles.px16,
              ]}>
              <CIcon name={Icons.camera} size={'medium'} color={'red'} />
              <CText
                styles={'textHeadline pl16'}
                label={'common:from_camera'}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={onChangeByGallery}>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.p16]}>
              <CIcon name={Icons.image} size={'medium'} color={'green'} />
              <CText
                styles={'textHeadline pl16'}
                label={'common:from_gallery'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input_multiline: {height: 100},
  button_upload: {width: 100, flex: 0},
  image_upload: {height: 150, width: '100%'},

  container: {backgroundColor: colors.WHITE},
});

CUploadImage.propTypes = {
  onChange: PropTypes.func,
  loading: PropTypes.object,
  file: PropTypes.object,
};

export default CUploadImage;
