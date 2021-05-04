/**
 ** Name: Auth.js
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of Auth.js
 **/
/* LIBRARY */
import { fromJS } from 'immutable';
import * as types from '../actions/types';

export const initialState = fromJS({
  submitting: false,

  successLogin: false,
  errorLogin: false,
  errorHelperLogin: '',

  login: {
    accessToken: null,
    tokenType: null,
    expiresIn: 0,
    refreshToken: null,
    userName: null,
  },
});

export default function (state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    /** Common */
    case types.LOGOUT:
      return state
        .set('submitting', false)
        .set('successLogin', false)
        .set('errorLogin', false)
        .set('errorHelperLogin', '')

        .setIn(['login', 'accessToken'], null)
        .setIn(['login', 'tokenType'], null)
        .setIn(['login', 'expiresIn'], 0)
        .setIn(['login', 'refreshToken'], null)
        .setIn(['login', 'userName'], null);
    /*****************************/

    /** For login **/
    case types.START_LOGIN:
      return state
        .set('submitting', true)
        .set('successLogin', false)
        .set('errorLogin', false)
        .set('errorHelperLogin', '');

    case types.SUCCESS_LOGIN:
      return state
        .set('submitting', false)
        .set('successLogin', true)
        .set('errorLogin', false)
        .set('errorHelperLogin', '')

        .setIn(['login', 'accessToken'], payload.accessToken)
        .setIn(['login', 'tokenType'], payload.tokenType)
        .setIn(['login', 'expiresIn'], payload.expiresIn)
        .setIn(['login', 'refreshToken'], payload.refreshToken)
        .setIn(['login', 'userName'], payload.userName);

    case types.ERROR_LOGIN:
      return state
        .set('submitting', false)
        .set('successLogin', false)
        .set('errorLogin', true)
        .set('errorHelperLogin', payload);
    /*****************************/

    default:
      return state;
  }
};
