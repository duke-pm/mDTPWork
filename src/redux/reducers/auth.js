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
  submittingChangePass: false,
  submittingForgotPass: false,
  submittingUpdatePass: false,
  submittingCheckTokenPass: false,

  successRefreshToken: false,
  errorRefreshToken: false,

  successLogin: false,
  errorLogin: false,
  errorHelperLogin: '',

  successChangePass: false,
  errorChangePass: false,
  errorHelperChangePass: '',

  successForgotPass: false,
  errorForgotPass: false,
  errorHelperForgotPass: '',

  successUpdatePass: false,
  errorUpdatePass: false,
  errorHelperUpdatePass: '',

  successCheckTokenPass: false,
  errorCheckTokenPass: false,
  errorHelperCheckTokenPass: '',

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

    /** For change password **/
    case types.START_CHANGE_PASSWORD:
      return state
        .set('submittingChangePass', true)
        .set('successChangePass', false)
        .set('errorChangePass', false)
        .set('errorHelperChangePass', '');
    case types.SUCCESS_CHANGE_PASSWORD:
      return state
        .set('submittingChangePass', false)
        .set('successChangePass', true)
        .set('errorChangePass', false)
        .set('errorHelperChangePass', '');
    case types.ERROR_CHANGE_PASSWORD:
      return state
        .set('submittingChangePass', false)
        .set('successChangePass', false)
        .set('errorChangePass', true)
        .set('errorHelperChangePass', payload);
    /*****************************/

    /** For change password **/
    case types.START_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', true)
        .set('successForgotPass', false)
        .set('errorForgotPass', false)
        .set('errorHelperForgotPass', '');
    case types.SUCCESS_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', false)
        .set('successForgotPass', true)
        .set('errorForgotPass', false)
        .set('errorHelperForgotPass', '');
    case types.ERROR_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', false)
        .set('successForgotPass', false)
        .set('errorForgotPass', true)
        .set('errorHelperForgotPass', payload);
    /*****************************/

    /** For change password **/
    case types.START_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', true)
        .set('successForgotPass', false)
        .set('errorForgotPass', false)
        .set('errorHelperForgotPass', '');
    case types.SUCCESS_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', false)
        .set('successForgotPass', true)
        .set('errorForgotPass', false)
        .set('errorHelperForgotPass', '');
    case types.ERROR_FORGOT_PASSWORD:
      return state
        .set('submittingForgotPass', false)
        .set('successForgotPass', false)
        .set('errorForgotPass', true)
        .set('errorHelperForgotPass', payload);
    /*****************************/

    /** For update password **/
    case types.START_UPDATE_PASSWORD:
      return state
        .set('submittingUpdatePass', true)
        .set('successUpdatePass', false)
        .set('errorUpdatePass', false)
        .set('errorHelperUpdatePass', '');
    case types.SUCCESS_UPDATE_PASSWORD:
      return state
        .set('submittingUpdatePass', false)
        .set('successUpdatePass', true)
        .set('errorUpdatePass', false)
        .set('errorHelperUpdatePass', '');
    case types.ERROR_UPDATE_PASSWORD:
      return state
        .set('submittingUpdatePass', false)
        .set('successUpdatePass', false)
        .set('errorUpdatePass', true)
        .set('errorHelperUpdatePass', payload);
    /*****************************/

    /** For check token password **/
    case types.START_CHECK_TOKEN_PASSWORD:
      return state
        .set('submittingCheckTokenPass', true)
        .set('successCheckTokenPass', false)
        .set('errorCheckTokenPass', false)
        .set('errorHelperCheckTokenPass', '');
    case types.SUCCESS_CHECK_TOKEN_PASSWORD:
      return state
        .set('submittingCheckTokenPass', false)
        .set('successCheckTokenPass', true)
        .set('errorCheckTokenPass', false)
        .set('errorHelperCheckTokenPass', '');
    case types.ERROR_CHECK_TOKEN_PASSWORD:
      return state
        .set('submittingCheckTokenPass', false)
        .set('successCheckTokenPass', false)
        .set('errorCheckTokenPass', true)
        .set('errorHelperCheckTokenPass', payload);
    /*****************************/
    default:
      return state;
  }
}
