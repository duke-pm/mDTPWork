/**
 ** Name: Sign Up screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Layout, useTheme, CheckBox} from '@ui-kitten/components';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CAlert from '~/components/CAlert';
/* COMMON */
import {cStyles} from '~/utils/style';
import CText from '~/components/CText';
/* REDUX */


/** All init */
const INPUT_NAME = {
  USER_NAME: 'userName',
  EMAIL: 'email',
  PHONE: 'phone',
  PASSWORD: 'password',
};

const useCheckboxState = (initialCheck = false) => {
  /** Use state */
  const [checked, setChecked] = useState(initialCheck);

  return { checked, onChange: setChecked };
};

function SignUp(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** Use ref */
  const formRef = useRef();

  /** Use State */
  const policyCheckbox = useCheckboxState();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({
    status: false,
    success: false,
    error: false,
    content: '',
  });
  const [values, setValues] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBackLogIn = () => {
    navigation.goBack();
  };

  /**********
   ** FUNC **
   **********/
  const onSubmitSignUp = () => {
    console.log('[LOG] ===  ===> Submit signup');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // let rdAlert = Math.random();
      // if (rdAlert > 0.5) {
        setShowAlert({
          status: true,
          success: true,
          content: t('sign_up:success_caption')
        });
      // } else {
      //   showMessage({
      //     message: t('common:error'),
      //     description: t('sign_up:error_send'),
      //     type: 'danger',
      //     icon: 'danger',
      //   });
      // }
    }, 1500);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {

  }, []);

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
        leftTitle={'sign_up:title'}
        leftSubtitle={'sign_up:subtitle'}
      />

      {/** Content */}
      <Layout
        style={[
          cStyles.flex1,
          cStyles.mt16,
          cStyles.roundedTopLeft5,
          cStyles.roundedTopRight5,
          cStyles.py16,
          cStyles.px32,
        ]}
        level='1'>
        {/** Form input */}
        {!showAlert.status && (
          <CForm
            ref={formRef}
            loading={loading}
            level='2'
            inputs={[
              {
                id: INPUT_NAME.USER_NAME,
                type: 'text',
                label: 'sign_up:input_label_username',
                holder: 'sign_up:input_holder_username',
                value: values.userName,
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.EMAIL,
                type: 'text',
                label: 'sign_up:input_label_email',
                holder: 'sign_up:input_holder_email',
                value: values.email,
                required: true,
                password: false,
                email: true,
                phone: false,
                number: false,
                next: true,
                return: 'next',
                validate: {type: 'format_email', helper: ''},
              },
              {
                id: INPUT_NAME.PHONE,
                type: 'text',
                label: 'sign_up:input_label_phone',
                holder: 'sign_up:input_holder_phone',
                value: values.phone,
                required: true,
                password: false,
                email: false,
                phone: true,
                number: false,
                next: true,
                return: 'next',
                validate: {type: 'min_length', helper: '10'},
              },
              {
                id: INPUT_NAME.PASSWORD,
                type: 'text',
                label: 'sign_up:input_label_password',
                holder: 'sign_up:input_holder_password',
                value: values.password,
                required: true,
                password: true,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
                validate: {type: 'min_length', helper: '6'},
              },
            ]}
            customAddingForm={
              <CheckBox
                style={cStyles.mt24}
                status='basic'
                disabled={loading}
                {...policyCheckbox}>
                {propsCb => <CText style={cStyles.mx10} >{t('sign_up:policy')}</CText>}
              </CheckBox>
            }
            disabledButton={!policyCheckbox.checked || loading}
            labelButton={'sign_up:title'}
            onSubmit={onSubmitSignUp}
          />
        )}

        <CAlert
          show={showAlert.status}
          success={showAlert.success}
          error={showAlert.error}
          message={showAlert.content}
          textOk={'common:done'}
          onOk={handleGoBackLogIn}
        />
      </Layout>
    </CContainer>
  )
}

export default SignUp;
