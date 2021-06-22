/**
 ** Name: CAlert
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from './CText';
import CButton from './CButton';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {scalePx, sW} from '~/utils/helper';

function CAlert(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    loading = false,
    show = false,
    contentStyle = {},
    title = 'common:need_confirm',
    content = null,
    customContent = null,
    onClose = null,
    onOK = null,
  } = props;

  /**************
   ** RENDER **
   **************/
  return (
    <Modal
      style={cStyles.m0}
      isVisible={show}
      animationIn={'zoomInUp'}
      animationOut={'fadeOut'}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      deviceWidth={cStyles.deviceWidth}
      deviceHeight={cStyles.deviceHeight}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      {...props}>
      <View style={cStyles.center}>
        <View
          style={[
            cStyles.mx48,
            cStyles.rounded3,
            isDark && cStyles.borderAllDark,
            {backgroundColor: customColors.background},
            contentStyle,
          ]}>
          {/** Header of Alert */}
          <View
            style={[
              cStyles.roundedTopLeft3,
              cStyles.roundedTopRight3,
              cStyles.pt16,
              cStyles.px16,
            ]}>
            <CText
              styles={'textCenter fontMedium'}
              label={title}
              customLabel={title !== 'common:need_confirm' ? title : null}
            />
          </View>

          {/** Content of Alert */}
          <View style={[cStyles.px16, cStyles.pb20, styles.content]}>
            {!loading && content && (
              <CText styles={'textMeta textCenter'} label={content} />
            )}
            {!loading && customContent && (
              <View style={cStyles.mt10}>{customContent}</View>
            )}
            {loading && (
              <View style={[cStyles.flexCenter, cStyles.mt20, cStyles.mb10]}>
                <ActivityIndicator color={customColors.textDisable} />
              </View>
            )}
          </View>

          {/** Footer of Alert */}
          {(onClose || onOK) && (
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyEvenly,
                cStyles.borderTop,
                isDark && cStyles.borderTopDark,
                styles.con_button,
              ]}>
              {onClose && (
                <CButton
                  textStyle={styles.text_button_close}
                  disabled={loading}
                  block
                  variant={'text'}
                  color={customColors.blue}
                  label={'common:close'}
                  onPress={onClose}
                />
              )}
              {onClose && onOK && (
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: isDark
                        ? colors.GRAY_800
                        : colors.GRAY_400,
                    },
                  ]}
                />
              )}

              {onOK && (
                <CButton
                  textStyle={styles.text_button_ok}
                  disabled={loading}
                  block
                  variant={'text'}
                  color={customColors.blue}
                  label={'common:ok'}
                  onPress={onOK}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {width: 1, height: '100%'},
  content: {width: sW('85%')},
  text_button_close: {
    fontSize: scalePx(2.8),
    fontFamily: cStyles.fontBold.fontFamily,
  },
  text_button_ok: {
    fontSize: scalePx(2.8),
    fontFamily: cStyles.fontRegular.fontFamily,
  },
  con_button: {height: 50},
});

export default CAlert;
