/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Forgot Password
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ForgotPassword.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CInput from '~/components/CInput';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import CAvoidKeyboard from '~/components/CAvoidKeyboard';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {
  IS_ANDROID,
  moderateScale,
  validatEemail,
  verticalScale,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  EMAIL: 'email',
};

function ForgotPassword(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    success: false,
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
    let params = fromJS({
      Lang: language,
      Email: form.email.toLowerCase(),
    });
    dispatch(Actions.fetchForgotPassword(params));
    setLoading(true);
  };

  const onCompleteSend = (status, message) => {
    setForm({
      email: form.email,
      success: status,
    });
    !status &&
      showMessage({
        message: t('common:app_name'),
        description: message || t('change_password:error_change'),
        type: 'danger',
        icon: 'danger',
      });
    setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loading) {
      if (!authState.get('submittingForgotPass')) {
        if (authState.get('successForgotPass')) {
          return onCompleteSend(true);
        }

        if (authState.get('errorForgotPass')) {
          return onCompleteSend(
            false,
            typeof authState.get('errorHelperForgotPass') === 'string'
              ? authState.get('errorHelperForgotPass')
              : null,
          );
        }
      }
    }
  }, [
    loading,
    authState.get('submittingForgotPass'),
    authState.get('successForgotPass'),
    authState.get('errorForgotPass'),
  ]);

  /************
   ** RENDER **
   ************/
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
            {!form.success && (
              <CAvoidKeyboard>
                <View style={cStyles.flexCenter}>
                  <View style={styles.box}>
                    <View
                      style={[
                        cStyles.itemsCenter,
                        cStyles.justifyEnd,
                        styles.container_title,
                      ]}>
                      <CText
                        customStyles={[
                          cStyles.textCenter,
                          cStyles.colorWhite,
                          styles.text_title,
                        ]}
                        label={'forgot_password:sub_title'}
                      />
                    </View>

                    <View style={[styles.container_input, cStyles.fullWidth]}>
                      <CInput
                        id={INPUT_NAME.EMAIL}
                        style={styles.input}
                        styleInput={styles.input}
                        styleFocus={styles.input_focus}
                        selectionColor={colors.WHITE}
                        holderColor={colors.GRAY_500}
                        disabled={loading}
                        keyboard={'email-address'}
                        icon={Icons.mail}
                        iconColor={colors.GRAY_500}
                        holder={'forgot_password:input_email'}
                        returnKey={'send'}
                        error={error.email}
                        errorHelper={error.emailHelper}
                        onChangeValue={handleChangeText}
                        onChangeInput={handleSend}
                      />

                      <View style={styles.separator} />

                      <CButton
                        block
                        disabled={loading}
                        icon={Icons.send}
                        label={'common:send'}
                        onPress={handleSend}
                      />

                      <View style={styles.separator} />

                      <CText
                        styles={'textUnderline textCenter colorWhite mt16'}
                        label={'forgot_password:button_go_back'}
                        onPress={handleGoBack}
                      />
                    </View>
                  </View>
                </View>
              </CAvoidKeyboard>
            )}

            {form.success && (
              <View style={cStyles.flexCenter}>
                <View style={styles.box2}>
                  <View style={[cStyles.center, cStyles.py20, cStyles.pt32]}>
                    <Icon
                      name={Icons.mailUnread}
                      color={colors.GRAY_500}
                      size={moderateScale(80)}
                    />
                  </View>

                  <View style={cStyles.py16}>
                    <CText
                      styles={'textTitle3 textCenter colorWhite'}
                      label={'forgot_password:success_title'}
                    />

                    <View style={styles.separator} />

                    <Text style={cStyles.textCenter}>
                      <Text style={[cStyles.textBody, cStyles.colorWhite]}>
                        {`${t('forgot_password:success_content_1')} `}
                      </Text>
                      <Text
                        style={[cStyles.textHeadline, cStyles.colorSecondary]}>
                        {form.email}
                      </Text>
                      <Text style={[cStyles.textBody, cStyles.colorWhite]}>
                        {'.'}
                      </Text>
                    </Text>

                    <View style={styles.separator} />

                    <Text style={cStyles.textCenter}>
                      <Text style={[cStyles.textBody, cStyles.colorWhite]}>
                        {`${t('forgot_password:success_content_2')} `}
                      </Text>
                      <Text style={[cStyles.textHeadline, cStyles.colorWhite]}>
                        {`"${t('forgot_password:success_content_3')}" `}
                      </Text>
                      <Text style={[cStyles.textBody, cStyles.colorWhite]}>
                        {`${t('forgot_password:success_content_4')}`}
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.separator} />

                  <CButton
                    textStyle={[cStyles.textSubheadline, cStyles.textUnderline]}
                    block
                    color={colors.WHITE}
                    variant={'text'}
                    label={'forgot_password:button_go_back'}
                    onPress={handleGoBack}
                  />
                </View>
              </View>
            )}
          </LinearGradient>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  container_title: {flex: 0.35},
  container_input: {flex: 0.65},
  input: {backgroundColor: colors.TRANSPARENT, color: colors.WHITE},
  input_focus: {backgroundColor: colors.BACKGROUND_INPUT_FOCUS},
  box: {
    width: moderateScale(300),
    height: verticalScale(550),
    paddingHorizontal: moderateScale(14),
  },
  box2: {
    width: moderateScale(350),
    height: verticalScale(550),
    paddingHorizontal: moderateScale(10),
  },
  text_title: {marginBottom: moderateScale(30)},
  separator: {paddingVertical: verticalScale(6)},
});

export default ForgotPassword;
