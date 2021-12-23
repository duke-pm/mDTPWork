/**
 ** Name: Custom alert
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Button, Spinner, useTheme, Modal} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {moderateScale, sW} from '~/utils/helper';

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
    textOk = 'common:ok',
    textCancel = 'common:close',
    statusOk = undefined,
    onBackdrop = () => null,
    onOk = undefined,
    onCancel = undefined,
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
      style={cStyles.m0}
      backdropStyle={{backgroundColor: colors.BACKGROUND_MODAL}}
      visible={show}
      onBackdropPress={handleBackdrop}>
      <Card disabled style={[styles.card, contentStyle]}>
        {(success || error || label) && (
          <View style={cStyles.itemsCenter}>
            {success && (
              <View style={cStyles.itemsCenter}>
                <IoniIcon
                  name={'checkmark-circle-outline'}
                  size={sIconStatus}
                  color={theme['color-success-500']} />
                <CText style={[cStyles.mt10, cStyles.textCenter]} category={'h6'}>
                  {t(label !== '' ? label : 'common:success')}
                </CText>
              </View>
            )}
            {error && (
              <View style={cStyles.itemsCenter}>
                <IoniIcon
                  name={'close-circle-outline'}
                  size={sIconStatus}
                  color={theme['color-danger-500']} />
                <CText style={[cStyles.mt10, cStyles.textCenter]} category={'h6'}>
                  {t(label !== '' ? label : 'common:error')}
                </CText>
              </View>
            )}
            {!success && !error && !customLabel && (
              <View style={cStyles.itemsCenter}>
                <CText style={cStyles.textCenter} category={'s1'}>{t(label)}</CText>
              </View>
            )}
            {!success && !error && customLabel && (
              <View style={cStyles.itemsCenter}>
                {customLabel}
              </View>
            )}
          </View>
        )}

        {message !== '' && !customMessage && (
          <View style={[cStyles.my16, styles.content]}>
            <CText style={cStyles.textCenter} >{t(message)}</CText>
          </View>
        )}
        {customMessage && (
          <View style={[cStyles.my16, styles.content]}>
            {customMessage}
          </View>
        )}

        {(cancel || onOk) && (
          <View
            style={[
              cStyles.mt16,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              styles.footer
            ]}>
            {cancel && (
              <Button
                style={[styles.btn_main, cancel && onOk && styles.btn_cancel]}
                status={'basic'}
                appearance={'filled'}
                disabled={loading}
                onPress={handleCancel}>
                {t(textCancel)}
              </Button>
            )}
            {onOk && (
              <Button 
                style={[styles.btn_main, cancel && styles.btn_cancel]}
                status={statusOk}
                appearance={'filled'}
                disabled={loading}
                // accessoryLeft={loading ? RenderLoadingIndicator : undefined}
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
  header: {
    
  },
  content: {

  },
  footer: {

  },
  btn_main: {
    width: '100%',
  },
  btn_cancel: {
    width: '45%',
  },
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
  textOk: PropTypes.string,
  textCancel: PropTypes.string,
  statusOk: PropTypes.string,
  onBackdrop: PropTypes.func,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CAlert;
