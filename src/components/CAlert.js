/**
 ** Name: CAlert
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from './CText';
import CButton from './CButton';
import CLoading from './CLoading';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {sW} from '~/utils/helper';

function CAlert(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    loading = false,
    show = false,
    title = 'common:app_name',
    content = null,
    customContent = null,
    onClose = null,
    onOK = null,
  } = props;

  /** RENDER */
  return (
    <Modal
      isVisible={show}
      animationIn={'fadeInDown'}
      animationOut={'fadeOutUp'}
      backdropOpacity={0.8}
      onBackButtonPress={Keyboard.dismiss}
      onBackdropPress={Keyboard.dismiss}>
      <View style={cStyles.flexCenter}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              cStyles.rounded2,
              isDark && cStyles.borderAllDark,
              {backgroundColor: customColors.background},
            ]}>
            {/** Header of Alert */}
            <View
              style={[
                cStyles.py16,
                cStyles.roundedTopLeft2,
                cStyles.roundedTopRight2,
                {backgroundColor: isDark ? customColors.card : colors.PRIMARY},
              ]}>
              <CText
                styles={'colorWhite textCenter fontMedium'}
                label={title}
                customLabel={title !== 'common:app_name' ? title : null}
              />
            </View>

            {/** Content of Alert */}
            <View style={[cStyles.px10, cStyles.py20, styles.content]}>
              {content && <CText styles={'textCenter'} label={content} />}
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
                  cStyles.py6,
                  isDark && cStyles.borderTopDark,
                ]}>
                {onClose && (
                  <CButton
                    style={styles.button_base}
                    disabled={loading}
                    block
                    variant={'text'}
                    color={customColors.red}
                    label={'common:close'}
                    onPress={onClose}
                  />
                )}
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

                {onOK && (
                  <CButton
                    style={styles.button_base}
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
            <CLoading visible={loading} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {width: 1, height: '100%'},
  button_base: {width: cStyles.deviceWidth / 3, marginHorizontal: 10},
  content: {width: sW('85%')},
});

export default CAlert;
