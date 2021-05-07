/**
 ** Name: Approved.js
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/* LIBRARY */
import { fromJS, List } from 'immutable';
import * as types from '../actions/types';

export const initialState = fromJS({
  submittingList: false,
  submittingAdd: false,
  submittingApproved: false,
  submittingReject: false,

  countRequests: 0,
  requests: List(),
  requestsDetail: List(),
  processApproved: List(),
  successListRequest: false,
  errorListRequest: false,
  errorHelperListRequest: '',

  successAddRequest: false,
  errorAddRequest: false,
  errorHelperAddRequest: '',

  successApprovedRequest: false,
  errorApprovedRequest: false,
  errorHelperApprovedRequest: '',

  successRejectRequest: false,
  errorRejectRequest: false,
  errorHelperRejectRequest: '',
});

export default function (state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    /** For list request **/
    case types.START_FETCH_LIST_REQUEST_APPROVED:
      return state
        .set('submittingList', true)
        .set('successListRequest', false)
        .set('errorListRequest', false)
        .set('errorHelperListRequest', '');

    case types.SUCCESS_FETCH_LIST_REQUEST_APPROVED:
      return state
        .set('countRequests', payload.countRequests)
        .set('requests', payload.requests)
        .set('requestsDetail', payload.requestsDetail)
        .set('processApproved', payload.processApproved)
        .set('submittingList', false)
        .set('successListRequest', true)
        .set('errorListRequest', false)
        .set('errorHelperListRequest', '');

    case types.ERROR_FETCH_LIST_REQUEST_APPROVED:
      return state
        .set('submittingList', false)
        .set('successListRequest', false)
        .set('errorListRequest', true)
        .set('errorHelperListRequest', payload);
    /*****************************/

    /** For add request **/
    case types.START_FETCH_ADD_REQUEST_APPROVED:
      return state
        .set('submittingAdd', true)
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '')
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');

    case types.SUCCESS_FETCH_ADD_REQUEST_APPROVED:
      return state
        .set('submittingAdd', false)
        .set('successAddRequest', true)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '')
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');

    case types.ERROR_FETCH_ADD_REQUEST_APPROVED:
      return state
        .set('submittingAdd', false)
        .set('successAddRequest', false)
        .set('errorAddRequest', true)
        .set('errorHelperAddRequest', payload)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');
    /*****************************/

    /** For add request lost/damage **/
    case types.START_FETCH_ADD_REQUEST_LOST:
      return state
        .set('submittingAdd', true)
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '')
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');

    case types.SUCCESS_FETCH_ADD_REQUEST_LOST:
      return state
        .set('submittingAdd', false)
        .set('successAddRequest', true)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '')
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');

    case types.ERROR_FETCH_ADD_REQUEST_LOST:
      return state
        .set('submittingAdd', false)
        .set('successAddRequest', false)
        .set('errorAddRequest', true)
        .set('errorHelperAddRequest', payload)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');
    /*****************************/

    /** For approved request **/
    case types.START_FETCH_APPROVED_REQUEST:
      return state
        .set('submittingApproved', true)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '')
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');

    case types.SUCCESS_FETCH_APPROVED_REQUEST:
      return state
        .set('submittingApproved', false)
        .set('successApprovedRequest', true)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '')
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');

    case types.ERROR_FETCH_APPROVED_REQUEST:
      return state
        .set('submittingApproved', false)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', true)
        .set('errorHelperApprovedRequest', payload)
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '')
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');
    /*****************************/

    /** For reject request **/
    case types.START_FETCH_REJECT_REQUEST:
      return state
        .set('submittingReject', true)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '')
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');

    case types.SUCCESS_FETCH_REJECT_REQUEST:
      return state
        .set('submittingReject', false)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', true)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '')
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');

    case types.ERROR_FETCH_REJECT_REQUEST:
      return state
        .set('submittingReject', false)
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', true)
        .set('errorHelperRejectRequest', payload)
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '');
    /*****************************/

    default:
      return state;
  }
};
