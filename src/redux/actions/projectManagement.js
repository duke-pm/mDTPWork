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

export const listProjectSuccess = projects => ({
  type: types.SUCCESS_FETCH_LIST_PROJECT,
  payload: projects,
});

export const fetchListProject = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_LIST_PROJECT});

    Services.projectManagement
      .listProject(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(listProjectSuccess(res.data));
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

/** For get list task of project */
export const listTaskError = error => ({
  type: types.ERROR_FETCH_LIST_TASK,
  payload: error,
});

export const listTaskSuccess = tasks => ({
  type: types.SUCCESS_FETCH_LIST_TASK,
  payload: tasks,
});

export const fetchListTask = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_LIST_TASK});

    Services.projectManagement
      .listTask(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(listTaskSuccess(res.data.listTask));
        } else {
          return dispatch(listTaskError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listTaskError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchListTask(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For get task detail */
export const taskDetailError = error => ({
  type: types.ERROR_FETCH_TASK_DETAIL,
  payload: error,
});

export const taskDetailSuccess = data => ({
  type: types.SUCCESS_FETCH_TASK_DETAIL,
  payload: data,
});

export const fetchTaskDetail = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_TASK_DETAIL});

    Services.projectManagement
      .taskDetail(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(taskDetailSuccess(res.data));
        } else {
          return dispatch(taskDetailError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(taskDetailError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchTaskDetail(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For add comment of activities */
export const taskCommentError = error => ({
  type: types.ERROR_FETCH_TASK_COMMENT,
  payload: error,
});

export const taskCommentSuccess = data => ({
  type: types.SUCCESS_FETCH_TASK_COMMENT,
  payload: data,
});

export const fetchTaskComment = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_TASK_COMMENT});

    Services.projectManagement
      .taskComment(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(taskCommentSuccess(res.data));
        } else {
          return dispatch(taskCommentError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(taskCommentError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchTaskComment(
              tmp,
              () => fetchTaskDetail(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/
