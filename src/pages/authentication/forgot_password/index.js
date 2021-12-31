/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Forgot password screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import {fromJS} from 'immutable';
import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Layout, useTheme, Text} from '@ui-kitten/components';
import {View} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CLoading from '~/components/CLoading';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const MyIconAnim = Animatable.createAnimatableComponent(IoniIcon);
const sIconStatus = moderateScale(120);

/** All init */
const INPUT_NAME = {
  EMAIL: 'email',
};

function ForgotPassword(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const bgHeader = theme['background-basic-color-3'];
  const colorSuccess = theme['color-success-500'];
  const colorError = theme['color-danger-500'];

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

  /**********
   ** FUNC **
   **********/
  const onSubmitSend = () => {
    setLoading(true);
    /** Set value for email */
    let tmpCallback = formRef.current?.onCallbackValue();
    setValues({email: tmpCallback.valuesAll[0].value});
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
      backgroundColor={bgHeader}>
      {/** Header */}
      <CTopNavigation
        style={{backgroundColor: bgHeader}}
        back
        leftTitle={'forgot_password:title'}
      />
      {/** Content prepare send */}
      {!showAlert.status && (
        <Layout
          style={[
            cStyles.flex1,
            cStyles.mt32,
            cStyles.roundedTopLeft5,
            cStyles.roundedTopRight5,
            cStyles.py16,
            cStyles.px32,
          ]}>
          {/** Caption */}
          <View style={cStyles.mt16}>
            <Text style={cStyles.textCenter}>
              {t('forgot_password:caption')}
            </Text>
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
            cStyles.mt32,
            cStyles.roundedTopLeft5,
            cStyles.roundedTopRight5,
            cStyles.py16,
            cStyles.px32,
          ]}>
          <View style={cStyles.itemsCenter}>
            <MyIconAnim
              name={'checkmark-circle-outline'}
              size={sIconStatus}
              color={colorSuccess}
              animation="pulse"
              easing="ease-out"
            />
          </View>
          {/** Sub-title & Caption */}
          <View style={[cStyles.itemsCenter, cStyles.mt16]}>
            <Text style={cStyles.textCenter}>
              {`${t('forgot_password:success_content_1')}`}
            </Text>

            <Text style={cStyles.mt5} category="s1">
              {values.email}
            </Text>

            <Text style={[cStyles.textCenter, cStyles.mt20]}>
              <Text>{`${t('forgot_password:success_content_2')} `}</Text>
              <Text>{`"${t('forgot_password:success_content_3')}" `}</Text>
              <Text>{`${t('forgot_password:success_content_4')}`}</Text>
            </Text>
          </View>
        </Layout>
      )}
      {/** Content when error */}
      {showAlert.status && !showAlert.success && (
        <Layout
          style={[
            cStyles.flex1,
            cStyles.mt32,
            cStyles.roundedTopLeft5,
            cStyles.roundedTopRight5,
            cStyles.py16,
            cStyles.px32,
          ]}>
          <View style={cStyles.itemsCenter}>
            <MyIconAnim
              name={'close-circle-outline'}
              size={sIconStatus}
              color={colorError}
              animation="pulse"
              easing="ease-out"
            />
          </View>

          {/** Sub-title & Caption */}
          <View style={[cStyles.itemsCenter, cStyles.mt16]}>
            <Text style={cStyles.textCenter}>
              {`${t('forgot_password:error_content_1')}`}
            </Text>

            <Text style={cStyles.mt5} category="s1">
              {values.email}
            </Text>

            <Text style={[cStyles.textCenter, cStyles.mt20]}>
              {`${t('forgot_password:error_content_2')}`}
            </Text>
          </View>
        </Layout>
      )}
      {/** Loading */}
      <CLoading show={loading} />
    </CContainer>
  );
}

export default ForgotPassword;
