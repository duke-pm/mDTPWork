/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Change Password
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ChangePassword.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CInput from '~/components/CInput';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
/* COMMON */
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID, resetRoute} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  PASSWORD: 'password',
};

function ChangePassword(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;
  const tokenData = route.params?.tokenData || 'not';

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: '',
    success: false,
    error: false,
  });
  const [error, setError] = useState({
    password: false,
    passwordHelper: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSend = () => {
    let isValid = onCheckValid();
    console.log('[LOG] ===  ===> ', isValid);
    if (isValid) {
      onSubmit();
    }
  };

  const handleChangeText = (value, nameInput) => {
    setForm({...form, password: value});
    if (error.password) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({...error, password: false});
    }
  };

  const handleGoBack = () => {
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  /**********
   ** FUNC **
   **********/
  const onCheckValid = () => {
    if (!error.password) {
      if (form.password.trim() === '') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({
          password: true,
          passwordHelper: 'forgot_password:error_password_not_fill',
        });
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  const onSubmit = () => {
    let params = {
      Lang: language,
      TokenData: tokenData,
      NewPassword: form.password,
    };
    console.log('[LOG] === onSubmit ===> ', params);
    dispatch(Actions.fetchUpdatePassword(params, navigation));
    setLoading(true);
  };

  const onCompleteChange = (status, message) => {
    setForm({
      password: '',
      success: status,
      error: message || false,
    });
    setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loading) {
      if (!authState.get('submittingUpdatePass')) {
        if (authState.get('successUpdatePass')) {
          return onCompleteChange(true);
        }

        if (authState.get('errorUpdatePass')) {
          return onCompleteChange(
            false,
            typeof authState.get('errorHelperUpdatePass') === 'string'
              ? authState.get('errorHelperUpdatePass')
              : null,
          );
        }
      }
    }
  }, [
    loading,
    authState.get('submittingUpdatePass'),
    authState.get('successUpdatePass'),
    authState.get('errorUpdatePass'),
  ]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      safeArea={{
        top: false,
        bottom: false,
      }}
      loading={loading}
      title={'forgot_password:title'}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={cStyles.flex1}
            colors={colors.BACKGROUND_GRADIENT}>
            {!form.success && !form.error && (
              <CAvoidKeyboard>
                <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                  <View
                    style={[
                      cStyles.itemsCenter,
                      cStyles.justifyCenter,
                      styles.con_icon_app,
                    ]}>
                    <CText
                      styles={'textCenter colorWhite'}
                      label={'forgot_password:sub_title_update_password'}
                    />
                  </View>

                  <View style={[styles.con_input, cStyles.fullWidth]}>
                    <CInput
                      name={INPUT_NAME.NEW_PASSWORD}
                      style={styles.input}
                      disabled={loading}
                      holder={'change_password:new_password'}
                      selectionColor={colors.WHITE}
                      holderColor={colors.GRAY_500}
                      value={form.newPassword}
                      keyboard={'default'}
                      returnKey={'send'}
                      icon={'lock-closed'}
                      iconColor={colors.GRAY_500}
                      password
                      error={error.newPassword}
                      errorHelperCustom={error.newPasswordHelper}
                      onChangeInput={handleSend}
                      onChangeValue={handleChangeText}
                    />

                    <CButton
                      style={cStyles.mt16}
                      block
                      disabled={loading}
                      icon={'send'}
                      label={'common:send'}
                      onPress={handleSend}
                    />

                    <CButton
                      style={cStyles.mt16}
                      textStyle={[cStyles.textSubTitle, cStyles.textUnderline]}
                      block
                      color={colors.WHITE}
                      variant={'text'}
                      label={'forgot_password:button_go_back'}
                      onPress={handleGoBack}
                    />
                  </View>
                </View>
              </CAvoidKeyboard>
            )}

            {form.success && !form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon name={'smile'} color={colors.GRAY_500} size={fS(80)} />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:success_change_password'}
                  />
                </View>

                <View style={cStyles.mt16}>
                  <CButton
                    style={cStyles.mt16}
                    textStyle={[cStyles.textSubTitle, cStyles.textUnderline]}
                    block
                    color={colors.WHITE}
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </View>
            )}

            {!form.success && form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon name={'frown'} color={colors.GRAY_500} size={fS(80)} />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:error_change_password'}
                  />
                  <CText
                    styles={'textCenter colorWhite pt32'}
                    customLabel={form.error}
                  />
                </View>

                <View style={cStyles.mt16}>
                  <CButton
                    style={cStyles.mt16}
                    textStyle={[cStyles.textSubTitle, cStyles.textUnderline]}
                    block
                    color={colors.WHITE}
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </View>
            )}
          </LinearGradient>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.TRANSPARENT},
  con_icon_app: {flex: 0.2},
  con_input: {flex: 0.8},
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },

  icon: {width: 50, height: 50},
  icon_error: {width: 27, height: 27},
});

export default ChangePassword;
