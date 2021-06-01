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
  submittingList: false,
  submittingListDamage: false,
  submittingListLost: false,
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

  countRequestsDamage: 0,
  requestsDamage: List(),
  requestsDamageDetail: List(),
  processDamageApproved: List(),
  successListRequestDamage: false,
  errorListRequestDamage: false,
  errorHelperListRequestDamage: '',

  countRequestsLost: 0,
  requestsLost: List(),
  requestsLostDetail: List(),
  processLostApproved: List(),
  successListRequestLost: false,
  errorListRequestLost: false,
  errorHelperListRequestLost: '',

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
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_APPROVED:
      return state
        .set('submittingAdd', false)
        .set('submittingApproved', false)
        .set('submittingReject', false)
        .set('successAddRequest', false)
        .set('errorAddRequest', false)
        .set('errorHelperAddRequest', '')
        .set('successApprovedRequest', false)
        .set('errorApprovedRequest', false)
        .set('errorHelperApprovedRequest', '')
        .set('successRejectRequest', false)
        .set('errorRejectRequest', false)
        .set('errorHelperRejectRequest', '');

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

    /** For list request damage **/
    case types.START_FETCH_LIST_REQUEST_DAMAGE:
      return state
        .set('submittingListDamage', true)
        .set('successListRequestDamage', false)
        .set('errorListRequestDamage', false)
        .set('errorHelperListRequestDamage', '');

    case types.SUCCESS_FETCH_LIST_REQUEST_DAMAGE:
      return state
        .set('countRequestsDamage', payload.countRequests)
        .set('requestsDamage', payload.requests)
        .set('requestsDamageDetail', payload.requestsDetail)
        .set('processDamageApproved', payload.processApproved)
        .set('submittingListDamage', false)
        .set('successListRequestDamage', true)
        .set('errorListRequestDamage', false)
        .set('errorHelperListRequestDamage', '');

    case types.ERROR_FETCH_LIST_REQUEST_DAMAGE:
      return state
        .set('submittingListDamage', false)
        .set('successListRequestDamage', false)
        .set('errorListRequestDamage', true)
        .set('errorHelperListRequestDamage', payload);
    /*****************************/

    /** For list request lost **/
    case types.START_FETCH_LIST_REQUEST_LOST:
      return state
        .set('submittingListLost', true)
        .set('successListRequestLost', false)
        .set('errorListRequestLost', false)
        .set('errorHelperListRequestLost', '');

    case types.SUCCESS_FETCH_LIST_REQUEST_LOST:
      return state
        .set('countRequestsLost', payload.countRequests)
        .set('requestsLost', payload.requests)
        .set('requestsLostDetail', payload.requestsDetail)
        .set('processLostApproved', payload.processApproved)
        .set('submittingListLost', false)
        .set('successListRequestLost', true)
        .set('errorListRequestLost', false)
        .set('errorHelperListRequestLost', '');

    case types.ERROR_FETCH_LIST_REQUEST_LOST:
      return state
        .set('submittingListLost', false)
        .set('successListRequestLost', false)
        .set('errorListRequestLost', true)
        .set('errorHelperListRequestLost', payload);
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
}
