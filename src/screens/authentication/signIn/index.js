/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: SignIn
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of SignIn.js
 **/
import React, {createRef, useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import TouchID from 'react-native-touch-id';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CInput from '~/components/CInput';
import CCheckbox from '~/components/CCheckbox';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
/* COMMON */
import Routes from '~/navigation/Routes';
import Icons from '~/utils/common/Icons';
import FieldsAuth from '~/config/fieldsAuth';
import {Assets} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';
import {LOGIN, LANGUAGE, BIOMETRICS, FAST_LOGIN} from '~/config/constants';
import {
  getLocalInfo,
  getSecretInfo,
  IS_ANDROID,
  IS_IOS,
  moderateScale,
  removeSecretInfo,
  resetRoute,
  saveSecretInfo,
  verticalScale,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const AnimImage = Animated.createAnimatedComponent(FastImage);

/** All init */
const INPUT_NAME = {
  USER_NAME: 'userName',
  PASSWORD: 'password',
};

/** All refs */
let userNameRef = createRef();
let passwordRef = createRef();

function SignIn(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {navigation} = props;

  /** Use ref */
  let animSizeImage = useRef(new Animated.Value(0)).current;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    submit: false,
  });
  const [form, setForm] = useState({
    userName: '',
    password: '',
    saveAccount: true,
  });
  const [error, setError] = useState({
    userName: false,
    password: false,
    userNameHelper: '',
    passwordHelper: '',
  });
  const [fastLogin, setFastLogin] = useState({
    status: false,
    icon: 'finger-print-outline',
    iconFaceID: Assets.iconFaceIDDark,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeInput = () => passwordRef.current.focus();

  const handleSaveAccount = () =>
    setForm({...form, saveAccount: !form.saveAccount});

  const handleForgotPassword = () =>
    navigation.navigate(Routes.AUTHENTICATION.FORGOT_PASSWORD.name);

  const handleAuth = () => {
    TouchID.isSupported()
      .then(biometryType => {
        if (biometryType === 'FaceID') {
          onCheckBiometrics(biometryType);
        } else if (biometryType === 'TouchID') {
          onCheckBiometrics(biometryType);
        } else if (biometryType === true) {
          onCheckBiometrics(t('sign_in:touch_sensor'));
        }
      })
      .catch(e => {
        alert(t('error:cannot_auth_with_biometrics'));
      });
  };

  const handleChangeText = (value, nameInput) => {
    if (nameInput === INPUT_NAME.USER_NAME) {
      setForm({...form, userName: value});
      if (error.userName) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({...error, userName: false});
      }
    } else {
      setForm({...form, password: value});
      if (error.password) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({...error, password: false});
      }
    }
  };

  const handleSignIn = () => {
    let isValid = onValidate();
    if (isValid) {
      setLoading({...loading, submit: true});
      let params = {
        Username: form.userName.trim().toLowerCase(),
        Password: form.password.trim(),
        TypeLogin: 2,
        Lang: commonState.get('language'),
      };
      dispatch(Actions.fetchLogin(params));
    }
  };

  /**********
   ** FUNC **
   **********/
  const onCheckBiometrics = type => {
    TouchID.authenticate(`${t('sign_in:login_with_biometrics')} ${type}`, {
      title: `${t('sign_in:login_with_biometrics')} ${type}`, // Android
      imageColor: colors.SECONDARY, // Android
      imageErrorColor: customColors.red, // Android
      sensorDescription: t('sign_in:touch_sensor'), // Android
      sensorErrorDescription: t('sign_in:error_login'), // Android
      cancelText: t('common:cancel'), // Android
      unifiedErrors: false, // use unified error messages (default false)
      fallbackLabel: t('sign_in:login_by_password'),
      passcodeFallback: false,
    })
      .then(async success => {
        setLoading({...loading, submit: true});
        let dataFastLogin = await getSecretInfo(FAST_LOGIN);
        if (dataFastLogin) {
          let params = {
            Username: dataFastLogin.userName.toLowerCase(),
            Password: dataFastLogin.password,
            TypeLogin: 2,
            Lang: commonState.get('language'),
          };
          dispatch(Actions.fetchLogin(params));
        }
      })
      .catch(e => {
        alert(t('sign_in:error_login'));
      });
  };

  const onPrepareData = async () => {
    if (form.saveAccount) {
      let dataLogin = {},
        item;
      for (item of FieldsAuth) {
        dataLogin[item.value] = authState.getIn(['login', item.value]);
      }
      await saveSecretInfo({key: LOGIN, value: dataLogin});
      if (!fastLogin.status) {
        await saveSecretInfo({
          key: FAST_LOGIN,
          value: {
            userName: form.userName.trim(),
            password: form.password.trim(),
          },
        });
      }
    } else {
      await removeSecretInfo(LOGIN);
    }
    onStart();
  };

  const onValidate = () => {
    let isUNEmpty = form.userName.trim().length === 0;
    let isPWEmpty = form.password.trim().length === 0;
    let errorValidate = {};

    if (isUNEmpty) {
      errorValidate.userName = true;
      errorValidate.userNameHelper = 'error:user_name_empty';
    }
    if (isPWEmpty) {
      errorValidate.password = true;
      errorValidate.passwordHelper = 'error:password_empty';
    }

    if (isUNEmpty || isPWEmpty) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError(errorValidate);
      return false;
    } else {
      return true;
    }
  };

  const onLoginError = () => {
    showMessage({
      message: t('common:app_name'),
      description:
        authState.get('errorHelperLogin') || t('sign_in:error_login'),
      type: 'danger',
      icon: 'danger',
    });
    setLoading({main: false, submit: false});
  };

  const onStart = () => {
    setLoading({main: false, submit: false});
    resetRoute(navigation, Routes.ROOT_TAB.name);
  };

  const onCheckDataLogin = async () => {
    /** Check Data Language */
    let dataLanguage = await getLocalInfo(LANGUAGE);
    if (dataLanguage) {
      dispatch(Actions.changeLanguage(dataLanguage.value));
    }

    /** Check Data Login */
    let dataLogin = await getSecretInfo(LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      setLoading({main: false, submit: true});
      let i,
        tmpDataLogin = {tokenInfo: {}, lstMenu: {}};
      for (i = 0; i < FieldsAuth.length; i++) {
        if (i === 0) {
          tmpDataLogin[FieldsAuth[i].key] = dataLogin[FieldsAuth[i].value];
        } else {
          tmpDataLogin.tokenInfo[FieldsAuth[i].key] =
            dataLogin[FieldsAuth[i].value];
        }
      }
      dispatch(Actions.loginSuccess(tmpDataLogin));
    } else {
      console.log('[LOG] === SignIn Server === ');
      /** Check biometrics */
      let dataFastLogin = await getSecretInfo(FAST_LOGIN);
      let isBio = await getLocalInfo(BIOMETRICS);
      if (
        isBio === '1' &&
        dataFastLogin &&
        dataFastLogin.userName &&
        dataFastLogin.password
      ) {
        setFastLogin({
          ...fastLogin,
          status: true,
        });
      }
      setLoading({main: false, submit: false});
    }
  };

  const onKeyboardShow = e => {
    Animated.timing(animSizeImage, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onKeyboardHide = e => {
    Animated.timing(animSizeImage, {
      duration: 300,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Check has save data login */
    onCheckDataLogin();

    /** Check show keyboard -> scale logo */
    let keyboardShowSub = null,
      keyboardHideSub = null,
      nameOfListener = IS_IOS
        ? {keyboardShow: 'keyboardWillShow', keyboardHide: 'keyboardWillHide'}
        : {keyboardShow: 'keyboardDidShow', keyboardHide: 'keyboardDidHide'};

    keyboardShowSub = Keyboard.addListener(nameOfListener.keyboardShow, () =>
      onKeyboardShow(),
    );
    keyboardHideSub = Keyboard.addListener(nameOfListener.keyboardHide, () =>
      onKeyboardHide(),
    );
    return () => {
      keyboardShowSub && keyboardShowSub.remove();
      keyboardHideSub && keyboardHideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (loading.submit && !loading.main) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return onPrepareData();
        }
        if (authState.get('errorLogin')) {
          return onLoginError();
        }
      }
    }
  }, [
    loading.main,
    loading.submit,
    authState.get('submitting'),
    authState.get('successLogin'),
    authState.get('errorLogin'),
  ]);

  /************
   ** RENDER **
   ************/
  const animScaleLogo = animSizeImage.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7],
  });
  return (
    <CContainer
      safeArea={{top: false, bottom: false}}
      loading={loading.main || loading.submit}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={cStyles.flex1}
            colors={colors.BACKGROUND_GRADIENT}>
            <CAvoidKeyboard>
              <View style={cStyles.flexCenter}>
                <View style={styles.box}>
                  <View
                    style={[
                      cStyles.justifyEnd,
                      cStyles.itemsCenter,
                      styles.container_logo,
                    ]}>
                    <AnimImage
                      style={[
                        styles.logo,
                        {transform: [{scale: animScaleLogo}]},
                      ]}
                      source={Assets.imgLogo}
                      resizeMode={FastImage.resizeMode.contain}
                      cache={FastImage.cacheControl.immutable}
                    />
                  </View>

                  <View style={[styles.container_input, cStyles.fullWidth]}>
                    <CInput
                      name={INPUT_NAME.USER_NAME}
                      style={styles.input}
                      styleInput={styles.input}
                      styleFocus={styles.input_focus}
                      selectionColor={colors.WHITE}
                      inputRef={userNameRef}
                      disabled={loading.submit}
                      value={form.userName}
                      icon={Icons.usernameAuth}
                      iconColor={colors.GRAY_500}
                      holderColor={colors.GRAY_500}
                      holder={'sign_in:input_username'}
                      returnKey={'next'}
                      error={error.userName}
                      errorHelper={error.userNameHelper}
                      onChangeInput={handleChangeInput}
                      onChangeValue={handleChangeText}
                    />

                    <View style={cStyles.py4} />

                    <CInput
                      name={INPUT_NAME.PASSWORD}
                      style={styles.input}
                      styleInput={styles.input}
                      styleFocus={styles.input_focus}
                      selectionColor={colors.WHITE}
                      inputRef={passwordRef}
                      disabled={loading.submit}
                      value={form.password}
                      icon={
                        fastLogin.status
                          ? ifIphoneX(fastLogin.iconFaceID, fastLogin.icon)
                          : Icons.passwordAuth
                      }
                      iconColor={colors.GRAY_500}
                      holderColor={colors.GRAY_500}
                      holder={'sign_in:input_password'}
                      returnKey={'done'}
                      password
                      error={error.password}
                      errorHelper={error.passwordHelper}
                      onChangeInput={handleSignIn}
                      onChangeValue={handleChangeText}
                      onPressIconFirst={fastLogin.status ? handleAuth : null}
                    />

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                        styles.bottom,
                      ]}>
                      <CCheckbox
                        textStyle={cStyles.textBody}
                        labelRight={'sign_in:save_account'}
                        value={form.saveAccount}
                        onChange={handleSaveAccount}
                      />

                      <CText
                        styles={'textUnderline colorWhite'}
                        label={'sign_in:forgot_password'}
                        onPress={handleForgotPassword}
                      />
                    </View>

                    <CButton
                      block
                      disabled={loading.submit}
                      icon={Icons.login}
                      label={'sign_in:title'}
                      onPress={handleSignIn}
                    />
                  </View>
                </View>
              </View>
            </CAvoidKeyboard>
          </LinearGradient>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  container_logo: {flex: 0.4},
  container_input: {flex: 0.6},
  input: {backgroundColor: colors.TRANSPARENT, color: colors.WHITE},
  input_focus: {backgroundColor: colors.BACKGROUND_INPUT_FOCUS},
  box: {
    width: moderateScale(300),
    height: verticalScale(550),
    paddingHorizontal: moderateScale(14),
  },
  logo: {height: moderateScale(180), width: moderateScale(250)},
  bottom: {paddingVertical: verticalScale(4)},
});

export default SignIn;
