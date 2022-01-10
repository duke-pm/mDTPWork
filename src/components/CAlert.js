/**
 ** Name: Custom Alert
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Button, Text, useTheme} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/* COMMON */
import {cStyles} from '~/utils/style';
import {
  sW,
  moderateScale,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '~/utils/helper';

/** All init */
const sIconStatus = moderateScale(60);

function CAlert(props) {
  const theme = useTheme();
  const {t} = useTranslation();
  const {
    contentStyle = {},
    show = false,
    loading = false,
    success = false,
    error = false,
    cancel = false,
    label = 'common:alert',
    customLabel = null,
    message = '',
    customMessage = null,
    iconOk = undefined,
    iconCancel = undefined,
    textOk = 'common:ok',
    textCancel = 'common:close',
    statusOk = undefined,
    onBackdrop = () => null,
    onOk = undefined,
    onCancel = undefined,
    onModalHide = undefined,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBackdrop = () => {
    if (onBackdrop) onBackdrop();
  };

  const handleOk = () => {
    if (onOk) onOk();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      style={[cStyles.m0, cStyles.center]}
      isVisible={show}
      coverScreen={true}
      avoidKeyboard={true}
      useNativeDriver={true}
      renderToHardwareTextureAndroid={true}
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.5}
      deviceHeight={SCREEN_HEIGHT}
      deviceWidth={SCREEN_WIDTH}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      onBackdropPress={handleBackdrop}
      onBackButtonPress={handleBackdrop}
      onModalHide={onModalHide}>
      <Card disabled style={[styles.card, contentStyle]}>
        {(success || error) && (
          <View style={cStyles.itemsCenter}>
            {success && (
              <View style={cStyles.itemsCenter}>
                <IoniIcon
                  name={'checkmark-circle-outline'}
                  size={sIconStatus}
                  color={theme['color-success-500']} />
                <Text style={[cStyles.mt10, cStyles.textCenter]} category="h6">
                  {t(label !== '' ? label : 'common:success')}
                </Text>
              </View>
            )}
            {error && (
              <View style={cStyles.itemsCenter}>
                <IoniIcon
                  name={'close-circle-outline'}
                  size={sIconStatus}
                  color={theme['color-danger-500']} />
                <Text style={[cStyles.mt10, cStyles.textCenter]} category="h6">
                  {t(label !== '' ? label : 'common:error')}
                </Text>
              </View>
            )}
          </View>
        )}
        {!success && !error && !customLabel && (
          <View style={cStyles.itemsCenter}>
            <Text style={cStyles.textCenter} category="s1">{t(label)}</Text>
          </View>
        )}
        {!success && !error && customLabel && (
          <View style={cStyles.itemsCenter}>
            {customLabel}
          </View>
        )}

        {message !== '' && !customMessage && (
          <View style={cStyles.mt16}>
            <Text style={cStyles.textCenter}>{t(message)}</Text>
          </View>
        )}
        {customMessage && (
          <View style={cStyles.mt16}>
            {customMessage}
          </View>
        )}

        {(cancel || onOk) && (
          <View
            style={[
              cStyles.mt16,
              cStyles.mb5,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
            ]}>
            {cancel && (
              <Button
                style={[cStyles.fullWidth, cancel && onOk && styles.btn_cancel]}
                status="basic"
                disabled={loading}
                accessoryLeft={iconCancel}
                onPress={handleCancel}>
                {t(textCancel)}
              </Button>
            )}
            {onOk && (
              <Button 
                style={[cStyles.fullWidth, cancel && styles.btn_cancel]}
                status={statusOk}
                disabled={loading}
                accessoryLeft={iconOk}
                onPress={handleOk}>
                {t(textOk)}
              </Button>
            )}
          </View>
        )}
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {width: sW('90%')},
  btn_cancel: {width: '47%'},
});

CAlert.propTypes = {
  contentStyle: PropTypes.object,
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  cancel: PropTypes.bool,
  label: PropTypes.string,
  customLabel: PropTypes.element,
  message: PropTypes.string,
  customMessage: PropTypes.element,
  iconOk: PropTypes.func,
  iconCancel: PropTypes.func,
  textOk: PropTypes.string,
  textCancel: PropTypes.string,
  statusOk: PropTypes.string,
  onBackdrop: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onModalHide: PropTypes.func,
};

export default CAlert;
