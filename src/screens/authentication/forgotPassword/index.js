/**
 ** Name: Forgot Password
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ForgotPassword.js
 **/
import React, {createRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Lottie from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CInput from '~/components/CInput';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, scalePx, validatEemail} from '~/utils/helper';
import {Animations} from '~/utils/asset';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  EMAIL: 'email',
};

/** All refs use on this screen */
let emailRef = createRef();

function ForgotPassword(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    success: false,
    error: false,
  });
  const [error, setError] = useState({
    email: false,
    emailHelper: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSend = () => {
    let isValid = onCheckValid();
    if (isValid) {
      onSubmit();
    }
  };

  const handleChangeText = (value, nameInput) => {
    setForm({...form, email: value});
    if (error.email) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({...error, email: false});
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  /**********
   ** FUNC **
   **********/
  const onCheckValid = () => {
    if (!error.email) {
      if (form.email.trim() === '') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({
          email: true,
          emailHelper: 'forgot_password:error_email_not_fill',
        });
        return false;
      }
      let isEmail = validatEemail(form.email);
      if (!isEmail) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setError({
          email: true,
          emailHelper: 'forgot_password:error_email_format',
        });
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setForm({...form, success: true, error: false});
    }, 2000);
  };

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      safeArea={{
        top: false,
        bottom: false,
      }}
      loading={loading}
      title={'forgot_password:title'}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            style={cStyles.flex1}
            colors={colors.BACKGROUND_GRADIENT}>
            {!form.success && !form.error && (
              <CContent
                style={[
                  styles.container,
                  cStyles.flexCenter,
                  cStyles.px48,
                  cStyles.pt32,
                ]}>
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
                    selectionColor={colors.WHITE}
                    holderColor={colors.GRAY_500}
                    inputRef={emailRef}
                    disabled={loading}
                    icon={'mail'}
                    iconColor={colors.GRAY_500}
                    holder={'forgot_password:input_email'}
                    returnKey={'send'}
                    error={error.email}
                    errorHelper={error.emailHelper}
                    onChangeValue={handleChangeText}
                    onChangeInput={handleSend}
                  />

                  <CButton
                    style={cStyles.mt16}
                    block
                    disabled={loading}
                    icon={'send'}
                    label={'common:send'}
                    onPress={handleSend}
                  />

                  <CButton
                    style={cStyles.mt16}
                    textStyle={cStyles.textUnderline}
                    block
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </CContent>
            )}

            {form.success && !form.error && (
              <CContent
                style={[
                  styles.container,
                  cStyles.itemsCenter,
                  cStyles.px48,
                  cStyles.pt40,
                ]}>
                <View style={[cStyles.center, cStyles.py20]}>
                  <Icon
                    name={'mail'}
                    color={colors.GRAY_500}
                    size={scalePx(10)}
                  />
                  <Lottie
                    style={[cStyles.abs, styles.icon]}
                    source={Animations.approved}
                    autoPlay
                    loop={false}
                  />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:success_title'}
                  />

                  <Text style={[cStyles.textCenter, cStyles.mt16]}>
                    <Text style={[cStyles.textDefault, cStyles.colorWhite]}>
                      {`${t('forgot_password:success_content_1')} `}
                    </Text>
                    <Text style={[cStyles.textTitle, cStyles.colorWhite]}>
                      {'example@example.com.'}
                    </Text>
                  </Text>

                  <Text style={[cStyles.textCenter, cStyles.mt16]}>
                    <Text style={[cStyles.textDefault, cStyles.colorWhite]}>
                      {`${t('forgot_password:success_content_2')} `}
                    </Text>
                    <Text style={[cStyles.textTitle, cStyles.colorWhite]}>
                      {`"${t('forgot_password:success_content_3')}" `}
                    </Text>
                    <Text style={[cStyles.textDefault, cStyles.colorWhite]}>
                      {`${t('forgot_password:success_content_4')}`}
                    </Text>
                  </Text>
                </View>

                <View style={cStyles.mt16}>
                  <CButton
                    textStyle={cStyles.textUnderline}
                    block
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </CContent>
            )}

            {!form.success && form.error && (
              <CContent
                style={[
                  styles.container,
                  cStyles.itemsCenter,
                  cStyles.px48,
                  cStyles.pt40,
                ]}>
                <View style={[cStyles.center, cStyles.py20]}>
                  <Icon
                    name={'mail'}
                    color={colors.GRAY_500}
                    size={scalePx(10)}
                  />
                  <Lottie
                    style={[cStyles.abs, styles.icon_error]}
                    source={Animations.rejected}
                    autoPlay
                    loop={false}
                  />
                </View>

                <View style={cStyles.py16}>
                  <CText
                    styles={'H3 textCenter colorWhite'}
                    label={'forgot_password:error_title'}
                  />

                  <Text style={[cStyles.textCenter, cStyles.mt16]}>
                    <Text style={[cStyles.textDefault, cStyles.colorWhite]}>
                      {`${t('forgot_password:error_content_1')} `}
                    </Text>
                    <Text style={[cStyles.textTitle, cStyles.colorWhite]}>
                      {'example@example.com.'}
                    </Text>
                  </Text>

                  <CText
                    styles={'textCenter colorWhite mt20'}
                    label={'forgot_password:error_content_2'}
                  />
                </View>

                <View style={cStyles.mt16}>
                  <CButton
                    textStyle={cStyles.textUnderline}
                    block
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </CContent>
            )}
          </LinearGradient>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.TRANSPARENT},
  con_icon_app: {flex: 0.2},
  con_input: {flex: 0.8},
  input: {
    backgroundColor: colors.TRANSPARENT,
    color: colors.WHITE,
  },

  icon: {width: 50, height: 50, bottom: 10},
  icon_error: {width: 27, height: 27, bottom: 13},
});

export default ForgotPassword;
