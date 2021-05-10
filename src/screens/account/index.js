/**
 ** Name: Account
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* COMPONENTS */
import CButton from '~/components/CButton';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
/* COMMON */
import Routes from '~/navigation/Routes';
import { alert, resetRoute } from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

function Account(props) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    alert(t, 'common:warning_sign_out', handleOk);
  }

  const handleOk = async () => {
    setLoading(true);
    await AsyncStorage.clear();
    dispatch(Actions.logout());
    setLoading(false);
    resetRoute(props.navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  return (
    <CContainer
      header
      loading={loading}
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
