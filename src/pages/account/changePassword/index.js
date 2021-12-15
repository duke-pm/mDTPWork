/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Change password screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ChangePassword.js
 **/
import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Card} from '@ui-kitten/components';
import {View, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigator/Routes';
import {cStyles} from '~/utils/style';
import {AST_LOGIN} from '~/configs/constants';
import {removeSecretInfo, resetRoute} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All init */
const INPUT_NAME = {
  CUR_PASSWORD: 'currentPassword',
  NEW_PASSWORD: 'newPassword',
  CON_PASSWORD: 'confirmPassword',
};

function ChangePassword(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** use ref */
  const formRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({
    currentPassword: false,
    currentPasswordHelper: '',
    newPassword: false,
    newPasswordHelper: '',
    confirmPassword: false,
    confirmPasswordHelper: '',
  });

  /**********
   ** FUNC **
   **********/
  const onSubmit = () => {
    Keyboard.dismiss();
    /** Check value */
    let tmpCallback = formRef.current?.onCallbackValue();
    /** Submit */
    let params = {
      Lang: language,
      RefreshToken: refreshToken,
      CurrentPassword: tmpCallback.valuesAll[0].value.trim(),
      NewPassword: tmpCallback.valuesAll[1].value.trim(),
    };
    dispatch(Actions.fetchChangePassword(params, navigation));
    setLoading(true);
  };

  const onCompleteChange = (status, message, isRemoveValue) => {
    if (isRemoveValue) {
      setValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    done(status, message);
  };

  const done = async (isSuccess, message) => {
    setLoading(false);
    !isSuccess &&
      showMessage({
        message: t('common:app_name'),
        description: message || t('change_password:error_change'),
        type: 'danger',
        icon: 'danger',
      });
    if (isSuccess) {
      showMessage({
        message: t('common:app_name'),
        description: t('change_password:success_change'),
        type: 'success',
        icon: 'success',
      });
      dispatch(Actions.logout());
      await removeSecretInfo(AST_LOGIN);
      resetRoute(navigation, Routes.LOGIN_IN.name);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loading) {
      if (!authState.get('submittingChangePass')) {
        if (authState.get('successChangePass')) {
          return onCompleteChange(true, null, true);
        }

        if (authState.get('errorChangePass')) {
          return onCompleteChange(
            false,
            typeof authState.get('errorHelperChangePass') === 'string'
              ? authState.get('errorHelperChangePass')
              : null,
            false,
          );
        }
      }
    }
  }, [
    loading,
    authState.get('submittingChangePass'),
    authState.get('successChangePass'),
    authState.get('errorChangePass'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={
        <CTopNavigation
          title='change_password:title'
          back
          borderBottom
        />
      }>
      <KeyboardAwareScrollView contentContainerStyle={cStyles.p16}>
        <Card
          disabled
          header={
            <View>
              <CText category='label'>{t('change_password:sub_title')}</CText>
              <CText style={cStyles.mt5} category='c1' appearance={'hint'}>
                {t('change_password:warning_logout')}
              </CText>
            </View>
          }>
          <CForm
            ref={formRef}
            loading={loading}
            inputs={[
              {
                id: INPUT_NAME.CUR_PASSWORD,
                style: cStyles.mt10,
                type: 'text',
                label: 'change_password:current_password',
                holder: 'change_password:current_password',
                value: values.currentPassword,
                required: true,
                password: true,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.NEW_PASSWORD,
                type: 'text',
                label: 'change_password:new_password',
                holder: 'change_password:new_password',
                value: values.newPassword,
                required: true,
                password: true,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.CON_PASSWORD,
                type: 'text',
                label: 'change_password:confirm_password',
                holder: 'change_password:confirm_password',
                value: values.confirmPassword,
                required: true,
                password: true,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
                validate: {type: 'like', helper: ''},
              },
            ]}
            disabledButton={loading}
            labelButton={'common:save'}
            onSubmit={onSubmit}
          />
        </Card>
      </KeyboardAwareScrollView>
    </CContainer>
  )
}

export default ChangePassword;
