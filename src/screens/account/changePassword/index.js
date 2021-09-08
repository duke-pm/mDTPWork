/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Change password screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ChangePassword.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import {
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  StyleSheet,
} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
import CGroupInfo from '~/components/CGroupInfo';
/* COMMON */
import Icons from '~/utils/common/Icons';
import Routes from '~/navigation/Routes';
import {cStyles, colors} from '~/utils/style';
import {BIOMETRICS, LOGIN} from '~/config/constants';
import {
  IS_ANDROID,
  removeSecretInfo,
  resetRoute,
  saveLocalInfo,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All ref */
const INPUT_NAME = {
  CUR_PASSWORD: 'currentPassword',
  NEW_PASSWORD: 'newPassword',
  CON_PASSWORD: 'confirmPassword',
};
let curPasswordRef = createRef();
let newPasswordRef = createRef();
let confirmPasswordRef = createRef();

function ChangePassword(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeText = (value, nameInput) => {
    setForm({...form, [nameInput]: value});
    if (nameInput === INPUT_NAME.CUR_PASSWORD) {
      if (error.currentPassword) {
        onError(INPUT_NAME.CUR_PASSWORD);
      }
    } else if (nameInput === INPUT_NAME.NEW_PASSWORD) {
      if (error.newPassword) {
        onError(INPUT_NAME.NEW_PASSWORD);
      }
    } else {
      if (error.confirmPassword) {
        onError(INPUT_NAME.CON_PASSWORD);
      }
    }
  };

  const handleChangeInput = ref => {
    if (ref) {
      ref.current.focus();
    }
  };

  const handleChangePassword = () => {
    let isValid = onValidate();
    if (!isValid.status) {
      onSubmit();
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({
        currentPassword: isValid.errCur.status,
        currentPasswordHelper: isValid.errCur.helper,
        newPassword: isValid.errNew.status,
        newPasswordHelper: isValid.errNew.helper,
        confirmPassword: isValid.errCon.status,
        confirmPasswordHelper: isValid.errCon.helper,
      });
    }
  };

  /**********
   ** FUNC **
   **********/
  const onError = keyError => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setError({...error, [keyError]: false});
  };

  const onValidate = () => {
    let status = false,
      errCur = {status: false, helper: ''},
      errNew = {status: false, helper: ''},
      errCon = {status: false, helper: ''};
    /** Check fill all input */
    if (!errCur.status && form.currentPassword.trim() === '') {
      status = true;
      errCur.status = true;
      errCur.helper = 'change_password:error_cur_pass_not_fill';
    }
    if (!errNew.status && form.newPassword.trim() === '') {
      status = true;
      errNew.status = true;
      errNew.helper = t('change_password:error_new_pass_not_fill');
    }
    if (!errCon.status && form.confirmPassword.trim() === '') {
      status = true;
      errCon.status = true;
      errCon.helper = 'change_password:error_con_pass_not_fill';
    }
    /** Check new password like cur password */
    if (!status && form.currentPassword.trim() === form.newPassword.trim()) {
      status = true;
      errNew.status = true;
      errNew.helper = t('change_password:error_cur_not_like_new');
    }
    /** Check con password not like new password */
    if (!status && form.newPassword.trim() !== form.confirmPassword.trim()) {
      status = true;
      errCon.status = true;
      errCon.helper = 'change_password:error_new_not_like_confirm';
    }
    return {status, errCur, errNew, errCon};
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    let params = {
      Lang: language,
      RefreshToken: refreshToken,
      CurrentPassword: form.currentPassword,
      NewPassword: form.newPassword,
    };
    dispatch(Actions.fetchChangePassword(params, navigation));
    setLoading(true);
  };

  const onCompleteChange = (status, message, isRemoveValue) => {
    if (isRemoveValue) {
      setForm({
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
      await saveLocalInfo({key: BIOMETRICS, value: '0'});
      await removeSecretInfo(LOGIN);
      resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
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
      loading={loading}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView>
            <CContent scrollEnabled={false}>
              <CGroupInfo
                style={cStyles.pt16}
                labelStyle={cStyles.textCallout}
                label={'change_password:sub_title'}
                content={
                  <>
                    {/** Current password */}
                    <View>
                      <CLabel bold label={'change_password:current_password'} />
                      <CInput
                        inputRef={curPasswordRef}
                        name={INPUT_NAME.CUR_PASSWORD}
                        styleFocus={styles.input_focus}
                        disabled={loading}
                        holder={'change_password:current_password'}
                        value={form.currentPassword}
                        password
                        error={error.currentPassword}
                        errorHelper={error.currentPasswordHelper}
                        onChangeInput={() => handleChangeInput(newPasswordRef)}
                        onChangeValue={handleChangeText}
                      />
                    </View>

                    {/** New password */}
                    <View style={cStyles.pt16}>
                      <CLabel bold label={'change_password:new_password'} />
                      <CInput
                        inputRef={newPasswordRef}
                        name={INPUT_NAME.NEW_PASSWORD}
                        styleFocus={styles.input_focus}
                        disabled={loading}
                        holder={'change_password:new_password'}
                        value={form.newPassword}
                        password
                        error={error.newPassword}
                        errorHelperCustom={error.newPasswordHelper}
                        onChangeInput={() =>
                          handleChangeInput(confirmPasswordRef)
                        }
                        onChangeValue={handleChangeText}
                      />
                    </View>

                    {/** Confirm password */}
                    <View style={cStyles.pt16}>
                      <CLabel bold label={'change_password:confirm_password'} />
                      <CInput
                        name={INPUT_NAME.CON_PASSWORD}
                        styleFocus={styles.input_focus}
                        inputRef={confirmPasswordRef}
                        disabled={loading}
                        holder={'change_password:confirm_password'}
                        value={form.confirmPassword}
                        returnKey={'send'}
                        password
                        error={error.confirmPassword}
                        errorHelper={error.confirmPasswordHelper}
                        onChangeInput={handleChangePassword}
                        onChangeValue={handleChangeText}
                      />
                    </View>

                    <CButton
                      style={cStyles.mt24}
                      block
                      disabled={loading}
                      icon={Icons.save}
                      label={'common:save'}
                      onPress={handleChangePassword}
                    />
                  </>
                }
              />
            </CContent>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
});

export default ChangePassword;
