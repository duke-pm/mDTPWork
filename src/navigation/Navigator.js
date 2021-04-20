/**
 ** Name: Navigator
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Navigator.js
 **/
import React from 'react';
/* COMPONENTS */
import RootMain from './Root';
import NavigationService from './NavigationService';
/* COMMON */

/* REDUX */


function Navigator(props) {

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

export default Navigator;
