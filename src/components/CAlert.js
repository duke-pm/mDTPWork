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

function CAlert(props) {
  const isDark = useColorScheme() === 'dark';
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
      backdropOpacity={0.4}
      onBackButtonPress={loading ? null : onClose}
      onBackdropPress={loading ? null : onClose}>
      <View style={cStyles.center}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              cStyles.rounded2,
              isDark && cStyles.borderAll,
              {backgroundColor: customColors.background},
            ]}>
            {/** Header of Alert */}
            <View
              style={[
                cStyles.py10,
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
            <View style={cStyles.p10}>
              {content && <CText styles={'textCenter'} label={content} />}
              {customContent}
            </View>

            {/** Footer of Alert */}
            {(onClose || onOK) && (
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyEvenly,
                  cStyles.px16,
                  cStyles.py10,
                ]}>
                {onClose && (
                  <CButton
                    style={styles.button_base}
                    disabled={loading}
                    block
                    variant={'outlined'}
                    label={'common:cancel'}
                    onPress={onClose}
                  />
                )}

                {onOK && (
                  <CButton
                    style={styles.button_base}
                    disabled={loading}
                    block
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
  button_base: {width: cStyles.deviceWidth / 3, marginHorizontal: 10},
});

export default CAlert;
