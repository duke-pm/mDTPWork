/**
 ** Name: Reducers.js
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Reducers.js
 **/
/* LIBRARY */
import {combineReducers} from 'redux';
/* REDUCER */
import common from './common';
import auth from './auth';
import masterData from './masterData';
import approved from './approved';

export default combineReducers({
  common,
  auth,
  masterData,
  approved,
});
