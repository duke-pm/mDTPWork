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

export default combineReducers({
  connection,
  language,
});
