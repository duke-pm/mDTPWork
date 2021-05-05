/**
 ** Name: Navigator
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Navigator.js
 **/
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* COMPONENTS */
import RootMain from './Root';
import NavigationService from './NavigationService';
/* COMMON */
import '~/utils/language/config-i18n';
import API from '~/services/axios';
/* REDUX */
import * as Actions from '~/redux/actions';

function Navigator(props) {

  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);

  /** FUNC */
  const onStartApp = () => {
    API.interceptors.response.use(response => {
      return response;
    }, err => {
      return new Promise((resolve, reject) => {
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          dispatch(Actions.logout());
          AsyncStorage.clear();
        }
        throw err;
      });
    });
    SplashScreen.hide();
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onStartApp();
  }, []);

  useEffect(() => {
    if (commonState.get('language') !== props.i18n.language) {
      props.i18n.changeLanguage(language);
    }
  }, [
    commonState.get('language'),
    props.i18n.language,
    props.i18n.changeLanguage,
  ]);

  /** RENDER */
  return (
    <RootMain
      ref={nav => {
        NavigationService.setTopLevelNavigator(nav);
      }}
      uriPrefix={'/src'}
      screenProps={props}
      {...props}
    />
  );
};

export default compose(withTranslation())(Navigator);
