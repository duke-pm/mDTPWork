/**
 ** Name: Login screen
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useRef, useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {usePrevious} from '~/utils/hook';
import {useTheme, Layout, CheckBox} from '@ui-kitten/components';
import {
  View, TouchableWithoutFeedback, StatusBar, ScrollView, StyleSheet,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {ThemeContext} from '~/configs/theme-context';
import {AST_LANGUAGE, AST_LOGIN} from '~/configs/constants';
import {cStyles} from '~/utils/style';
import {
  getLocalInfo, getSecretInfo, IS_ANDROID, moderateScale,
  removeSecretInfo, resetRoute, saveSecretInfo,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All init */
const INPUT_NAME = {
  USER_NAME: 'userName',
  PASSWORD: 'password',
};

function Login(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {navigation} = props;
  let prevTheme = usePrevious(themeContext.themeApp);

  /** use ref */
  const formRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);

  /** Use State */
  const [loading, setLoading] = useState({
    main: true,
    submit: false,
  });
  const [values, setValues] = useState({
    userName: '',
    password: '',
    saveAccount: true,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSaveAccount = checked => {
    setValues({...values, saveAccount: checked});
  };

  const handleGoForgotPassword = () => {
    console.log('[LOG] ===  ===> Go to forgot password');
    navigation.navigate(Routes.FORGOT_PASSWORD.name);
  };

  const handleSignIn = () => {
    setLoading({...loading, submit: true});
    /** Set value for email */
    let tmpCallback = formRef.current?.onCallbackValue();
    /** Submit */
    let params = {
      Username: tmpCallback.valuesAll[0].value.trim().toLowerCase(),
      Password: tmpCallback.valuesAll[1].value.trim(),
      TypeLogin: 2,
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchLogin(params));
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = async () => {
    if (values.saveAccount) {
      let dataLogin = {},
        item;
      for (item of FieldsAuth) {
        dataLogin[item.value] = authState.getIn(['login', item.value]);
      }
      await saveSecretInfo({key: AST_LOGIN, value: dataLogin});
    } else {
      await removeSecretInfo(AST_LOGIN);
    }
    onStart();
  };

  const onStart = () => {
    setLoading({main: false, submit: false});
    resetRoute(navigation, Routes.TAB.name);
  };

  const onCheckDataLogin = async () => {
    /** Check Data Language */
    let dataLanguage = await getLocalInfo(AST_LANGUAGE);
    if (dataLanguage) {
      dispatch(Actions.changeLanguage(dataLanguage.value));
    }

    /** Check Data Login */
    let dataLogin = await getSecretInfo(AST_LOGIN);
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
      setLoading({main: false, submit: false});
    }
  };

  const onLoginError = () => {
    let eLogin = authState.get('errorHelperLogin');
    if (typeof eLogin === 'object') {
      eLogin = t('sign_in:error_login');
    }

    showMessage({
      message: t('common:app_name'),
      description: eLogin,
      type: 'danger',
      icon: 'danger',
    });
    setLoading({main: false, submit: false});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Check has save data login */
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

  useEffect(() => {
    if (themeContext.themeApp !== prevTheme) {
      IS_ANDROID &&
        StatusBar.setBackgroundColor(theme['background-basic-color-3'], true);
    }
  }, [prevTheme, themeContext.themeApp]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      backgroundColor={theme['background-basic-color-3']}>
      {/** Header */}
      <CTopNavigation
        style={{backgroundColor: theme['background-basic-color-3']}}
        leftTitle={'sign_in:title'}
        logo
        darkmode
      />
      {/** Content */}
      <ScrollView contentContainerStyle={cStyles.flex1}>
        <Layout
          style={[
            cStyles.flex1,
            cStyles.mt16,
            cStyles.roundedTopLeft5,
            cStyles.roundedTopRight5,
            cStyles.py16,
            cStyles.px32,
          ]}>
          {/** Form input */}
          <CForm
            ref={formRef}
            loading={loading.main || loading.submit}
            inputs={[
              {
                id: INPUT_NAME.USER_NAME,
                type: 'text',
                label: 'sign_in:input_username',
                holder: 'sign_in:input_holder_username',
                value: values.userName,
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.PASSWORD,
                type: 'text',
                label: 'sign_in:input_password',
                holder: 'sign_in:input_holder_password',
                value: values.password,
                required: true,
                password: true,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
              },
            ]}
            customAddingForm={
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                  cStyles.mt20,
                ]}>
                <CheckBox
                  disabled={loading.main || loading.submit}
                  checked={values.saveAccount}
                  onChange={handleSaveAccount}>
                  {t('sign_in:save_account')}
                </CheckBox>

                <TouchableWithoutFeedback
                  disabled={loading.main || loading.submit}
                  onPress={handleGoForgotPassword}>
                  <CText
                    style={cStyles.textUnderline}
                    status={
                      loading.main || loading.submit ? 'basic' : 'primary'
                    }>
                    {t('sign_in:forgot_password')}
                  </CText>
                </TouchableWithoutFeedback>
              </View>
            }
            disabledButton={loading.main || loading.submit}
            labelButton={'sign_in:title'}
            onSubmit={handleSignIn}
          />
        </Layout>
      </ScrollView>
    </CContainer>
  );
}

const styles = StyleSheet.create({
  img_biometrics: {height: moderateScale(80), width: moderateScale(50)},
});

export default Login;
