/**
 ** Name: CAlert
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAlert.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from './CText';
import CButton from './CButton';
import CActivityIndicator from './CActivityIndicator';
/* COMMON */
import {cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {moderateScale} from '~/utils/helper';

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
          cStyles.rounded1,
          styles.container,
          content && styles.container_small,
          {backgroundColor: customColors.card},
        ]}>
        {/** Header of Alert */}
        {hasTitle && (
          <View
            style={[
              cStyles.roundedTopLeft1,
              cStyles.roundedTopRight1,
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
            <View style={[cStyles.mt10, contentStyle]}>{customContent}</View>
          )}
          {loading && (
            <View style={[cStyles.flexCenter, cStyles.mt20, cStyles.mb10]}>
              <CActivityIndicator />
            </View>
          )}
        </View>

        {/** Footer of Alert */}
        {!loading && (onClose || onOK) && (
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
                  content && styles.con_button_small,
                  content && onClose && !onOK && styles.btn_alone_small,
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
                  !onClose && onOK && styles.btn_alone,
                  content && styles.con_button_small,
                  content && !onClose && onOK && styles.btn_alone_small,
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
      avoidKeyboard={true}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
      onBackButtonPress={!loading ? onClose : () => null}
      onBackdropPress={!loading ? onClose : () => null}
      {...props}>
      <View style={cStyles.center}>{RenderContent()}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {width: moderateScale(350)},
  container_small: {width: moderateScale(280)},
  button: {width: cStyles.borderTop.borderTopWidth},
  con_button: {height: moderateScale(45), width: moderateScale(350) / 2},
  con_button_small: {height: moderateScale(45), width: moderateScale(280) / 2},
  btn_left_border_radius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  btn_alone: {width: moderateScale(350)},
  btn_alone_small: {width: moderateScale(280)},
  text_button: {fontSize: moderateScale(15)},
});

CAlert.propTypes = {
  loading: PropTypes.bool,
  show: PropTypes.bool,
  contentStyle: PropTypes.object,
  hasTitle: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  customContent: PropTypes.element,
  onClose: PropTypes.func,
  onOK: PropTypes.func,
};

export default React.memo(CAlert);
