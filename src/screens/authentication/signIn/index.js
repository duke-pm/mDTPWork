/**
 ** Name: SignIn
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of SignIn.js
 **/
import { fromJS } from 'immutable';
import React, { createRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CInput from '~/components/CInput';
import CCheckbox from '~/components/CCheckbox';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/* COMMON */
import Routes from '~/navigation/Routes';
import Assets from '~/utils/asset/Assets';
import { LOGIN } from '~/config/constants';
import { colors, cStyles } from '~/utils/style';
import {
  IS_IOS,
  resetRoute
} from '~/utils/helper';
import API from '~/services/axios';
/* REDUX */
import * as Actions from '~/redux/actions';


const INPUT_NAME = {
  USER_NAME: 'userName',
  PASSWORD: 'password',
};
let userNameRef = createRef();
let passwordRef = createRef();

function SignIn(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const authState = useSelector(({ auth }) => auth);
  const commonState = useSelector(({ common }) => common);
  const masterState = useSelector(({ masterData }) => masterData);

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

  /** HANDLE FUNC */
  const handleChangeText = (value, nameInput) => {
    if (nameInput === INPUT_NAME.USER_NAME) {
      setForm({ ...form, userName: value });
      if (error.userName) setError({ ...error, userName: false });
    } else {
      setForm({ ...form, password: value });
      if (error.password) setError({ ...error, password: false });
    }
  };

  const handleChangeInput = () => {
    passwordRef.current.focus();
  };

  const handleForgotPassword = () => {
    props.navigation.navigate(Routes.AUTHENTICATION.FORGOT_PASSWORD.name);
  };

  const handleSaveAccount = (checked) => {
    setForm({ ...form, saveAccount: checked });
  };

  const handleSignIn = () => {
    let isValid = onValidate();
    if (isValid) {
      setLoading({ ...loading, submit: true });
      let params = fromJS({
        'Username': form.userName.trim().toLowerCase(),
        'Password': form.password.trim(),
        'Lang': commonState.get('language'),
      });
      dispatch(Actions.fetchLogin(params));
    };
  };

  /** FUNC */
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
      }
      await AsyncStorage.setItem(LOGIN, JSON.stringify(dataLogin));
    }
    API.defaults.headers.common['Authorization'] = 'Bearer ' + authState.getIn(['login', 'accessToken']);
    onFetchMasterData();
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
      setError(error);
      return false;
    } else {
      return true;
    }
  };

  const onLoginError = () => {
    showMessage({
      message: t('common:app_name'),
      description: authState.get('errorHelperLogin'),
      type: 'danger',
      icon: 'danger',
    });
    setLoading({ ...loading, submit: false });
  };

  const onStart = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('sign_in:success_login'),
      type: 'success',
      icon: 'success',
    });
    setLoading({ main: false, submit: false });
    resetRoute(props.navigation, Routes.ROOT_TAB.name);
  };

  const onCheckDataLogin = async () => {
    let dataLogin = await AsyncStorage.getItem(LOGIN);
    if (dataLogin) {
      setLoading({ main: false, submit: true });
      dataLogin = JSON.parse(dataLogin);
      dataLogin = {
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
      }
      dispatch(Actions.loginSuccess(dataLogin));
      API.defaults.headers.common['Authorization'] = 'Bearer ' + dataLogin.access_token;
      setForm({ ...form, saveAccount: true });
    } else {
      setLoading({ ...loading, main: false });
    }
  };

  const onFetchMasterData = () => {
    let params = {
      listType: 'Region, Company',
    }
    dispatch(Actions.fetchMasterData(params));
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onCheckDataLogin();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          onFetchMasterData();
        }
      }
    }
  }, [
    loading.main,
    authState.get('submitting'),
    authState.get('successLogin')
  ]);

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

  useEffect(() => {
    if (loading.submit) {
      if (!masterState.get('submitting')) {
        if (masterState.get('success')) {
          onStart();
        }
      }
    }
  }, [
    loading.submit,
    masterState.get('submitting'),
    masterState.get('success'),
  ]);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: false,
        bottom: false,
      }}
      loading={loading.main || loading.submit}
      content={
        <ImageBackground
          style={styles.img_background}
          source={Assets.bgAuthentication}
          resizeMode={'cover'}
          blurRadius={5}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[cStyles.flex1, styles.content]}>
              <KeyboardAvoidingView
                style={cStyles.flex1}
                behavior={IS_IOS ? 'padding' : 'height'}
              >
                <CContent
                  style={styles.con}
                  contentStyle={[styles.con, cStyles.flexCenter, cStyles.px48]}
                >
                  <View style={[cStyles.justifyEnd, styles.con_icon_app]}>
                    <Image
                      style={styles.img_icon_app}
                      source={Assets.iconApp}
                      resizeMode={'contain'}
                    />
                  </View>

                  <View style={styles.con_middle} />

                  <View style={styles.con_input}>
                    <CInput
                      name={INPUT_NAME.USER_NAME}
                      style={styles.input}
                      valueColor={colors.WHITE}
                      holderColor={colors.GRAY_500}
                      inputRef={userNameRef}
                      disabled={loading.submit}
                      value={form.userName}
                      icon={'user'}
                      iconColor={colors.GRAY_500}
                      holder={'sign_in:input_username'}
                      returnKey={'next'}
                      autoFocus
                      error={error.userName}
                      errorHelper={error.userNameHelper}
                      onChangeInput={handleChangeInput}
                      onChangeValue={handleChangeText}
                    />

                    <CInput
                      name={INPUT_NAME.PASSWORD}
                      style={styles.input}
                      valueColor={colors.WHITE}
                      holderColor={colors.GRAY_500}
                      inputRef={passwordRef}
                      disabled={loading.submit}
                      value={form.password}
                      icon={'lock'}
                      iconColor={colors.GRAY_500}
                      holder={'sign_in:input_password'}
                      returnKey={'done'}
                      password
                      error={error.password}
                      errorHelper={error.passwordHelper}
                      onChangeInput={handleSignIn}
                      onChangeValue={handleChangeText}
                    />

                    <View style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                      cStyles.mt6,
                    ]}>
                      <CCheckbox
                        labelStyle={'textDefault pl10 colorWhite'}
                        label={'sign_in:save_account'}
                        value={form.saveAccount}
                        onChange={handleSaveAccount}
                      />

                      <CText
                        styles={'textDefault textUnderline colorWhite'}
                        label={'sign_in:forgot_password'}
                        onPress={handleForgotPassword}
                      />
                    </View>

                    <CButton
                      block
                      disabled={loading.submit}
                      label={'sign_in:title'}
                      onPress={handleSignIn}
                    />
                  </View>
                </CContent>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>

        </ImageBackground>
      }
    />
  );
};

const styles = StyleSheet.create({
  con: { backgroundColor: colors.TRANSPARENT, },
  content: { backgroundColor: 'rgba(0, 0, 0, 0.4)', },
  con_icon_app: { flex: 0.3 },
  con_middle: { flex: 0.1 },
  con_input: { flex: 0.6, },
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },

  img_background: { height: '100%', width: '100%' },
  img_icon_app: { height: 100, width: 100 },
});

export default SignIn;
