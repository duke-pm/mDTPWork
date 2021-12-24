/**
 ** Name: Approved.js
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/* LIBRARY */
import {fromJS, List} from 'immutable';
/** REDUX */
import * as types from '../actions/types';

export const initialState = fromJS({
  submittingListProject: false,
  submittingTaskDetail: false,
  submittingTaskComment: false,
  submittingTaskWatcher: false,
  submittingTaskUpdate: false,
  submittingListTask: false,
  submittingOverview: false,

  successListProject: false,
  successListTask: false,
  successTaskDetail: false,
  successTaskComment: false,
  successTaskWatcher: false,
  successTaskUpdate: false,
  successOverview: false,

  errorListTask: false,
  errorHelperListTask: '',
  errorListProject: false,
  errorHelperListProject: '',
  errorTaskDetail: false,
  errorHelperTaskDetail: '',
  errorTaskComment: false,
  errorHelperTaskComment: '',
  errorTaskWatcher: false,
  errorHelperTaskWatcher: '',
  errorTaskUpdate: false,
  errorHelperTaskUpdate: '',
  errorOverview: false,
  errorHelperOverview: '',

  isWatched: false,
  isReceivedEmail: false,
  overview: [],
  projects: [],
  tasks: [],
  pagesProjects: 0,
  pagesTasks: 0,
  pagesOverview: 0,
  taskDetail: null,
  activities: List(),
  watchers: List(),
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_PROJECT:
      return state
        .set('submittingTaskComment', false)
        .set('submittingTaskWatcher', false)
        .set('submittingTaskUpdate', false)
        .set('successTaskComment', false)
        .set('successTaskWatcher', false)
        .set('successTaskUpdate', false)
        .set('errorTaskComment', false)
        .set('errorTaskWatcher', false)
        .set('errorTaskUpdate', false)
        .set('errorHelperTaskComment', false)
        .set('errorHelperTaskWatcher', false)
        .set('errorHelperTaskUpdate', false);
        
    /** For list project **/
    case types.START_FETCH_LIST_PROJECT:
      return state
        .set('submittingListProject', true)
        .set('successListProject', false)
        .set('errorListProject', false)
        .set('errorHelperListProject', '');

    case types.SUCCESS_FETCH_LIST_PROJECT:
      return state
        .set('submittingListProject', false)
        .set('successListProject', true)
        .set('errorListProject', false)
        .set('errorHelperListProject', '')
        .set('projects', payload.data)
        .set('pagesProjects', payload.pages);

    case types.ERROR_FETCH_LIST_PROJECT:
      return state
        .set('submittingListProject', false)
        .set('successListProject', false)
        .set('errorListProject', true)
        .set('errorHelperListProject', payload);

    /** For list task of project **/
    case types.START_FETCH_LIST_TASK:
      return state
        .set('submittingListTask', true)
        .set('successListTask', false)
        .set('errorListTask', false)
        .set('errorHelperListTask', '');

    case types.SUCCESS_FETCH_LIST_TASK:
      return state
        .set('submittingListTask', false)
        .set('successListTask', true)
        .set('errorListTask', false)
        .set('errorHelperListTask', '')
        .set('tasks', payload.data)
        .set('pagesTasks', payload.pages);

    case types.ERROR_FETCH_LIST_TASK:
      return state
        .set('submittingListTask', false)
        .set('successListTask', false)
        .set('errorListTask', true)
        .set('errorHelperListTask', payload);

    /** For task detail **/
    case types.START_FETCH_TASK_DETAIL:
      return state
        .set('submittingTaskDetail', true)
        .set('successTaskDetail', false)
        .set('errorTaskDetail', false)
        .set('errorHelperTaskDetail', '');

    case types.SUCCESS_FETCH_TASK_DETAIL:
      return state
        .set('submittingTaskDetail', false)
        .set('successTaskDetail', true)
        .set('errorTaskDetail', false)
        .set('errorHelperTaskDetail', '')
        .set('taskDetail', payload.detail)
        .set('activities', payload.activities)
        .set('watchers', payload.watcher)
        .set('isWatched', payload.isWatched)
        .set('isReceivedEmail', payload.isReceivedEmail);

    case types.ERROR_FETCH_TASK_DETAIL:
      return state
        .set('submittingTaskDetail', false)
        .set('successTaskDetail', false)
        .set('errorTaskDetail', true)
        .set('errorHelperTaskDetail', payload);

    /** For task comment **/
    case types.START_FETCH_TASK_COMMENT:
      return state
        .set('submittingTaskComment', true)
        .set('successTaskComment', false)
        .set('errorTaskComment', false)
        .set('errorHelperTaskComment', '');

    case types.SUCCESS_FETCH_TASK_COMMENT:
      let tmpActivities = state.get('activities');
      let tmpActivities2 = payload;

      return state
        .set('submittingTaskComment', false)
        .set('successTaskComment', true)
        .set('errorTaskComment', false)
        .set('errorHelperTaskComment', '')
        .set('activities', tmpActivities.concat(tmpActivities2));

    case types.ERROR_FETCH_TASK_COMMENT:
      return state
        .set('submittingTaskComment', false)
        .set('successTaskComment', false)
        .set('errorTaskComment', true)
        .set('errorHelperTaskComment', payload);

    /** For task watchers **/
    case types.START_FETCH_TASK_WATCHERS:
      return state
        .set('submittingTaskWatcher', true)
        .set('successTaskWatcher', false)
        .set('errorTaskWatcher', false)
        .set('errorHelperTaskWatcher', '');

    case types.SUCCESS_FETCH_TASK_WATCHERS:
      let tmpWatchers = state.get('watchers');
      let tmpIsWatched = state.get('isWatched');
      let tmpIsReceivedEmail = state.get('isReceivedEmail');
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
      return state
        .set('submittingTaskWatcher', false)
        .set('successTaskWatcher', true)
        .set('errorTaskWatcher', false)
        .set('errorHelperTaskWatcher', '')
        .set(
          'watchers',
          tmpWatchers2 ? tmpWatchers.concat(tmpWatchers2) : tmpWatchers,
        )
        .set('isWatched', tmpIsWatched)
        .set('isReceivedEmail', tmpIsReceivedEmail);

    case types.ERROR_FETCH_TASK_WATCHERS:
      return state
        .set('submittingTaskWatcher', false)
        .set('successTaskWatcher', false)
        .set('errorTaskWatcher', true)
        .set('errorHelperTaskWatcher', payload);

    /** For task update task **/
    case types.START_FETCH_TASK_UPDATE:
      return state
        .set('submittingTaskUpdate', true)
        .set('successTaskUpdate', false)
        .set('errorTaskUpdate', false)
        .set('errorHelperTaskUpdate', '');

    case types.SUCCESS_FETCH_TASK_UPDATE:
      let tmpTask = state.get('taskDetail');
      // Update task detail
      tmpTask.statusID = payload.status.statusID;
      tmpTask.statusName = payload.status.statusName;
      tmpTask.colorCode = payload.status.colorCode;
      tmpTask.colorDarkCode = payload.status.colorCode;
      tmpTask.colorOpacityCode = payload.status.colorOpacityCode;
      tmpTask.percentage = payload.percentage;

      return state
        .set('submittingTaskUpdate', false)
        .set('successTaskUpdate', true)
        .set('errorTaskUpdate', false)
        .set('errorHelperTaskUpdate', '')
        .set('taskDetail', tmpTask);

    case types.ERROR_FETCH_TASK_UPDATE:
      return state
        .set('submittingTaskUpdate', false)
        .set('successTaskUpdate', false)
        .set('errorTaskUpdate', true)
        .set('errorHelperTaskUpdate', payload);

    /** For overview **/
    case types.START_FETCH_PROJECT_OVERVIEW:
      return state
        .set('submittingOverview', true)
        .set('successOverview', false)
        .set('errorOverview', false)
        .set('errorHelperTasOverview', '');

    case types.SUCCESS_FETCH_PROJECT_OVERVIEW:
      return state
        .set('submittingOverview', false)
        .set('successOverview', true)
        .set('errorOverview', false)
        .set('errorHelperTasOverview', '')
        .set('overview', payload.data)
        .set('pagesOverview', payload.pages);

    case types.ERROR_FETCH_PROJECT_OVERVIEW:
      return state
        .set('submittingOverview', false)
        .set('successOverview', false)
        .set('errorOverview', true)
        .set('errorHelperTasOverview', payload);

    default:
      return state;
  }
}
