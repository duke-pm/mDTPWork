/**
 ** Name: Reducers for app
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Reducers.js
 **/
/* LIBRARY */
import {combineReducers} from 'redux';
/* REDUCER */
import common from './common';
import masterData from './masterData';
import auth from './auth';
import approved from './approved';
import projectManagement from './projectManagement';

export default combineReducers({
  common,
  auth,
  masterData,
  approved,
  projectManagement,
});
