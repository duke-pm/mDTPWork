/**
 ** Name: Auth.js
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Auth.js
 **/
/* LIBRARY */
import {fromJS} from 'immutable';
/** REDUX */
import * as types from '../actions/types';

export const initialState = fromJS({
  submitting: false,

  successRefreshToken: false,
  errorRefreshToken: false,

  successLogin: false,
  errorLogin: false,
  errorHelperLogin: '',

  login: {
    accessToken: null,
    tokenType: null,
    expiresIn: 0,
    refreshToken: null,
    userName: null,
    userID: null,
    empCode: null,
    fullName: null,
    regionCode: null,
    deptCode: null,
    jobTitle: null,
    expired: null,
    groupID: null,
    lstMenu: null,
  },
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
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
        .setIn(['login', 'userName'], null)
        .setIn(['login', 'userID'], null)
        .setIn(['login', 'empCode'], null)
        .setIn(['login', 'fullName'], null)
        .setIn(['login', 'regionCode'], null)
        .setIn(['login', 'deptCode'], null)
        .setIn(['login', 'jobTitle'], null)
        .setIn(['login', 'expired'], null)
        .setIn(['login', 'groupID'], null)
        .setIn(['login', 'lstMenu'], null);
    /*****************************/

    /** For refresh token **/
    case types.START_REFRESH_TOKEN:
      return state
        .set('submitting', true)
        .set('successRefreshToken', false)
        .set('errorRefreshToken', false);

    case types.SUCCESS_REFRESH_TOKEN:
      return state
        .set('submitting', true)
        .set('successRefreshToken', true)
        .set('errorRefreshToken', false);

    case types.ERROR_REFRESH_TOKEN:
      return state
        .set('submitting', true)
        .set('successRefreshToken', false)
        .set('errorRefreshToken', true);
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
        .set('successRefreshToken', true)
        .set('errorRefreshToken', false)
        .set('errorLogin', false)
        .set('errorHelperLogin', '')

        .setIn(['login', 'accessToken'], payload.accessToken)
        .setIn(['login', 'tokenType'], payload.tokenType)
        .setIn(['login', 'expiresIn'], payload.expiresIn)
        .setIn(['login', 'refreshToken'], payload.refreshToken)
        .setIn(['login', 'userName'], payload.userName)
        .setIn(['login', 'userID'], payload.userID)
        .setIn(['login', 'empCode'], payload.empCode)
        .setIn(['login', 'fullName'], payload.fullName)
        .setIn(['login', 'regionCode'], payload.regionCode)
        .setIn(['login', 'deptCode'], payload.deptCode)
        .setIn(['login', 'jobTitle'], payload.jobTitle)
        .setIn(['login', 'expired'], payload.expired)
        .setIn(['login', 'groupID'], payload.groupID)
        .setIn(['login', 'lstMenu'], payload.lstMenu);

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
}
