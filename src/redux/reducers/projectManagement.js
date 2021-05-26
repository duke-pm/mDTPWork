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
  countProjects: 0,
  projects: List(),
  successListProject: false,
  errorListProject: false,
  errorHelperListProject: '',

  submittingListTask: false,
  countTasks: 0,
  tasks: List(),
  successListTask: false,
  errorListTask: false,
  errorHelperListTask: '',
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
        .set('countProjects', payload.countProjects)
        .set('projects', payload.projects);

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
        .set('countTasks', payload.countTasks)
        .set('tasks', payload.tasks);

    case types.ERROR_FETCH_LIST_TASK:
      return state
        .set('submittingListTask', false)
        .set('successListTask', false)
        .set('errorListTask', true)
        .set('errorHelperListTask', payload);

    default:
      return state;
  }
}
