/**
 ** Name: Reducers.js
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of Reducers.js
 **/
/* LIBRARY */
import { combineReducers } from 'redux';
/* REDUCER */
import connection from './connection';
import language from './language';
import masterData from './masterData';
import approved from './approved';

export default combineReducers({
  connection,
  language,
  masterData,
  approved,
});
