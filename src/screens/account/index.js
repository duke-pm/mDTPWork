/**
 ** Name: Account
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* COMPONENTS */
import CButton from '~/components/CButton';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
/* COMMON */
import Routes from '~/navigation/Routes';
import { LOGIN } from '~/config/constants';
import { alert, resetRoute } from '~/utils/helper';
/* REDUX */


function Account(props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    alert(t, 'common:warning_sign_out', handleOk);
  }

  const handleOk = async () => {
    setLoading(true);
    await AsyncStorage.removeItem(LOGIN);
    resetRoute(props.navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  }

  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      header
      loading={false}
      title={'account:title'}
      content={
        <CContent padder>
          <CButton
            label={'common:sign_out'}
            onPress={handleSignOut}
          />
        </CContent>
      }
    />
  );
};

export default Account;
