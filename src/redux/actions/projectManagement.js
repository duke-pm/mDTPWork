/**
 ** Name: Project management actions
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
/* COMMON */
import Services from "~/services";
/** REDUX */
import * as types from "./types";
import * as Actions from "~/redux/actions";

export const resetAllProject = () => ({
  type: types.RESET_REQUEST_PROJECT,
});

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
          return dispatch(
            listProjectSuccess({
              data: res.data,
              pages: res.totalPage || 0,
            }),
          );
        } else {
          return dispatch(listProjectError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listProjectError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
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
          return dispatch(
            listTaskSuccess({
              data: res.data.listTask,
              pages: res.totalPage || 0,
            }),
          );
        } else {
          return dispatch(listTaskError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listTaskError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
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
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
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
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchTaskComment(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For add watcher */
export const taskWatcherError = error => ({
  type: types.ERROR_FETCH_TASK_WATCHERS,
  payload: error,
});

export const taskWatcherSuccess = (data, userName) => ({
  type: types.SUCCESS_FETCH_TASK_WATCHERS,
  payload: {data, userName},
});

export const fetchTaskWatcher = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_TASK_WATCHERS});

    Services.projectManagement
      .taskWatcher(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(taskWatcherSuccess(res.data, params.UserName));
        } else {
          return dispatch(taskWatcherError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(taskWatcherError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchTaskWatcher(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For update per task */
export const updatePerTaskError = error => ({
  type: types.ERROR_FETCH_TASK_UPDATE_PER,
  payload: error,
});

export const updatePerTaskSuccess = data => ({
  type: types.SUCCESS_FETCH_TASK_UPDATE_PER,
  payload: data,
});

export const fetchUpdatePerTask = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_TASK_UPDATE_PER});

    Services.projectManagement
      .taskUpdate(params)
      .then(res => {
        if (!res.isError) {
          let dataTask = null;
          if (res.data.length > 0) {
            dataTask = {
              status: {
                statusID: res.data[0].statusID,
                statusName: res.data[0].statusName,
                colorCode: res.data[0].colorCode,
                colorDarkCode: res.data[0].colorDarkCode,
                colorOpacityCode: res.data[0].colorOpacityCode,
              },
              percentage: res.data[0].percentage,
            };
          } else {
            dataTask = {
              status: {
                statusID: res.data.statusID,
                statusName: res.data.statusName,
                colorCode: res.data.colorCode,
                colorDarkCode: res.data.colorDarkCode,
                colorOpacityCode: res.data.colorOpacityCode,
              },
              percentage: res.data.percentage,
            };
          }
          return dispatch(updatePerTaskSuccess(dataTask));
        } else {
          return dispatch(updatePerTaskError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(updatePerTaskError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchUpdatePerTask(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For update sta task */
export const updateStaTaskError = error => ({
  type: types.ERROR_FETCH_TASK_UPDATE_STA,
  payload: error,
});

export const updateStaTaskSuccess = data => ({
  type: types.SUCCESS_FETCH_TASK_UPDATE_STA,
  payload: data,
});

export const fetchUpdateStaTask = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_TASK_UPDATE_STA});

    Services.projectManagement
      .taskUpdate(params)
      .then(res => {
        if (!res.isError) {
          let dataTask = null;
          if (res.data.length > 0) {
            dataTask = {
              status: {
                statusID: res.data[0].statusID,
                statusName: res.data[0].statusName,
                colorCode: res.data[0].colorCode,
                colorDarkCode: res.data[0].colorDarkCode,
                colorOpacityCode: res.data[0].colorOpacityCode,
              },
              percentage: res.data[0].percentage,
            };
          } else {
            dataTask = {
              status: {
                statusID: res.data.statusID,
                statusName: res.data.statusName,
                colorCode: res.data.colorCode,
                colorDarkCode: res.data.colorDarkCode,
                colorOpacityCode: res.data.colorOpacityCode,
              },
              percentage: res.data.percentage,
            };
          }
          return dispatch(updateStaTaskSuccess(dataTask));
        } else {
          return dispatch(updateStaTaskError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(updateStaTaskError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchUpdateStaTask(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For get list project */
export const projectOverviewError = error => ({
  type: types.ERROR_FETCH_PROJECT_OVERVIEW,
  payload: error,
});

export const projectOverviewSuccess = projects => ({
  type: types.SUCCESS_FETCH_PROJECT_OVERVIEW,
  payload: projects,
});

export const fetchProjectOverview = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_PROJECT_OVERVIEW});

    Services.projectManagement
      .projectOverview(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(
            projectOverviewSuccess({
              data: res.data,
              pages: res.totalPage || 0,
            }),
          );
        } else {
          return dispatch(projectOverviewError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(projectOverviewError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params["RefreshToken"],
            Lang: params["Lang"],
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchProjectOverview(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/
