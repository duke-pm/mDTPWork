/**
 ** Name: Forgot Password
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ForgotPassword.js
 **/
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CInput from '~/components/CInput';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/* COMMON */
import Assets from '~/utils/asset/Assets';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';
/* REDUX */

const INPUT_NAME = {
  EMAIL: 'email',
};

function ForgotPassword(props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
  });

  /** HANDLE FUNC */
  const handleSend = () => {};

  /** RENDER */
  return (
    <CContainer
      loading={loading}
      title={'forgot_password:title'}
      header
      hasBack
      content={
        <ImageBackground
          style={styles.img_background}
          source={Assets.bgAuthentication}
          resizeMode={'cover'}
          blurRadius={5}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[cStyles.flex1, styles.content]}>
              <KeyboardAvoidingView
                style={cStyles.flex1}
                behavior={IS_IOS ? 'padding' : undefined}>
                <CContent
                  style={styles.con}
                  contentStyle={[cStyles.flexCenter, cStyles.px48]}>
                  <View
                    style={[
                      cStyles.itemsCenter,
                      cStyles.justifyCenter,
                      styles.con_icon_app,
                    ]}>
                    <CText
                      styles={'textCenter colorWhite'}
                      label={'forgot_password:sub_title'}
                    />
                  </View>

                  <View style={styles.con_input}>
                    <CInput
                      id={INPUT_NAME.EMAIL}
                      style={styles.input}
                      valueColor={colors.WHITE}
                      disabled={loading}
                      icon={'mail'}
                      iconColor={colors.GRAY_500}
                      holder={'forgot_password:input_email'}
                      returnKey={'send'}
                      onChangeInput={handleSend}
                    />

                    <CButton
                      style={cStyles.mt16}
                      block
                      disabled={loading}
                      label={'common:send'}
                      onPress={handleSend}
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
}

const styles = StyleSheet.create({
  con: {backgroundColor: colors.TRANSPARENT},
  content: {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
  con_icon_app: {flex: 0.2},
  con_input: {flex: 0.8},
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },

  img_background: {height: '100%', width: '100%'},
  img_icon_app: {height: 250, width: 250},
});

export default ForgotPassword;
