/**
 ** Name: CAlert
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from './CText';
import CButton from './CButton';
import CLoading from './CLoading';
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
      isVisible={show}
      style={cStyles.m0}
      animationIn={'zoomIn'}
      animationOut={'fadeOut'}
      animationInTiming={150}
      backdropOpacity={isDark ? 0.8 : 0.5}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={cStyles.flexCenter}>
          <View
            style={[
              cStyles.mx48,
              cStyles.rounded3,
              isDark && cStyles.borderAllDark,
              {backgroundColor: customColors.background},
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
                numberOfLines={1}
              />
            </View>

            {/** Content of Alert */}
            <View style={[cStyles.px16, cStyles.py20, styles.content]}>
              {content && (
                <CText styles={'textMeta textCenter'} label={content} />
              )}
              {customContent && (
                <View style={cStyles.mt10}>{customContent}</View>
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
                    color={customColors.primary}
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
                    color={customColors.primary}
                    label={'common:ok'}
                    onPress={onOK}
                  />
                )}
              </View>
            )}
            <CLoading customColors={customColors} visible={loading} />
          </View>
        </View>
      </TouchableWithoutFeedback>
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
