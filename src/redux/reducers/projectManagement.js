/**
 ** Name: Approved.js
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/* LIBRARY */
import {fromJS, List} from 'immutable';
/** REDUX */
import * as types from '../actions/types';

export const initialState = fromJS({
  submittingListProject: false,
  projects: [],
  successListProject: false,
  errorListProject: false,
  errorHelperListProject: '',

  submittingListTask: false,
  tasks: [],
  successListTask: false,
  errorListTask: false,
  errorHelperListTask: '',

  submittingTaskDetail: false,
  submittingTaskComment: false,
  taskDetail: null,
  activities: List(),
  relationships: [],
  watchers: [],
  successTaskDetail: false,
  errorTaskDetail: false,
  errorHelperTaskDetail: '',
  successTaskComment: false,
  errorTaskComment: false,
  errorHelperTaskComment: '',
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
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
        .set('projects', payload);

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
        .set('tasks', payload);

    case types.ERROR_FETCH_LIST_TASK:
      return state
        .set('submittingListTask', false)
        .set('successListTask', false)
        .set('errorListTask', true)
        .set('errorHelperListTask', payload);

    /** For task detail **/
    case types.RESET_TASK_DETAIL:
      return state
        .set('submittingTaskDetail', false)
        .set('taskDetail', null)
        .set('activities', [])
        .set('relationships', [])
        .set('watchers', [])
        .set('successTaskDetail', false)
        .set('errorTaskDetail', false)
        .set('errorHelperTaskDetail', '');

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
        .set('relationships', payload.relationShip)
        .set('watchers', payload.watcher);

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
      let tmp = state.get('activities');
      let tmp2 = payload;

      return state
        .set('submittingTaskComment', false)
        .set('successTaskComment', true)
        .set('errorTaskComment', false)
        .set('errorHelperTaskComment', '')
        .set('activities', tmp.concat(tmp2));

    case types.ERROR_FETCH_TASK_COMMENT:
      return state
        .set('submittingTaskComment', false)
        .set('successTaskComment', false)
        .set('errorTaskComment', true)
        .set('errorHelperTaskComment', payload);

    default:
      return state;
  }
}
