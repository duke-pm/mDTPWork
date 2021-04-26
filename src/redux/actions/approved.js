/**
 ** Name: Approved
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
**/
/* COMMON */
import * as types from './types';
import Services from '~/services';

export const addRequestApprovedError = error => ({
  type: types.ERROR_FETCH_ADD_REQUEST_APPROVED,
  payload: error
});

export const addRequestApprovedSuccess = () => ({
  type: types.SUCCESS_FETCH_ADD_REQUEST_APPROVED,
});

export const fetchAddRequestApproved = params => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_ADD_REQUEST_APPROVED,
    });

    Services.approved.addRequest(params)
      .then((res) => {
        if (!res.isError) {
          return dispatch(addRequestApprovedSuccess());
        } else {
          return dispatch(addRequestApprovedError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(addRequestApprovedError(error));
      });

  }
};
