/**
 ** Name: Approved actions
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
**/
/* COMMON */
import * as types from './types';
import Services from '~/services';

/** For add request */
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
/*****************************/

/** For get list request */
export const listRequestApprovedError = error => ({
  type: types.ERROR_FETCH_LIST_REQUEST_APPROVED,
  payload: error
});

export const listRequestApprovedSuccess = (
  countRequest,
  requests,
  requestsDetail,
) => ({
  type: types.SUCCESS_FETCH_LIST_REQUEST_APPROVED,
  payload: {
    countRequest,
    requests,
    requestsDetail,
  }
});

export const fetchListRequestApproved = params => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_LIST_REQUEST_APPROVED,
    });

    Services.approved.listRequest(params)
      .then((res) => {
        if (!res.isError) {
          return dispatch(
            listRequestApprovedSuccess(
              res.data.header.countAllocation,
              res.data.listRequest,
              res.data.listRequestDetail
            ));
        } else {
          return dispatch(listRequestApprovedError(res.errorMessage));
        }
      })
      .catch(error => {
        return dispatch(listRequestApprovedError(error));
      });
  }
};
/*****************************/
