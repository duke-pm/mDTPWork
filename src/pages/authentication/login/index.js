/**
 ** Name: Login screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useRef, useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {usePrevious} from '~/utils/hook';
import {useTheme, Layout, CheckBox, Button, Text} from '@ui-kitten/components';
import {View, StatusBar, Linking, ScrollView} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import VersionCheck from 'react-native-version-check';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CLoading from '~/components/CLoading';
import CForm from '~/components/CForm';
/* COMMON */
import Configs from '~/configs';
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {ThemeContext} from '~/configs/theme-context';
import {AST_LANGUAGE, AST_LOGIN} from '~/configs/constants';
import {cStyles} from '~/utils/style';
import {
  getLocalInfo,
  getSecretInfo,
  saveSecretInfo,
  removeSecretInfo,
  resetRoute,
  IS_ANDROID,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const MyContent = Animatable.createAnimatableComponent(Layout);

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
  const bgHeader = theme['background-basic-color-2'];
  let prevTheme = usePrevious(themeContext.themeApp);

  /** use ref */
  const formRef = useRef();
  const contentRef = useRef();

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
  const [versionApp, setVersionApp] = useState({
    needUpdate: false,
    number: '1.0.0',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSaveAccount = checked => {
    setValues({...values, saveAccount: checked});
  };

  const handleGoForgotPassword = () => {
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

  const handleUpdateAppNow = () => {
    VersionCheck.needUpdate()
      .then(async res => {
        if (res.isNeeded) {
          Linking.openURL(res.storeUrl);
        }
      });
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

  const onCheckLocalLogin = async () => {
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
      let i = 0,
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

  const onCheckVersionApp = async () => {
    /** Get version app from store */
    let tmpVersionCheck = {...versionApp},
      latestVersion = await VersionCheck.getLatestVersion(),
      needUpdate = await VersionCheck.needUpdate();
    if (latestVersion)
      tmpVersionCheck.number = latestVersion;
    if (needUpdate && needUpdate.isNeeded)
      tmpVersionCheck.needUpdate = needUpdate;
    setVersionApp(tmpVersionCheck);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Check version app */
    if (!__DEV__) {
      onCheckVersionApp();
    }
    /** Check has save data login */
    onCheckLocalLogin();
  }, []);

  useEffect(() => {
    if (loading.submit && !loading.main) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return contentRef.current.fadeOutDown(1000).then(endState => {
            if (endState.finished) {
              onPrepareData();
            }
          });
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
        StatusBar.setBackgroundColor(bgHeader, true);
    }
  }, [prevTheme, themeContext.themeApp]);

  /************
   ** RENDER **
   ************/
  
  return (
    <CContainer
      safeArea={['top']}
      backgroundColor={bgHeader}>
      {/** Header */}
      <CTopNavigation
        style={{backgroundColor: bgHeader}}
        leftTitle="sign_in:title"
        leftSubtitle="sign_in:sub_title"
        logo
        darkmode
      />
      {/** Content */}
      <ScrollView
        contentContainerStyle={cStyles.flex1}
        keyboardShouldPersistTaps="handled">
        <MyContent
          ref={contentRef}
          style={[
            cStyles.flex1,
            cStyles.justifyBetween,
            cStyles.roundedTopLeft5,
            cStyles.roundedTopRight5,
            cStyles.shadowListItem,
            cStyles.mt32,
            cStyles.py16,
            cStyles.px32,
          ]}
          animation="fadeInUp">
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
                <Button
                  disabled={loading.main || loading.submit}
                  appearance="ghost"
                  onPress={handleGoForgotPassword}>
                  {propsB =>
                    <Text style={cStyles.textUnderline} status="primary">
                      {t('sign_in:forgot_password')}
                    </Text>
                  }
                </Button>
              </View>
            }
            disabledButton={loading.main || loading.submit}
            labelButton={'sign_in:button_sign_in'}
            onSubmit={handleSignIn}
          />
          <View style={[cStyles.center, cStyles.justifyEnd, cStyles.pb36]}>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyCenter]}>
              <Text category="c1" appearance="hint">
                {`${t('sign_in:version')} ${versionApp.number}`}
              </Text>
              {versionApp.needUpdate && (
                <Button
                  style={cStyles.ml10}
                  size="tiny"
                  status="warning"
                  appearance="outline"
                  onPress={handleUpdateAppNow}>
                  {`${t('sign_in:holder_update_now')}`}
                </Button>
              )}
            </View>
            <Text style={[cStyles.mt10, cStyles.textCenter]} category="c1" appearance="hint">
              &#169; {`${moment().year()} ${t('sign_in:copyright_by')}\n${Configs.nameOfCompany}`}
            </Text>
          </View>
        </MyContent>
      </ScrollView>
      {/** Loading */}
      <CLoading
        show={loading.submit}
        description='common:doing_signin'
      />
    </CContainer>
  );
}

export default Login;
