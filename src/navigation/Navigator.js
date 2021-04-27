/**
 ** Name: Navigator
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Navigator.js
 **/
import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
/* COMPONENTS */
import RootMain from './Root';
import NavigationService from './NavigationService';
/* COMMON */
import '~/utils/language/config-i18n';
/* REDUX */
import * as Actions from '~/redux/actions';

function Navigator(props) {

  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);
  const masterState = useSelector(({ masterData }) => masterData);

  const [loading, setLoading] = useState(true);

  /** FUNC */
  const onFetchMasterData = () => {
    let params = {
      listType: 'Region, Company',
    }
    dispatch(Actions.fetchMasterData(params));
  };

  const onStartApp = () => {
    SplashScreen.hide();
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchMasterData();
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

  useEffect(async () => {
    if (loading) {
      if (!masterState.get('submitting')) {
        onStartApp();
      }
    }
  }, [
    loading,
    masterState.get('submitting'),
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
