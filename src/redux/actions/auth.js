/**
 ** Name: Auth actions
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Auth.js
**/
/* COMMON */
import * as types from './types';
import Services from '~/services';
import API from '~/services/axios';

export const logout = () => ({
  type: types.LOGOUT
});

export const loginError = error => ({
  type: types.ERROR_LOGIN,
  payload: error
});

export const loginSuccess = data => {
  API.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
  return {
    type: types.SUCCESS_LOGIN,
    payload: {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      userName: data.userName,
      userID: data.userID,
      empCode: data.empCode,
      fullName: data.fullName,
      regionCode: data.regionCode,
      deptCode: data.deptCode,
      jobTitle: data.jobTitle,
      expired: data['.expires'],
    }
  };
};

export const fetchLogin = params => {
  return dispatch => {
    dispatch({
      type: types.START_LOGIN,
    });

    Services.authentication.login(params)
      .then((res) => {
        if (!res.isError) {
          return dispatch(loginSuccess(res.data));
        } else {
          return dispatch(loginError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(loginError(error));
      });

  }
};

export const fetchRefreshToken = (params, callback) => {
  return dispatch => {
    dispatch({
      type: types.START_REFRESH_TOKEN,
    });

    Services.authentication.refreshToken(params)
      .then((res) => {
        if (!res.isError) {
          dispatch(loginSuccess(res.data));
          return dispatch(callback());
        } else {
          return dispatch(loginError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(loginError(error));
      });

  }
};
