/**
 ** Name: Navigator
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Navigator.js
 **/
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* COMPONENTS */
import RootMain from './Root';
import NavigationService from './NavigationService';
/* COMMON */
import '~/utils/language/config-i18n';
import {
  MASTER_DATA
} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

function Navigator(props) {

  const dispatch = useDispatch();
  const languageState = useSelector(({ language }) => language.data);

  /** FUNC */
  const onPrepareMasterData = async () => {
    try {
      const jsonMaster = await AsyncStorage.getItem(MASTER_DATA);
      jsonMaster = jsonMaster !== null ? JSON.parse(jsonMaster) : null;
      if (!jsonMaster) {
        onFetchMasterData();
      } else {
        onSaveMasterData(jsonMaster);
      }
    } catch (e) {
      onFetchMasterData();
    }

  }

  const onFetchMasterData = () => {

  }

  const onSaveMasterData = (masterData) => {
    dispatch(Actions.changeMasterAll(masterData));
  }

  /** LIFE CYCLE */
  useEffect(() => {
    if (languageState !== props.i18n.language) {
      props.i18n.changeLanguage(language);
    }
  }, [
    languageState,
    props.i18n.language,
    props.i18n.changeLanguage,
  ]);

  useEffect(() => {
    onPrepareMasterData();
  }, []);

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
