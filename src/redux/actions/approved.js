/**
 ** Name: Approved actions
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
**/
/* COMMON */
import * as types from './types';
import * as Actions from '~/redux/actions';
import Services from '~/services';

/** For get list request assets */
export const listRequestApprovedError = error => ({
  type: types.ERROR_FETCH_LIST_REQUEST_APPROVED,
  payload: error
});

export const listRequestApprovedSuccess = (
  countRequest,
  requests,
  requestsDetail,
  processApproved,
) => ({
  type: types.SUCCESS_FETCH_LIST_REQUEST_APPROVED,
  payload: {
    countRequest,
    requests,
    requestsDetail,
    processApproved,
  }
});

export const fetchListRequestApproved = (params, navigation) => {
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
              res.data.listRequestDetail,
              res.data.listProcessApprove,
            ));
        } else {
          return dispatch(listRequestApprovedError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listRequestApprovedError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            'RefreshToken': params.get('RefreshToken'),
            'Lang': params.get('Lang'),
          }
          return dispatch(Actions.fetchRefreshToken(
            tmp,
            () => fetchListRequestApproved(params),
            navigation,
          ));
        }
      });
  }
};
/*****************************/

/** For add request */
export const addRequestApprovedError = error => ({
  type: types.ERROR_FETCH_ADD_REQUEST_APPROVED,
  payload: error
});

export const addRequestApprovedSuccess = () => ({
  type: types.SUCCESS_FETCH_ADD_REQUEST_APPROVED,
});

export const fetchAddRequestApproved = (params, navigation) => {
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
        dispatch(addRequestApprovedError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            'RefreshToken': params.RefreshToken,
            'Lang': params.Lang,
          }
          return dispatch(Actions.fetchRefreshToken(
            tmp,
            () => fetchAddRequestApproved(params),
            navigation,
          ));
        }
      });
  }
};
/*****************************/

/** For approved request */
export const approvedRequestError = error => ({
  type: types.ERROR_FETCH_APPROVED_REQUEST,
  payload: error
});

export const approvedRequestSuccess = () => ({
  type: types.SUCCESS_FETCH_APPROVED_REQUEST,
});

export const fetchApprovedRequest = (params, navigation) => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_APPROVED_REQUEST,
    });

    Services.approved.approvedRequest(params)
      .then((res) => {
        if (!res.isError) {
          return dispatch(approvedRequestSuccess());
        } else {
          return dispatch(approvedRequestError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(approvedRequestError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            'RefreshToken': params.RefreshToken,
            'Lang': params.Lang,
          }
          return dispatch(Actions.fetchRefreshToken(
            tmp,
            () => fetchApprovedRequest(params),
            navigation,
          ));
        }
      });
  }
};
/*****************************/

/** For reject request */
export const rejectRequestError = error => ({
  type: types.ERROR_FETCH_REJECT_REQUEST,
  payload: error
});

export const rejectRequestSuccess = () => ({
  type: types.SUCCESS_FETCH_REJECT_REQUEST,
});

export const fetchRejectRequest = (params, navigation) => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_REJECT_REQUEST,
    });

    Services.approved.rejectRequest(params)
      .then((res) => {
        if (!res.isError) {
          return dispatch(rejectRequestSuccess());
        } else {
          return dispatch(rejectRequestError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(rejectRequestError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            'RefreshToken': params.RefreshToken,
            'Lang': params.Lang,
          }
          return dispatch(Actions.fetchRefreshToken(
            tmp,
            () => fetchRejectRequest(params),
            navigation,
          ));
        }
      });
  }
};
/*****************************/