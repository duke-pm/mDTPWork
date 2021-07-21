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
import {ifIphoneX} from 'react-native-iphone-x-helper';
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
import Icons from '~/config/icons';
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {
  moderateScale,
  IS_ANDROID,
  resetRoute,
  saveLocalInfo,
  verticalScale,
} from '~/utils/helper';
import {BIOMETRICS} from '~/config/constants';
/** REDUX */
import * as Actions from '~/redux/actions';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {NEW_PASSWORD: 'password'};

function ChangePassword(props) {
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

  /************
   ** RENDER **
   ************/
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
                  <View style={cStyles.flexCenter}>
                    <View style={styles.box}>
                      <View
                        style={[
                          cStyles.itemsCenter,
                          cStyles.justifyEnd,
                          styles.container_title,
                        ]}>
                        <CText
                          customStyles={[
                            cStyles.textCenter,
                            cStyles.colorWhite,
                            styles.text_title,
                          ]}
                          label={'forgot_password:sub_title_update_password'}
                        />
                      </View>

                      <View style={[styles.container_input, cStyles.fullWidth]}>
                        <CInput
                          name={INPUT_NAME.NEW_PASSWORD}
                          style={styles.input}
                          styleInput={styles.input}
                          styleFocus={styles.input_focus}
                          selectionColor={colors.WHITE}
                          disabled={loading.update}
                          holder={'change_password:new_password'}
                          holderColor={colors.GRAY_500}
                          value={form.password}
                          keyboard={'default'}
                          returnKey={'send'}
                          icon={Icons.lock}
                          iconColor={colors.GRAY_500}
                          password
                          error={error.password}
                          errorHelperCustom={error.passwordHelper}
                          onChangeInput={handleSend}
                          onChangeValue={handleChangeText}
                        />

                        <View style={styles.separator} />

                        <CButton
                          block
                          disabled={loading.update}
                          icon={Icons.send}
                          label={'common:send'}
                          onPress={handleSend}
                        />

                        <View style={styles.separator} />

                        <CButton
                          textStyle={[
                            cStyles.textSubheadline,
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
                  </View>
                </CAvoidKeyboard>
              )}

            {!loading.update && form.success && !form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon
                    name={Icons.successHappy}
                    color={colors.GRAY_500}
                    size={moderateScale(80)}
                  />
                </View>

                <View style={styles.separator} />

                <>
                  <CText
                    styles={'textTitle3 textCenter colorWhite'}
                    label={'forgot_password:success_change_password'}
                  />

                  <CText
                    styles={'textCenter colorWhite pt32'}
                    label={'forgot_password:sub_title_success_update_password'}
                  />
                </>

                <View style={styles.separator} />

                <CButton
                  textStyle={[cStyles.textSubheadline, cStyles.textUnderline]}
                  block
                  color={colors.WHITE}
                  variant={'text'}
                  label={'forgot_password:button_go_back'}
                  onPress={handleGoBack}
                />
              </View>
            )}

            {!loading.update && !form.success && form.error && (
              <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                  <Icon
                    name={Icons.failedSad}
                    color={colors.GRAY_500}
                    size={moderateScale(80)}
                  />
                </View>

                <View style={styles.separator} />

                <>
                  <CText
                    styles={'textTitle3 textCenter colorWhite'}
                    label={'forgot_password:error_change_password'}
                  />
                  {typeof form.error === 'string' && (
                    <CText
                      styles={'textCenter colorWhite pt32'}
                      customLabel={form.error}
                    />
                  )}
                </>

                <View style={styles.separator} />

                <CButton
                  textStyle={[cStyles.textSubheadline, cStyles.textUnderline]}
                  block
                  color={colors.WHITE}
                  variant={'text'}
                  label={'forgot_password:button_go_back'}
                  onPress={handleGoBack}
                />
              </View>
            )}

            {!loading.update &&
              !form.success &&
              !form.error &&
              form.errorExpired && (
                <View style={[cStyles.flex1, cStyles.px48, cStyles.pt32]}>
                  <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                    <Icon
                      name={Icons.failedSad}
                      color={colors.GRAY_500}
                      size={moderateScale(80)}
                    />
                  </View>

                  <View style={styles.separator} />

                  <>
                    <CText
                      styles={'textTitle3 textCenter colorWhite'}
                      label={'forgot_password:error_cannot_change_password'}
                    />
                    <CText
                      styles={'textCenter colorWhite pt32'}
                      label={form.errorExpired}
                    />
                  </>

                  <View style={styles.separator} />

                  <CButton
                    textStyle={[cStyles.textSubheadline, cStyles.textUnderline]}
                    block
                    color={colors.WHITE}
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              )}
          </LinearGradient>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  container_title: {flex: ifIphoneX(0.4, 0.35)},
  container_input: {flex: ifIphoneX(0.6, 0.65)},
  input: {backgroundColor: colors.TRANSPARENT, color: colors.WHITE},
  input_focus: {backgroundColor: colors.BACKGROUND_INPUT_FOCUS},
  box: {
    width: moderateScale(300),
    height: verticalScale(550),
    paddingHorizontal: moderateScale(14),
  },
  text_title: {marginBottom: moderateScale(30)},
  separator: {paddingVertical: verticalScale(6)},
});

export default ChangePassword;
