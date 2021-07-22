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
import {cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {IS_ANDROID, IS_IOS, moderateScale} from '~/utils/helper';

function CAlert(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    loading = false,
    show = false,
    contentStyle = {},
    hasTitle = true,
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
          content && styles.container_small,
          IS_ANDROID && {backgroundColor: customColors.card},
          contentStyle,
        ]}>
        {/** Header of Alert */}
        {hasTitle && (
          <View
            style={[
              cStyles.roundedTopLeft3,
              cStyles.roundedTopRight3,
              cStyles.pt16,
              cStyles.px10,
              cStyles.center,
            ]}>
            <CText
              styles={'textCenter textHeadline'}
              label={title}
              customLabel={title !== 'common:need_confirm' ? title : null}
            />
          </View>
        )}

        {/** Content of Alert */}
        <View style={[cStyles.px16, cStyles.pb16, cStyles.fullWidth]}>
          {!loading && content && (
            <CText styles={'textCaption1 textCenter mt10'} label={content} />
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
                  content && styles.con_button_small,
                  onClose && !onOK && styles.btn_alone,
                  content && !onClose && onOK && styles.btn_alone_small,
                ]}
                textStyle={[
                  styles.text_button,
                  {color: IS_IOS ? customColors.blue : customColors.primary},
                ]}
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
                  {backgroundColor: cStyles.borderTop.borderTopColor},
                  isDark && {
                    backgroundColor: cStyles.borderTopDark.borderTopColor,
                  },
                ]}
              />
            )}

            {onOK && (
              <CButton
                style={[
                  styles.con_button,
                  content && styles.con_button_small,
                  !onClose && onOK && styles.btn_alone,
                  content && !onClose && onOK && styles.btn_alone_small,
                ]}
                textStyle={[
                  cStyles.fontRegular,
                  styles.text_button,
                  {color: IS_IOS ? customColors.blue : customColors.primary},
                ]}
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
      style={[cStyles.m0, cStyles.flexCenter]}
      isVisible={show}
      animationIn={'pulse'}
      animationOut={'fadeOut'}
      backdropOpacity={isDark ? 0.8 : 0.3}
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
            style={[
              cStyles.abs,
              cStyles.rounded3,
              styles.container,
              content && styles.container_small,
            ]}
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
  container: {width: moderateScale(350)},
  container_small: {width: moderateScale(280)},
  button: {width: cStyles.borderTop.borderTopWidth},
  con_button: {height: moderateScale(45), width: moderateScale(350) / 2},
  con_button_small: {height: moderateScale(45), width: moderateScale(280) / 2},
  btn_alone: {width: moderateScale(350)},
  btn_alone_small: {width: moderateScale(280)},
  text_button: {fontSize: moderateScale(18)},
});

export default CAlert;
