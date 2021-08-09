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

/** For logout */
export const logout = () => ({
  type: types.LOGOUT,
});
/*****************************/

/** For login */
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
      accessToken: isRefresh ? data.access_token : data.tokenInfo.access_token,
      tokenType: isRefresh ? data.token_type : data.tokenInfo.token_type,
      refreshToken: isRefresh
        ? data.refresh_token
        : data.tokenInfo.refresh_token,
      userName: isRefresh ? data.userName : data.tokenInfo.userName,
      userID: isRefresh ? data.userID : data.tokenInfo.userID,
      userId: isRefresh ? data.userId : data.tokenInfo.userId,
      empCode: isRefresh ? data.empCode : data.tokenInfo.empCode,
      fullName: isRefresh ? data.fullName : data.tokenInfo.fullName,
      regionCode: isRefresh ? data.regionCode : data.tokenInfo.regionCode,
      deptCode: isRefresh ? data.deptCode : data.tokenInfo.deptCode,
      jobTitle: isRefresh ? data.jobTitle : data.tokenInfo.jobTitle,
      groupID: isRefresh ? data.groupID : data.tokenInfo.groupID,
      lstMenu: data.lstMenu
        ? data.lstMenu.menuID === 1
          ? data.lstMenu
          : data.lstMenu.lstPermissionItem[0]
        : null,
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
          return dispatch(loginSuccess(res.data, false));
        } else {
          return dispatch(loginError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(loginError(error));
      });
  };
};
/*****************************/

/** For refresh login */
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
/*****************************/

/** For change password */
export const changePasswordError = error => ({
  type: types.ERROR_CHANGE_PASSWORD,
  payload: error,
});

export const changePasswordSuccess = () => {
  return {
    type: types.SUCCESS_CHANGE_PASSWORD,
  };
};
export const fetchChangePassword = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_CHANGE_PASSWORD});

    Services.authentication
      .changePassword(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(changePasswordSuccess());
        } else {
          return dispatch(
            changePasswordError(res.systemErrorMessage || res.errorMessage),
          );
        }
      })
      .catch(error => {
        dispatch(changePasswordError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.RefreshToken,
            Lang: params.Lang,
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchChangePassword(params, navigation),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For forgot password */
export const forgotPasswordError = error => ({
  type: types.ERROR_FORGOT_PASSWORD,
  payload: error,
});

export const forgotPasswordSuccess = () => {
  return {
    type: types.SUCCESS_FORGOT_PASSWORD,
  };
};
export const fetchForgotPassword = params => {
  return dispatch => {
    dispatch({type: types.START_FORGOT_PASSWORD});

    Services.authentication
      .forgotPassword(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(forgotPasswordSuccess());
        } else {
          return dispatch(
            forgotPasswordError(res.systemErrorMessage || res.errorMessage),
          );
        }
      })
      .catch(error => {
        dispatch(forgotPasswordError(error));
      });
  };
};
/*****************************/

/** For update password */
export const updatePasswordError = error => ({
  type: types.ERROR_UPDATE_PASSWORD,
  payload: error,
});

export const updatePasswordSuccess = () => {
  return {
    type: types.SUCCESS_UPDATE_PASSWORD,
  };
};
export const fetchUpdatePassword = params => {
  return dispatch => {
    dispatch({type: types.START_UPDATE_PASSWORD});

    Services.authentication
      .updateNewPassword(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(updatePasswordSuccess());
        } else {
          return dispatch(
            updatePasswordError(res.systemErrorMessage || res.errorMessage),
          );
        }
      })
      .catch(error => {
        dispatch(updatePasswordError(error));
      });
  };
};
/*****************************/

/** For check token password */
export const checkTokenPasswordError = error => ({
  type: types.ERROR_CHECK_TOKEN_PASSWORD,
  payload: error,
});

export const checkTokenPasswordSuccess = () => {
  return {
    type: types.SUCCESS_CHECK_TOKEN_PASSWORD,
  };
};
export const fetchCheckTokenPassword = params => {
  return dispatch => {
    dispatch({type: types.START_CHECK_TOKEN_PASSWORD});

    Services.authentication
      .checkTokenPassword(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(checkTokenPasswordSuccess());
        } else {
          return dispatch(
            checkTokenPasswordError(res.systemErrorMessage || res.errorMessage),
          );
        }
      })
      .catch(error => {
        dispatch(checkTokenPasswordError(error));
      });
  };
};
/*****************************/
