/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Forgot password screen
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import {fromJS} from 'immutable';
import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Layout, useTheme} from '@ui-kitten/components';
import {ScrollView, View} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const MyIconAnim = Animatable.createAnimatableComponent(IoniIcon);

/** All init */
const INPUT_NAME = {
  EMAIL: 'email',
};

function ForgotPassword(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** use ref */
  const formRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
  });
  const [showAlert, setShowAlert] = useState({
    status: false,
    success: false,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBack = () => {
    navigation.goBack();
  };

  /**********
   ** FUNC **
   **********/
  const onSubmitSend = () => {
    setLoading(true);
    /** Set value for email */
    let tmpCallback = formRef.current?.onCallbackValue();
    /** Submit */
    let params = fromJS({
      Lang: language,
      Email: tmpCallback.valuesAll[0].value.toLowerCase(),
    });
    dispatch(Actions.fetchForgotPassword(params));
  };

  const onCompleteSend = isSuccess => {
    setShowAlert({status: true, success: isSuccess});
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
          return onCompleteSend(false);
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
      safeArea={['top']}
      backgroundColor={theme['background-basic-color-3']}>
      {/** Header */}
      <CTopNavigation
        style={{backgroundColor: theme['background-basic-color-3']}}
        back
        leftTitle={'forgot_password:title'}
      />
      <ScrollView contentContainerStyle={cStyles.flex1}>
        {/** Content prepare send */}
        {!showAlert.status && (
          <Layout
            style={[
              cStyles.flex1,
              cStyles.mt16,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.py16,
              cStyles.px32,
            ]}>
            {/** Caption */}
            <View style={cStyles.mt16}>
              <CText style={cStyles.textCenter} category="p1">
                {t('forgot_password:caption')}
              </CText>
            </View>

            <CForm
              ref={formRef}
              loading={loading}
              inputs={[
                {
                  id: INPUT_NAME.EMAIL,
                  type: 'text',
                  label: 'forgot_password:input_email',
                  holder: 'forgot_password:input_holder_email',
                  value: values.email,
                  required: true,
                  password: false,
                  email: true,
                  phone: false,
                  number: false,
                  next: false,
                  return: 'send',
                  validate: {type: 'format_email', helper: ''},
                },
              ]}
              leftButton={loading}
              labelButton={'common:send'}
              disabledButton={loading}
              onSubmit={onSubmitSend}
            />
          </Layout>
        )}

        {/** Content when success */}
        {showAlert.status && showAlert.success && (
          <Layout
            style={[
              cStyles.flex1,
              cStyles.mt16,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.py16,
              cStyles.px32,
            ]}>
            <View style={cStyles.itemsCenter}>
              <MyIconAnim
                name={'checkmark-circle-outline'}
                size={moderateScale(150)}
                color={theme['color-success-500']}
                animation="pulse"
                easing="ease-out"
              />
            </View>

            {/** Sub-title & Caption */}
            <View style={[cStyles.itemsCenter, cStyles.mt16]}>
              <CText style={cStyles.textCenter}>
                {`${t('forgot_password:success_content_1')}`}
              </CText>

              <CText style={cStyles.mt5} category="label">
                {values.email}
              </CText>

              <CText style={[cStyles.textCenter, cStyles.mt20]}>
                <CText>{`${t('forgot_password:success_content_2')} `}</CText>
                <CText>{`"${t('forgot_password:success_content_3')}" `}</CText>
                <CText>{`${t('forgot_password:success_content_4')}`}</CText>
              </CText>
            </View>
          </Layout>
        )}
        {showAlert.status && !showAlert.success && (
          <Layout
            style={[
              cStyles.flex1,
              cStyles.mt16,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.py16,
              cStyles.px32,
            ]}>
            <View style={cStyles.itemsCenter}>
              <MyIconAnim
                name={'close-circle-outline'}
                size={moderateScale(150)}
                color={theme['color-danger-500']}
                animation="pulse"
                easing="ease-out"
              />
            </View>

            {/** Sub-title & Caption */}
            <View style={[cStyles.itemsCenter, cStyles.mt16]}>
              <CText style={cStyles.textCenter}>
                {`${t('forgot_password:error_content_1')}`}
              </CText>

              <CText style={cStyles.mt5} category="label">
                {values.email}
              </CText>

              <CText style={[cStyles.textCenter, cStyles.mt20]}>
                {`${t('forgot_password:error_content_2')}`}
              </CText>
            </View>
          </Layout>
        )}
      </ScrollView>
    </CContainer>
  );
}

export default ForgotPassword;
