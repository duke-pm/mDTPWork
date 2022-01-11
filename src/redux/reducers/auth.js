/**
 ** Name: Auth.js
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Auth.js
 **/
/** REDUX */
import * as types from '../actions/types';

export const initialState = {
  submitting: false,
  submittingChangePass: false,
  submittingForgotPass: false,
  submittingUpdatePass: false,
  submittingCheckTokenPass: false,

  successRefreshToken: false,
  errorRefreshToken: false,

  successLogin: false,
  errorLogin: false,
  errorHelperLogin: "",

  successChangePass: false,
  errorChangePass: false,
  errorHelperChangePass: "",

  successForgotPass: false,
  errorForgotPass: false,
  errorHelperForgotPass: "",

  successUpdatePass: false,
  errorUpdatePass: false,
  errorHelperUpdatePass: "",

  successCheckTokenPass: false,
  errorCheckTokenPass: false,
  errorHelperCheckTokenPass: "",

  login: {
    accessToken: null,
    tokenType: null,
    refreshToken: null,
    userName: null,
    userID: null,
    userId: null,
    empCode: null,
    fullName: null,
    regionCode: null,
    deptCode: null,
    jobTitle: null,
    groupID: null,
    lstMenu: null,
  },
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    /** Common */
    case types.LOGOUT:
      return {
        ...state,
        submitting: false,
        successLogin: false,
        errorLogin: false,
        errorHelperLogin: "",
        login: {
          ...state.login,
          accessToken: null,
          tokenType: null,
          refreshToken: null,
          userName: null,
          userID: null,
          userId: null,
          empCode: null,
          fullName: null,
          regionCode: null,
          deptCode: null,
          jobTitle: null,
          groupID: null,
          lstMenu: null,
        }
      };
    /*****************************/

    /** For refresh token **/
    case types.START_REFRESH_TOKEN:
      return {
        ...state,
        submitting: true,
        successRefreshToken: false,
        errorRefreshToken: false,
      };
    case types.SUCCESS_REFRESH_TOKEN:
      return {
        ...state,
        submitting: false,
        successRefreshToken: true,
        errorRefreshToken: false,
      };
    case types.ERROR_REFRESH_TOKEN:
      return {
        ...state,
        submitting: false,
        successRefreshToken: false,
        errorRefreshToken: true,
      };
    /*****************************/

    /** For login **/
    case types.START_LOGIN:
      return {
        ...state,
        submitting: false,
        successLogin: false,
        errorLogin: false,
        errorHelperLogin: "",
      };
    case types.SUCCESS_LOGIN:
      return {
        ...state,
        submitting: false,
        successLogin: true,
        successRefreshToken: true,
        errorRefreshToken: false,
        errorLogin: false,
        errorHelperLogin: "",
        login: {
          ...state.login,
          accessToken: payload.accessToken,
          tokenType: payload.tokenType,
          refreshToken: payload.refreshToken,
          userName: payload.userName,
          userID: payload.userID,
          userId: payload.userId,
          empCode: payload.empCode,
          fullName: payload.fullName,
          regionCode: payload.regionCode,
          deptCode: payload.deptCode,
          jobTitle: payload.jobTitle,
          groupID: payload.groupID,
          lstMenu: payload.lstMenu,
        }
      };
    case types.ERROR_LOGIN:
      return {
        ...state,
        submitting: false,
        successLogin: false,
        errorLogin: true,
        errorHelperLogin: payload,
      };
    /*****************************/

    /** For change password **/
    case types.START_CHANGE_PASSWORD:
      return {
        ...state,
        submittingChangePass: true,
        successChangePass: false,
        errorChangePass: false,
        errorHelperChangePass: "",
      };
    case types.SUCCESS_CHANGE_PASSWORD:
      return {
        ...state,
        submittingChangePass: false,
        successChangePass: true,
        errorChangePass: false,
        errorHelperChangePass: "",
      };
    case types.ERROR_CHANGE_PASSWORD:
      return {
        ...state,
        submittingChangePass: false,
        successChangePass: false,
        errorChangePass: true,
        errorHelperChangePass: payload,
      };
    /*****************************/

    /** For change password **/
    case types.START_FORGOT_PASSWORD:
      return {
        ...state,
        submittingForgotPass: true,
        successForgotPass: false,
        errorForgotPass: false,
        errorHelperForgotPass: "",
      };
    case types.SUCCESS_FORGOT_PASSWORD:
      return {
        ...state,
        submittingForgotPass: false,
        successForgotPass: true,
        errorForgotPass: false,
        errorHelperForgotPass: "",
      };
    case types.ERROR_FORGOT_PASSWORD:
      return {
        ...state,
        submittingForgotPass: false,
        successForgotPass: false,
        errorForgotPass: true,
        errorHelperForgotPass: payload,
      };
    /*****************************/

    /** For update password **/
    case types.START_UPDATE_PASSWORD:
      return {
        ...state,
        submittingUpdatePass: true,
        successUpdatePass: false,
        errorUpdatePass: false,
        errorHelperUpdatePass: "",
      };
    case types.SUCCESS_UPDATE_PASSWORD:
      return {
        ...state,
        submittingUpdatePass: false,
        successUpdatePass: true,
        errorUpdatePass: false,
        errorHelperUpdatePass: "",
      };
    case types.ERROR_UPDATE_PASSWORD:
      return {
        ...state,
        submittingUpdatePass: false,
        successUpdatePass: false,
        errorUpdatePass: true,
        errorHelperUpdatePass: payload,
      };
    /*****************************/

    /** For check token password **/
    case types.RESET_CHECK_TOKEN_PASSWORD:
      return {
        ...state,
        submittingCheckTokenPass: false,
        successCheckTokenPass: false,
        errorCheckTokenPass: false,
        errorHelperCheckTokenPass: "",
        submittingUpdatePass: false,
        successUpdatePass: false,
        errorUpdatePass: false,
        errorHelperUpdatePass: ""
      };
    case types.START_CHECK_TOKEN_PASSWORD:
      return {
        ...state,
        submittingCheckTokenPass: true,
        successCheckTokenPass: false,
        errorCheckTokenPass: false,
        errorHelperCheckTokenPass: "",
      };
    case types.SUCCESS_CHECK_TOKEN_PASSWORD:
      return {
        ...state,
        submittingCheckTokenPass: false,
        successCheckTokenPass: true,
        errorCheckTokenPass: false,
        errorHelperCheckTokenPass: "",
      };
    case types.ERROR_CHECK_TOKEN_PASSWORD:
      return {
        ...state,
        submittingCheckTokenPass: false,
        successCheckTokenPass: false,
        errorCheckTokenPass: true,
        errorHelperCheckTokenPass: payload,
      };
    /*****************************/
    default:
      return state;
  }
}
