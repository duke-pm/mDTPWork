/**
 ** Name: Auth actions
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Auth.js
 **/
import {showMessage} from 'react-native-flash-message';
/* COMMON */
import Routes from '~/navigation/Routes';
import Services from '~/services';
import API from '~/services/axios';
import {removeSecretInfo, resetRoute} from '~/utils/helper';
import {LOGIN} from '~/config/constants';
/** REDUX */
import * as types from './types';
import * as Actions from '~/redux/actions';

export const logout = () => ({
  type: types.LOGOUT,
});

export const loginError = error => ({
  type: types.ERROR_LOGIN,
  payload: error,
});

export const loginSuccess = (data, isRefresh) => {
  if (isRefresh) {
    API.defaults.headers.Authorization = 'Bearer ' + data.access_token;
  } else {
    API.defaults.headers.Authorization =
      'Bearer ' + data.tokenInfo.access_token;
  }

  return {
    type: types.SUCCESS_LOGIN,
    payload: {
      accessToken: data.tokenInfo.access_token,
      tokenType: data.tokenInfo.token_type,
      expiresIn: data.tokenInfo.expires_in,
      refreshToken: data.tokenInfo.refresh_token,
      userName: data.tokenInfo.userName,
      userID: data.tokenInfo.userID,
      empCode: data.tokenInfo.empCode,
      fullName: data.tokenInfo.fullName,
      regionCode: data.tokenInfo.regionCode,
      deptCode: data.tokenInfo.deptCode,
      jobTitle: data.tokenInfo.jobTitle,
      expired: data.tokenInfo['.expires'],
      groupID: data.tokenInfo.groupID,
      lstMenu:
        data.lstMenu.menuID === 1
          ? data.lstMenu
          : data.lstMenu.lstPermissionItem[0],
    },
  };
};

export const fetchLogin = params => {
  return dispatch => {
    dispatch({type: types.START_LOGIN});

    Services.authentication
      .login(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(loginSuccess(res.data));
        } else {
          return dispatch(loginError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(loginError(error));
      });
  };
};

export const fetchRefreshToken = (params, callback, navigation) => {
  return dispatch => {
    dispatch({
      type: types.START_REFRESH_TOKEN,
    });

    Services.authentication
      .refreshToken(params)
      .then(res => {
        if (!res.isError) {
          dispatch(loginSuccess(res.data, true));
          return dispatch(callback());
        } else {
          removeSecretInfo(LOGIN);
          dispatch(loginError('error'));
          dispatch(Actions.logout());
          showMessage({
            message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại!',
            type: 'warning',
            icon: 'warning',
          });
          return resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
        }
      })
      .catch(error => {
        dispatch(loginError(error));
        return resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);
      });
  };
};
