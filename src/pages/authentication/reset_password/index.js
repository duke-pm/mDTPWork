/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Reset password screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import {fromJS} from 'immutable';
import React, {useRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme, Layout} from '@ui-kitten/components';
import {View} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigator/Routes';
import {cStyles} from '~/utils/style';
import {moderateScale, resetRoute} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

const MyIconAnim = Animatable.createAnimatableComponent(IoniIcon);
const sIconStatus = moderateScale(120);

/** All init */
const INPUT_NAME = {
  PASSWORD: 'password',
};

function ResetPassword(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation, route} = props;
  const tokenData = route.params?.tokenData || 'not_token';
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
  const [loading, setLoading] = useState({
    check: false,
    update: false,
  });
  const [values, setValues] = useState({
    password: '',
    success: false,
    error: false,
    errorExpired: false,
  });
  const [showAlert, setShowAlert] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBack = () => resetRoute(navigation, Routes.LOGIN_IN.name);

  /**********
   ** FUNC **
   **********/
  const onSubmitSave = () => {
    setLoading({...loading, update: true});
    /** Set value for password */
    let tmpCallback = formRef.current?.onCallbackValue();
    setValues({password: tmpCallback.valuesAll[0].value});
    /** Submit */
    let params = {
      Lang: language,
      TokenData: tokenData,
      NewPassword: values.password,
    };
    dispatch(Actions.fetchUpdatePassword(params));
  };

  const onCheckTokenExpired = () => {
    let params = fromJS({
      Token: tokenData,
      Lang: language,
    });
    dispatch(Actions.fetchCheckTokenPassword(params));
    setLoading({...loading, check: true});
  };

  const onCompleteCheck = (status, message) => {
    setValues({
      ...values,
      error: false,
      errorExpired: !status
        ? message || 'forgot_password:error_holder_cannot_change_password_1'
        : false,
    });
    setLoading({check: false, update: false});
    !status && setShowAlert(true);
  };

  const onCompleteChange = (status, message) => {
    setValues({
      ...values,
      success: status,
      error: message || 'forgot_password:error_change_password',
      errorExpired: false,
    });
    setLoading({check: false, update: false});
    setShowAlert(true);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(async () => {
    dispatch(Actions.resetCheckTokenPassword());
    onCheckTokenExpired();
  }, []);

  useEffect(() => {
    if (loading.check) {
      if (!authState.get('submittingCheckTokenPass')) {
        if (authState.get('successCheckTokenPass')) {
          return onCompleteCheck(true);
        }

        if (authState.get('errorCheckTokenPass')) {
          return onCompleteCheck(false);
        }
      }
    }
  }, [
    loading.check,
    authState.get('submittingCheckTokenPass'),
    authState.get('successCheckTokenPass'),
    authState.get('errorCheckTokenPass'),
  ]);

  useEffect(() => {
    if (loading.update) {
      if (!authState.get('submittingUpdatePass')) {
        if (authState.get('successUpdatePass')) {
          return onCompleteChange(true);
        }

        if (authState.get('errorUpdatePass')) {
          return onCompleteChange(
            false,
            typeof authState.get('errorHelperUpdatePass') === 'string'
              ? authState.get('errorHelperUpdatePass')
              : null,
          );
        }
      }
    }
  }, [
    loading.update,
    authState.get('submittingUpdatePass'),
    authState.get('successUpdatePass'),
    authState.get('errorUpdatePass'),
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
        leftTitle={'reset_password:title'}
        back
        onPressCustomBack={handleGoBack}
      />

      {/** Content prepare send */}
      {!showAlert && (
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
            <CText style={cStyles.textCenter} category="p1">
              {t('reset_password:caption')}
            </CText>
          </View>

          {/** Form input */}
          <CForm
            ref={formRef}
            loading={loading.check || loading.update}
            inputs={[
              {
                id: INPUT_NAME.PASSWORD,
                type: 'text',
                label: 'reset_password:input_label_password',
                holder: 'reset_password:input_holder_password',
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
            leftButton={loading.check || loading.update}
            labelButton={'reset_password:save'}
            onSubmit={onSubmitSave}
          />
        </Layout>
      )}

      {/** Content when success */}
      {showAlert && values.success && (
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
          <View style={cStyles.mt16}>
            <CText style={cStyles.textCenter} category="s1">
              {t('reset_password:success_sub_title')}
            </CText>
            <CText style={[cStyles.mt16, cStyles.textCenter]}>
              {t('reset_password:success_caption')}
            </CText>
          </View>
        </Layout>
      )}

      {showAlert && !values.success && (
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
          <View style={cStyles.mt16}>
            <CText style={cStyles.textCenter} category="s1">
              {t('reset_password:error_sub_title')}
            </CText>
            <CText style={[cStyles.mt16, cStyles.textCenter]}>
              {values.errorExpired !== ''
                ? t(values.errorExpired)
                : t(values.error)}
            </CText>
          </View>
        </Layout>
      )}
    </CContainer>
  );
}

export default ResetPassword;
