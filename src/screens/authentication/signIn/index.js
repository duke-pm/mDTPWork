/**
 ** Name: SignIn
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of SignIn.js
 **/
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  KeyboardAvoidingView,
} from 'react-native';
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
import { colors, cStyles } from '~/utils/style';
import { IS_IOS } from '~/utils/helper';
/* REDUX */

const INPUT_NAME = {
  USER_NAME: 'userName',
  PASSWORD: 'password',
};

function SignIn(props) {
  const { t } = useTranslation();
  let userNameRef = useRef();
  let passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userName: '',
    password: '',
    saveAccount: false,
  });

  /** HANDLE FUNC */
  const handleChangeInput = (inputRef) => {
    if (inputRef) inputRef.focus();
  };

  const handleForgotPassword = () => {

  };

  const handleSaveAccount = (checked) => {
    setForm({
      ...form,
      saveAccount: checked
    });
  };

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      props.navigation.navigate(Routes.ROOT_STACK.name);
    }, 2000);
  };

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: false,
        bottom: false,
      }}
      loading={loading}
      content={
        <ImageBackground
          style={styles.img_background}
          source={Assets.bgAuthentication}
          resizeMode={'cover'}
          blurRadius={5}
        >
          <View style={[cStyles.flex1, styles.content]}>
            <KeyboardAvoidingView
              style={cStyles.flex1}
              behavior={IS_IOS ? 'padding' : undefined}
            >
              <CContent contentStyle={[cStyles.flexCenter, cStyles.px48]}>
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
                    id={INPUT_NAME.USER_NAME}
                    inputRef={ref => userNameRef = ref}
                    disabled={loading}
                    icon={'user'}
                    iconColor={colors.GRAY_500}
                    holder={'sign_in:input_username'}
                    valueColor={colors.WHITE}
                    returnKey={'next'}
                    autoFocus
                    onChangeInput={() => handleChangeInput(passwordRef)}
                  />

                  <CInput
                    id={INPUT_NAME.PASSWORD}
                    inputRef={ref => passwordRef = ref}
                    disabled={loading}
                    icon={'lock'}
                    iconColor={colors.GRAY_500}
                    holder={'sign_in:input_password'}
                    valueColor={colors.WHITE}
                    returnKey={'done'}
                    password
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
                    disabled={loading}
                    label={'sign_in:title'}
                    onPress={handleSignIn}
                  />
                </View>
              </CContent>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  con_icon_app: {
    flex: 0.3
  },
  con_middle: {
    flex: 0.1
  },
  con_input: {
    flex: 0.6,
  },

  img_background: {
    height: '100%',
    width: '100%'
  },
  img_icon_app: {
    height: 100,
    width: 100
  }
});

export default SignIn;
