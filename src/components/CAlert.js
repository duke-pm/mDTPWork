/**
 ** Name: CAlert
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from './CText';
import CButton from './CButton';
import CActivityIndicator from './CActivityIndicator';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {IS_ANDROID, IS_IOS, moderateScale} from '~/utils/helper';

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
  const RenderContent = () => {
    return (
      <View
        style={[
          cStyles.center,
          cStyles.rounded3,
          styles.container,
          {
            backgroundColor: IS_ANDROID
              ? customColors.card
              : colors.TRANSPARENT,
          },
          contentStyle,
        ]}>
        {/** Header of Alert */}
        <View
          style={[
            cStyles.roundedTopLeft3,
            cStyles.roundedTopRight3,
            cStyles.pt16,
            cStyles.px8,
            cStyles.center,
          ]}>
          <CText
            styles={'textCenter textTitle'}
            label={title}
            customLabel={title !== 'common:need_confirm' ? title : null}
          />
        </View>

        {/** Content of Alert */}
        <View
          style={[cStyles.px16, cStyles.pb20, cStyles.mt10, cStyles.fullWidth]}>
          {!loading && content && (
            <CText styles={'textMeta textCenter'} label={content} />
          )}
          {!loading && customContent && (
            <View style={cStyles.mt10}>{customContent}</View>
          )}
          {loading && (
            <View style={[cStyles.flexCenter, cStyles.mt20, cStyles.mb10]}>
              <CActivityIndicator />
            </View>
          )}
        </View>

        {/** Footer of Alert */}
        {(onClose || onOK) && (
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.borderTop,
              isDark && cStyles.borderTopDark,
            ]}>
            {onClose && (
              <CButton
                style={[
                  styles.con_button,
                  onClose && !onOK && styles.btn_alone,
                ]}
                textStyle={{
                  color: customColors.blue,
                  fontSize: moderateScale(18),
                }}
                disabled={loading}
                block
                variant={'text'}
                label={'common:close'}
                onPress={onClose}
              />
            )}
            {onClose && onOK && (
              <View
                style={[
                  cStyles.fullHeight,
                  styles.button,
                  {
                    backgroundColor: isDark ? colors.GRAY_800 : colors.GRAY_400,
                  },
                ]}
              />
            )}

            {onOK && (
              <CButton
                style={[
                  styles.con_button,
                  !onClose && onOK && styles.btn_alone,
                ]}
                textStyle={{
                  color: customColors.blue,
                  fontSize: moderateScale(18),
                }}
                disabled={loading}
                block
                variant={'text'}
                label={'common:ok'}
                onPress={onOK}
              />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      style={cStyles.m0}
      isVisible={show}
      animationIn={'pulse'}
      animationOut={'fadeOut'}
      backdropOpacity={isDark ? 0.8 : 0.4}
      avoidKeyboard={true}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      deviceWidth={cStyles.deviceWidth}
      deviceHeight={cStyles.deviceHeight}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      {...props}>
      <View style={cStyles.center}>
        {IS_IOS ? (
          <BlurView
            style={[cStyles.abs, cStyles.rounded3, styles.container]}
            blurType={isDark ? 'dark' : 'xlight'}
            blurAmount={10}>
            {RenderContent()}
          </BlurView>
        ) : (
          RenderContent()
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {width: moderateScale(300)},
  button: {width: moderateScale(1)},
  con_button: {height: moderateScale(45), width: moderateScale(150)},
  btn_alone: {width: moderateScale(300)},
});

export default CAlert;
