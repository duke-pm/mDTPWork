/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: SignIn
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of SignIn.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CInput from '~/components/CInput';
import CCheckbox from '~/components/CCheckbox';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
/* COMMON */
import Routes from '~/navigation/Routes';
import {Assets} from '~/utils/asset';
import {LOGIN, LANGUAGE} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {
  getLocalInfo,
  getSecretInfo,
  IS_ANDROID,
  removeSecretInfo,
  resetRoute,
  saveSecretInfo,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  USER_NAME: 'userName',
  PASSWORD: 'password',
};
let userNameRef = createRef();
let passwordRef = createRef();

function SignIn(props) {
  const {t} = useTranslation();
  const {navigation} = props;

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

  /*****************
   ** HANDLE FUNC **
   *****************/
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

  const handleChangeInput = () => {
    passwordRef.current.focus();
  };

  const handleForgotPassword = () => {
    navigation.navigate(Routes.AUTHENTICATION.FORGOT_PASSWORD.name);
  };

  const handleSaveAccount = () => {
    setForm({...form, saveAccount: !form.saveAccount});
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

  /************
   ** FUNC **
   ************/
  const onPrepareData = async () => {
    if (form.saveAccount) {
      let dataLogin = {
        accessToken: authState.getIn(['login', 'accessToken']),
        tokenType: authState.getIn(['login', 'tokenType']),
        expiresIn: authState.getIn(['login', 'expiresIn']),
        refreshToken: authState.getIn(['login', 'refreshToken']),
        userName: authState.getIn(['login', 'userName']),
        userID: authState.getIn(['login', 'userID']),
        empCode: authState.getIn(['login', 'empCode']),
        fullName: authState.getIn(['login', 'fullName']),
        regionCode: authState.getIn(['login', 'regionCode']),
        deptCode: authState.getIn(['login', 'deptCode']),
        jobTitle: authState.getIn(['login', 'jobTitle']),
        expired: authState.getIn(['login', 'expired']),
        groupID: authState.getIn(['login', 'groupID']),
        lstMenu: authState.getIn(['login', 'lstMenu']),
      };
      saveSecretInfo({key: LOGIN, value: dataLogin});
    } else {
      await removeSecretInfo(LOGIN);
    }
    onStart();
  };

  const onValidate = () => {
    let isUNEmpty = form.userName.trim().length === 0;
    let isPWEmpty = form.password.trim().length === 0;
    let error = {};

    if (isUNEmpty) {
      error.userName = true;
      error.userNameHelper = 'error:user_name_empty';
    }
    if (isPWEmpty) {
      error.password = true;
      error.passwordHelper = 'error:password_empty';
    }

    if (isUNEmpty || isPWEmpty) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError(error);
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
    // showMessage({
    //   message: t('common:app_name'),
    //   description: t('sign_in:success_login'),
    //   type: 'success',
    //   icon: 'success',
    // });
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
      dataLogin = {
        tokenInfo: {
          access_token: dataLogin.accessToken,
          token_type: dataLogin.tokenType,
          expires_in: dataLogin.expiresIn,
          refresh_token: dataLogin.refreshToken,
          userName: dataLogin.userName,
          userID: dataLogin.userID,
          empCode: dataLogin.empCode,
          fullName: dataLogin.fullName,
          regionCode: dataLogin.regionCode,
          deptCode: dataLogin.deptCode,
          jobTitle: dataLogin.jobTitle,
          '.expires': dataLogin.expired,
          groupID: dataLogin.groupID,
        },
        lstMenu: dataLogin.lstMenu,
      };
      dispatch(Actions.loginSuccess(dataLogin));
    } else {
      console.log('[LOG] === SignIn Server === ');
      setLoading({main: false, submit: false});
    }
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onCheckDataLogin();
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

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      safeArea={{
        top: false,
        bottom: false,
      }}
      loading={loading.main || loading.submit}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={cStyles.flex1}
            colors={colors.BACKGROUND_GRADIENT}>
            <CAvoidKeyboard>
              <View style={[cStyles.flexCenter, cStyles.px48]}>
                <View style={[cStyles.justifyEnd, styles.con_icon_app]}>
                  <Image
                    style={styles.img_icon_app}
                    source={Assets.imgLogo}
                    resizeMode={'contain'}
                  />
                </View>

                <View style={[styles.con_input, cStyles.fullWidth]}>
                  <CInput
                    name={INPUT_NAME.USER_NAME}
                    style={styles.input}
                    styleFocus={styles.input_focus}
                    selectionColor={colors.WHITE}
                    holderColor={colors.GRAY_500}
                    inputRef={userNameRef}
                    disabled={loading.submit}
                    value={form.userName}
                    icon={'person-circle'}
                    iconColor={colors.GRAY_500}
                    holder={'sign_in:input_username'}
                    returnKey={'next'}
                    error={error.userName}
                    errorHelper={error.userNameHelper}
                    onChangeInput={handleChangeInput}
                    onChangeValue={handleChangeText}
                  />

                  <CInput
                    name={INPUT_NAME.PASSWORD}
                    style={styles.input}
                    styleFocus={styles.input_focus}
                    selectionColor={colors.WHITE}
                    holderColor={colors.GRAY_500}
                    inputRef={passwordRef}
                    disabled={loading.submit}
                    value={form.password}
                    icon={'lock-closed'}
                    iconColor={colors.GRAY_500}
                    holder={'sign_in:input_password'}
                    returnKey={'done'}
                    password
                    error={error.password}
                    errorHelper={error.passwordHelper}
                    onChangeInput={handleSignIn}
                    onChangeValue={handleChangeText}
                  />

                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                      cStyles.my6,
                    ]}>
                    <CCheckbox
                      textStyle={cStyles.textSubTitle}
                      labelRight={'sign_in:save_account'}
                      value={form.saveAccount}
                      onChange={handleSaveAccount}
                    />

                    <CText
                      styles={'textSubTitle textUnderline colorWhite'}
                      label={'sign_in:forgot_password'}
                      onPress={handleForgotPassword}
                    />
                  </View>

                  <CButton
                    block
                    disabled={loading.submit}
                    icon={'log-in'}
                    label={'sign_in:title'}
                    onPress={handleSignIn}
                  />
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
  container: {backgroundColor: colors.TRANSPARENT},
  content: {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
  con_icon_app: {flex: isIphoneX() ? 0.4 : 0.35},
  con_input: {flex: isIphoneX() ? 0.6 : 0.65},
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },
  input_focus: {
    backgroundColor: colors.BACKGROUND_INPUT_FOCUS,
  },
  img_background: {height: '100%', width: '100%'},
  img_icon_app: {height: 250, width: 250},
});

export default SignIn;
