/**
 ** Name: Project management actions
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
/* COMMON */
import Services from '~/services';
/** REDUX */
import * as types from './types';
import * as Actions from '~/redux/actions';

/** For get list project */
export const listProjectError = error => ({
  type: types.ERROR_FETCH_LIST_PROJECT,
  payload: error,
});

export const listProjectSuccess = (
  countRequest,
  requests,
  requestsDetail,
  processApproved,
) => ({
  type: types.SUCCESS_FETCH_LIST_PROJECT,
  payload: {
    countRequest,
    requests,
    requestsDetail,
    processApproved,
  },
});

export const fetchListProject = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_LIST_PROJECT});

    Services.approved
      .listRequest(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(
            listProjectSuccess(
              res.data.header.countAllocation,
              res.data.listRequest,
              res.data.listRequestDetail,
              res.data.listProcessApprove,
            ),
          );
        } else {
          return dispatch(listProjectError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listProjectError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchListProject(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/
