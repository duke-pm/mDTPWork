/**
 ** Name: Approved.js
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/** REDUX */
import * as types from "../actions/types";

export const initialState = {
  submittingListProject: false,
  submittingTaskDetail: false,
  submittingTaskComment: false,
  submittingTaskWatcher: false,
  submittingListTask: false,
  submittingOverview: false,
  submittingTaskUpdatePer: false,
  submittingTaskUpdateSta: false,

  successListProject: false,
  successListTask: false,
  successTaskDetail: false,
  successTaskComment: false,
  successTaskWatcher: false,
  successOverview: false,
  successTaskUpdatePer: false,
  successTaskUpdateSta: false,

  errorListTask: false,
  errorHelperListTask: "",
  errorListProject: false,
  errorHelperListProject: "",
  errorTaskDetail: false,
  errorHelperTaskDetail: "",
  errorTaskComment: false,
  errorHelperTaskComment: "",
  errorTaskWatcher: false,
  errorHelperTaskWatcher: "",
  errorOverview: false,
  errorHelperOverview: "",
  errorTaskUpdatePer: false,
  errorHelperTaskUpdatePer: "",
  errorTaskUpdateSta: false,
  errorHelperTaskUpdateSta: "",

  isWatched: false,
  isReceivedEmail: false,
  overview: [],
  projects: [],
  tasks: [],
  pagesProjects: 0,
  pagesTasks: 0,
  pagesOverview: 0,
  taskDetail: null,
  activities: [],
  watchers: [],
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_PROJECT:
      return {
        ...state,
        submittingTaskComment: false,
        submittingTaskWatcher: false,
        submittingTaskUpdatePer: false,
        submittingTaskUpdateSta: false,
        successTaskComment: false,
        successTaskWatcher: false,
        successTaskUpdatePer: false,
        successTaskUpdateSta: false,
        errorTaskComment: false,
        errorTaskWatcher: false,
        errorTaskUpdatePer: false,
        errorTaskUpdateSta: false,
        errorHelperTaskComment: "",
        errorHelperTaskWatcher: "",
        errorHelperTaskUpdatePer: "",
        errorHelperTaskUpdateSta: "",
      };
        
    /** For list project **/
    case types.START_FETCH_LIST_PROJECT:
      return {
        ...state,
        submittingListProject: true,
        successListProject: false,
        errorListProject: false,
        errorHelperListProject: "",
      };

    case types.SUCCESS_FETCH_LIST_PROJECT:
      return {
        ...state,
        submittingListProject: false,
        successListProject: true,
        errorListProject: false,
        errorHelperListProject: "",
        projects: payload.data,
        pagesProjects: payload.pages,
      };

    case types.ERROR_FETCH_LIST_PROJECT:
      return {
        ...state,
        submittingListProject: false,
        successListProject: false,
        errorListProject: true,
        errorHelperListProject: payload,
      };

    /** For list task of project **/
    case types.START_FETCH_LIST_TASK:
      return {
        ...state,
        submittingListTask: true,
        successListTask: false,
        errorListTask: false,
        errorHelperListTask: "",
      };

    case types.SUCCESS_FETCH_LIST_TASK:
      return {
        ...state,
        submittingListTask: false,
        successListTask: true,
        errorListTask: false,
        errorHelperListTask: "",
        tasks: payload.data,
        pagesTasks: payload.pages,
      };

    case types.ERROR_FETCH_LIST_TASK:
      return {
        ...state,
        submittingListTask: false,
        successListTask: false,
        errorListTask: true,
        errorHelperListTask: payload,
      };

    /** For task detail **/
    case types.START_FETCH_TASK_DETAIL:
      return {
        ...state,
        submittingTaskDetail: true,
        successTaskDetail: false,
        errorTaskDetail: false,
        errorHelperTaskDetail: "",
      };

    case types.SUCCESS_FETCH_TASK_DETAIL:
      return {
        ...state,
        submittingTaskDetail: false,
        successTaskDetail: true,
        errorTaskDetail: false,
        errorHelperTaskDetail: "",
        taskDetail: payload.detail,
        activities: payload.activities,
        watchers: payload.watcher,
        isWatched: payload.isWatched,
        isReceivedEmail: payload.isReceivedEmail,
      };

    case types.ERROR_FETCH_TASK_DETAIL:
      return {
        ...state,
        submittingTaskDetail: false,
        successTaskDetail: false,
        errorTaskDetail: true,
        errorHelperTaskDetail: payload,
      };

    /** For task comment **/
    case types.START_FETCH_TASK_COMMENT:
      return {
        ...state,
        submittingTaskComment: true,
        successTaskComment: false,
        errorTaskComment: false,
        errorHelperTaskComment: "",
      };

    case types.SUCCESS_FETCH_TASK_COMMENT:
      let tmpActivities = state["activities"];
      let tmpActivities2 = payload;

      return {
        ...state,
        submittingTaskComment: false,
        successTaskComment: true,
        errorTaskComment: false,
        errorHelperTaskComment: "",
        activities: tmpActivities.concat(tmpActivities2),
      };

    case types.ERROR_FETCH_TASK_COMMENT:
      return {
        ...state,
        submittingTaskComment: false,
        successTaskComment: false,
        errorTaskComment: true,
        errorHelperTaskComment: payload,
      };

    /** For task watchers **/
    case types.START_FETCH_TASK_WATCHERS:
      return {
        ...state,
        submittingTaskWatcher: true,
        successTaskWatcher: false,
        errorTaskWatcher: false,
        errorHelperTaskWatcher: "",
      };

    case types.SUCCESS_FETCH_TASK_WATCHERS:
      let tmpWatchers = state["watchers"];
      let tmpIsWatched = state["isWatched"];
      let tmpIsReceivedEmail = state["isReceivedEmail"];
      let tmpWatchers2 = null;

      if (payload.data.watcher) {
        tmpIsWatched = true;
        if (payload.userName) {
          //for follow
          tmpWatchers2 = payload.data.watcher;
          tmpIsReceivedEmail = true;
        } else {
          //for get email
          tmpIsReceivedEmail = payload.data.isReceivedEmail;
          let find = tmpWatchers.findIndex(
            f => f.lineNum === payload.data.watcher.lineNum,
          );
          if (find !== -1) {
            tmpWatchers[find] = payload.data.watcher;
          }
        }
      } else {
        //for unfollow
        tmpWatchers = tmpWatchers.filter(
          item => item.lineNum !== payload.data.lineNum,
        );
        tmpIsWatched = payload.data.isWatched;
        tmpIsReceivedEmail = payload.data.isReceivedEmail;
      }

      return {
        ...state,
        submittingTaskWatcher: false,
        successTaskWatcher: true,
        errorTaskWatcher: false,
        errorHelperTaskWatcher: "",
        watchers: tmpWatchers2 ? tmpWatchers.concat(tmpWatchers2) : tmpWatchers,
        isWatched: tmpIsWatched,
        isReceivedEmail: tmpIsReceivedEmail,
      };

    case types.ERROR_FETCH_TASK_WATCHERS:
      return {
        ...state,
        submittingTaskWatcher: false,
        successTaskWatcher: false,
        errorTaskWatcher: true,
        errorHelperTaskWatcher: payload,
      };

    /** For task update per task **/
    case types.START_FETCH_TASK_UPDATE_PER:
      return {
        ...state,
        submittingTaskUpdatePer: true,
        successTaskUpdatePer: false,
        errorTaskUpdatePer: false,
        errorHelperTaskUpdatePer: "",
      };

    case types.SUCCESS_FETCH_TASK_UPDATE_PER:
      let tmpTaskPer = state["taskDetail"];
      // Update task detail
      tmpTaskPer.statusID = payload.status.statusID;
      tmpTaskPer.statusName = payload.status.statusName;
      tmpTaskPer.colorCode = payload.status.colorCode;
      tmpTaskPer.colorDarkCode = payload.status.colorCode;
      tmpTaskPer.colorOpacityCode = payload.status.colorOpacityCode;
      tmpTaskPer.percentage = payload.percentage;

      return {
        ...state,
        submittingTaskUpdatePer: false,
        successTaskUpdatePer: true,
        errorTaskUpdatePer: false,
        errorHelperTaskUpdatePer: "",
        taskDetail: tmpTaskPer,
      };

    case types.ERROR_FETCH_TASK_UPDATE_PER:
      return {
        ...state,
        submittingTaskUpdatePer: false,
        successTaskUpdatePer: false,
        errorTaskUpdatePer: true,
        errorHelperTaskUpdatePer: payload,
      };

    /** For task update sta task **/
    case types.START_FETCH_TASK_UPDATE_STA:
      return {
        ...state,
        submittingTaskUpdateSta: true,
        successTaskUpdateSta: false,
        errorTaskUpdateSta: false,
        errorHelperTaskUpdateSta: "",
      };

    case types.SUCCESS_FETCH_TASK_UPDATE_STA:
      let tmpTaskSta = state["taskDetail"];
      // Update task detail
      tmpTaskSta.statusID = payload.status.statusID;
      tmpTaskSta.statusName = payload.status.statusName;
      tmpTaskSta.colorCode = payload.status.colorCode;
      tmpTaskSta.colorDarkCode = payload.status.colorCode;
      tmpTaskSta.colorOpacityCode = payload.status.colorOpacityCode;
      tmpTaskSta.percentage = payload.percentage;

      return {
        ...state,
        submittingTaskUpdateSta: false,
        successTaskUpdateSta: true,
        errorTaskUpdateSta: false,
        errorHelperTaskUpdateSta: "",
        taskDetail: tmpTaskSta,
      };

    case types.ERROR_FETCH_TASK_UPDATE_STA:
      return {
        ...state,
        submittingTaskUpdateSta: false,
        successTaskUpdateSta: false,
        errorTaskUpdateSta: true,
        errorHelperTaskUpdateSta: payload,
      };

    /** For overview **/
    case types.START_FETCH_PROJECT_OVERVIEW:
      return {
        ...state,
        submittingOverview: true,
        successOverview: false,
        errorOverview: false,
        errorHelperTasOverview: "",
      };

    case types.SUCCESS_FETCH_PROJECT_OVERVIEW:
      return {
        ...state,
        submittingOverview: false,
        successOverview: true,
        errorOverview: false,
        errorHelperTasOverview: "",
        overview: payload.data,
        pagesOverview: payload.pages,
      };

    case types.ERROR_FETCH_PROJECT_OVERVIEW:
      return {
        ...state,
        submittingOverview: false,
        successOverview: false,
        errorOverview: true,
        errorHelperTasOverview: payload,
      };

    default:
      return state;
  }
}
