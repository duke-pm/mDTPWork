/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Change Password
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ChangePassword.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
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
import CLoading from '~/components/CLoading';
/* COMMON */
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID, resetRoute, saveLocalInfo} from '~/utils/helper';
import {BIOMETRICS} from '~/config/constants';
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
  const {customColors} = useTheme();
  const {navigation, route} = props;
  const tokenData = route.params?.tokenData || 'not_token';

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState({
    check: true,
    update: false,
  });
  const [form, setForm] = useState({
    password: '',
    success: false,
    error: false,
    errorExpired: false,
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
  const onCheckTokenExpired = () => {
    let params = fromJS({
      Token: tokenData,
      Lang: language,
    });
    dispatch(Actions.fetchCheckTokenPassword(params));
  };

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
    dispatch(Actions.fetchUpdatePassword(params));
    setLoading({...loading, update: true});
  };

  const onCompleteChange = (status, message) => {
    setForm({
      password: '',
      success: status,
      error: message || (status ? false : true),
    });
    setLoading({check: false, update: false});
  };

  const onCompleteCheck = (status, message) => {
    setForm({
      ...form,
      error: false,
      errorExpired: message || false,
    });
    setLoading({check: false, update: false});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(async () => {
    await saveLocalInfo({key: BIOMETRICS, value: '0'});
    onCheckTokenExpired();
  }, []);

  useEffect(() => {
    if (loading.check) {
      if (!authState.get('submittingCheckTokenPass')) {
        if (authState.get('successCheckTokenPass')) {
          return onCompleteCheck(true);
        }

        if (authState.get('errorCheckTokenPass')) {
          return onCompleteCheck(
            false,
            'forgot_password:error_holder_cannot_change_password_1',
          );
        }
      }
    }
  }, [
    loading.check,
    authState.get('submittingCheckTokenPass'),
    authState.get('successCheckTokenPass'),
    authState.get('errorCheckTokenPass'),
  ]);

  useEffect(() => {
    if (loading.update) {
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
    loading.update,
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
      loading={loading.check || loading.update}
      title={'forgot_password:title'}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={cStyles.flex1}
            colors={colors.BACKGROUND_GRADIENT}>
            {!loading.check &&
              !form.success &&
              !form.error &&
              !form.errorExpired && (
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
                        disabled={loading.update}
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
                        disabled={loading.update}
                        icon={'send'}
                        label={'common:send'}
                        onPress={handleSend}
                      />

                      <CButton
                        style={cStyles.mt16}
                        textStyle={[
                          cStyles.textSubTitle,
                          cStyles.textUnderline,
                        ]}
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

            {!loading.update && form.success && !form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon name={'happy'} color={colors.GRAY_500} size={fS(80)} />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:success_change_password'}
                  />

                  <CText
                    styles={'textCenter colorWhite pt32'}
                    label={'forgot_password:sub_title_success_update_password'}
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

            {!loading.update && !form.success && form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon name={'sad'} color={colors.GRAY_500} size={fS(80)} />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:error_change_password'}
                  />
                  {typeof form.error === 'string' && (
                    <CText
                      styles={'textCenter colorWhite pt32'}
                      customLabel={form.error}
                    />
                  )}
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

            {!loading.update &&
              !form.success &&
              !form.error &&
              form.errorExpired && (
                <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                  <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                    <Icon name={'sad'} color={colors.GRAY_500} size={fS(80)} />
                  </View>

                  <View style={cStyles.py16}>
                    <CText
                      styles={'H3 textCenter colorWhite'}
                      label={'forgot_password:error_cannot_change_password'}
                    />
                    <CText
                      styles={'textCenter colorWhite pt32'}
                      label={form.errorExpired}
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
  con_icon_app: {flex: 0.2},
  con_input: {flex: 0.8},
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },
});

export default ChangePassword;
