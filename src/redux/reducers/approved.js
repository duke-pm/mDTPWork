/**
 ** Name: Approved
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/** REDUX */
import * as types from '../actions/types';

export const initialState = {
  submittingList: false,
  submittingListDamage: false,
  submittingListLost: false,
  submittingAdd: false,
  submittingApproved: false,
  submittingReject: false,
  submittingRequestDetail: false,

  countRequests: 0,
  requests: [],
  requestsDetail: [],
  processApproved: [],
  successListRequest: false,
  errorListRequest: false,
  errorHelperListRequest: '',

  countRequestsDamage: 0,
  requestsDamage: [],
  requestsDamageDetail: [],
  processDamageApproved: [],
  successListRequestDamage: false,
  errorListRequestDamage: false,
  errorHelperListRequestDamage: '',

  countRequestsLost: 0,
  requestsLost: [],
  requestsLostDetail: [],
  processLostApproved: [],
  successListRequestLost: false,
  errorListRequestLost: false,
  errorHelperListRequestLost: '',

  requestDetail: null,
  requestAssetsDetail: null,
  requestProcessDetail: null,

  successRequestDetail: false,
  errorRequestDetail: false,
  errorHelperRequestDetail: '',

  successAddRequest: false,
  errorAddRequest: false,
  errorHelperAddRequest: '',

  successApprovedRequest: false,
  errorApprovedRequest: false,
  errorHelperApprovedRequest: '',

  successRejectRequest: false,
  errorRejectRequest: false,
  errorHelperRejectRequest: '',
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_APPROVED:
      return {
        ...state,
        submittingAdd: false,
        submittingApproved: false,
        submittingReject: false,
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: '',
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: '',
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: '',
        requests: [],
        requestsDetail: [],
        processApproved: [],
        requestsDamage: [],
        requestsDamageDetail: [],
        processDamageApproved: [],
        requestsLost: [],
        requestsLostDetail: [],
        processLostApproved: [],
      };

    /** For list request **/
    case types.START_FETCH_LIST_REQUEST_APPROVED:
      return {
        ...state,
        submittingList: true,
        successListRequest: false,
        errorListRequest: false,
        errorHelperListRequest: '',
        requestDetail: null,
      };

    case types.SUCCESS_FETCH_LIST_REQUEST_APPROVED:
      return {
        ...state,
        countRequests: payload.countRequests,
        requests: payload.requests,
        requestsDetail: payload.requestsDetail,
        processApproved: payload.processApproved,
        submittingList: false,
        successListRequest: true,
        errorListRequest: false,
        errorHelperListRequest: '',
      };

    case types.ERROR_FETCH_LIST_REQUEST_APPROVED:
      return {
        ...state,
        submittingList: false,
        successListRequest: false,
        errorListRequest: true,
        errorHelperListRequest: payload,
      };
    /*****************************/

    /** For list request damage **/
    case types.START_FETCH_LIST_REQUEST_DAMAGE:
      return {
        ...state,
        submittingListDamage: true,
        successListRequestDamage: false,
        errorListRequestDamage: false,
        errorHelperListRequestDamage: "",
        requestDetail: null,
      };

    case types.SUCCESS_FETCH_LIST_REQUEST_DAMAGE:
      return {
        ...state,
        countRequestsDamage: payload.countRequests,
        requestsDamage: payload.requests,
        requestsDamageDetail: payload.requestsDetail,
        processDamageApproved: payload.processApproved,
        submittingListDamage: false,
        successListRequestDamage: true,
        errorListRequestDamage: false,
        errorHelperListRequestDamage: "",
      };

    case types.ERROR_FETCH_LIST_REQUEST_DAMAGE:
      return {
        ...state,
        submittingListDamage: false,
        successListRequestDamage: false,
        errorListRequestDamage: true,
        errorHelperListRequestDamage: payload,
      };
    /*****************************/

    /** For list request lost **/
    case types.START_FETCH_LIST_REQUEST_LOST:
      return {
        ...state,
        submittingListLost: true,
        successListRequestLost: false,
        errorListRequestLost: false,
        errorHelperListRequestLost: "",
        requestDetail: null,
      };

    case types.SUCCESS_FETCH_LIST_REQUEST_LOST:
      return {
        ...state,
        countRequestsLost: payload.countRequests,
        requestsLost: payload.requests,
        requestsLostDetail: payload.requestsDetail,
        processLostApproved: payload.processApproved,
        submittingListLost: false,
        successListRequestLost: true,
        errorListRequestLost: false,
        errorHelperListRequestLost: "",
      };

    case types.ERROR_FETCH_LIST_REQUEST_LOST:
      return {
        ...state,
        submittingListLost: false,
        successListRequestLost: false,
        errorListRequestLost: true,
        errorHelperListRequestLost: payload,
      };
    /*****************************/

    /** For request detail **/
    case types.START_FETCH_REQUEST_DETAIL:
      return {
        ...state,
        submittingRequestDetail: true,
        successRequestDetail: false,
        errorRequestDetail: false,
        errorHelperRequestDetail: "",
        requestDetail: null,
      };

    case types.SUCCESS_FETCH_REQUEST_DETAIL:
      return {
        ...state,
        submittingRequestDetail: false,
        successRequestDetail: true,
        errorRequestDetail: false,
        errorHelperRequestDetail: "",
        requestDetail: payload.listRequest[0] || null,
        requestAssetsDetail: payload.listRequestDetail,
        requestProcessDetail: payload.listProcessApprove,
      };

    case types.ERROR_FETCH_REQUEST_DETAIL:
      return {
        ...state,
        submittingRequestDetail: false,
        successRequestDetail: false,
        errorRequestDetail: true,
        errorHelperRequestDetail: payload,
      };

    /** For add request **/
    case types.START_FETCH_ADD_REQUEST_APPROVED:
      return {...state,
        submittingAdd: true,
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };

    case types.SUCCESS_FETCH_ADD_REQUEST_APPROVED:
      return {
        ...state,
        submittingAdd: false,
        successAddRequest: true,
        errorAddRequest: false,
        errorHelperAddRequest: "",
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };

    case types.ERROR_FETCH_ADD_REQUEST_APPROVED:
      return {
        ...state,
        submittingAdd: false,
        successAddRequest: false,
        errorAddRequest: true,
        errorHelperAddRequest: payload,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };
    /*****************************/

    /** For add request lost/damage **/
    case types.START_FETCH_ADD_REQUEST_LOST:
      return {
        ...state,
        submittingAdd: true,
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };

    case types.SUCCESS_FETCH_ADD_REQUEST_LOST:
      return {
        ...state,
        submittingAdd: false,
        successAddRequest: true,
        errorAddRequest: false,
        errorHelperAddRequest: "",
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };

    case types.ERROR_FETCH_ADD_REQUEST_LOST:
      return {
        ...state,
        submittingAdd: false,
        successAddRequest: false,
        errorAddRequest: true,
        errorHelperAddRequest: payload,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
      };
    /*****************************/

    /** For approved request **/
    case types.START_FETCH_APPROVED_REQUEST:
      return {
        ...state,
        submittingApproved: true,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };

    case types.SUCCESS_FETCH_APPROVED_REQUEST:
      return {
        ...state,
        submittingApproved: false,
        successApprovedRequest: true,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };

    case types.ERROR_FETCH_APPROVED_REQUEST:
      return {
        ...state,
        submittingApproved: false,
        successApprovedRequest: false,
        errorApprovedRequest: true,
        errorHelperApprovedRequest: payload,
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };
    /*****************************/

    /** For reject request **/
    case types.START_FETCH_REJECT_REQUEST:
      return {
        ...state,
        submittingReject: true,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };

    case types.SUCCESS_FETCH_REJECT_REQUEST:
      return {
        ...state,
        submittingReject: false,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: true,
        errorRejectRequest: false,
        errorHelperRejectRequest: "",
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };

    case types.ERROR_FETCH_REJECT_REQUEST:
      return {
        ...state,
        submittingReject: false,
        successApprovedRequest: false,
        errorApprovedRequest: false,
        errorHelperApprovedRequest: "",
        successRejectRequest: false,
        errorRejectRequest: true,
        errorHelperRejectRequest: payload,
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: "",
      };
    /*****************************/

    default:
      return state;
  }
}
