/**
 ** Name: Change password screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ChangePassword.js
 **/
import React, {createRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';
import Configs from '~/config';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const dispatch = useDispatch();

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

  /** HANDLE FUNC */
  const handleChangeText = (value, nameInput) => {
    setForm({...form, [nameInput]: value});
    if (nameInput === INPUT_NAME.CUR_PASSWORD) {
      if (error.currentPassword) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({...error, currentPassword: false});
      }
    } else if (nameInput === INPUT_NAME.NEW_PASSWORD) {
      if (error.newPassword) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({...error, newPassword: false});
      }
    } else {
      if (error.confirmPassword) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({...error, confirmPassword: false});
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

  /** FUNC */
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
    /** Check new password not lager than */
    if (!status && form.newPassword.trim().length < Configs.lengthNewPassword) {
      status = true;
      errNew.status = true;
      errNew.helper = `${t('change_password:error_length_new_lager')} ${
        Configs.lengthNewPassword
      }.`;
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
    setLoading(true);
    setTimeout(() => {
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      done(true);
    }, 2000);
  };

  const done = isSuccess => {
    setLoading(false);
    isSuccess &&
      showMessage({
        message: t('common:app_name'),
        description: t('change_password:success_change'),
        type: 'success',
        icon: 'success',
      });
    !isSuccess &&
      showMessage({
        message: t('common:app_name'),
        description: t('change_password:error_change'),
        type: 'danger',
        icon: 'danger',
      });
  };

  /** RENDER */
  return (
    <CContainer
      loading={loading}
      title={'change_password:title'}
      header
      hasBack
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <CContent scroll padder>
            <CText label={'change_password:sub_title'} />

            {/** Current password */}
            <View style={cStyles.pt16}>
              <CLabel medium label={'change_password:current_password'} />
              <CInput
                name={INPUT_NAME.CUR_PASSWORD}
                styleFocus={styles.input_focus}
                inputRef={curPasswordRef}
                disabled={loading}
                holder={'change_password:current_password'}
                value={form.currentPassword}
                keyboard={'default'}
                returnKey={'next'}
                password
                error={error.currentPassword}
                errorHelper={error.currentPasswordHelper}
                onChangeInput={() => handleChangeInput(newPasswordRef)}
                onChangeValue={handleChangeText}
              />
            </View>

            {/** New password */}
            <View style={cStyles.pt16}>
              <CLabel medium label={'change_password:new_password'} />
              <CInput
                name={INPUT_NAME.NEW_PASSWORD}
                styleFocus={styles.input_focus}
                inputRef={newPasswordRef}
                disabled={loading}
                holder={'change_password:new_password'}
                value={form.newPassword}
                keyboard={'default'}
                returnKey={'next'}
                password
                error={error.newPassword}
                errorHelperCustom={error.newPasswordHelper}
                onChangeInput={() => handleChangeInput(confirmPasswordRef)}
                onChangeValue={handleChangeText}
              />
            </View>

            {/** Confirm password */}
            <View style={cStyles.pt16}>
              <CLabel medium label={'change_password:confirm_password'} />
              <CInput
                name={INPUT_NAME.CON_PASSWORD}
                styleFocus={styles.input_focus}
                inputRef={confirmPasswordRef}
                disabled={loading}
                holder={'change_password:confirm_password'}
                value={form.confirmPassword}
                keyboard={'default'}
                returnKey={'done'}
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
              variant={isDark ? 'outlined' : 'contained'}
              icon={'save'}
              label={'common:save'}
              onPress={handleChangePassword}
            />
          </CContent>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
});

export default ChangePassword;
