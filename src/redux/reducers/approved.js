/**
 ** Name: Approved.js
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of Approved.js
 **/
/* LIBRARY */
import * as types from '../actions/types';

const initialState = {
  submitting: false,
  successAddRequest: false,
  errorAddRequest: false,
  errorHelperAddRequest: '',
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.START_FETCH_ADD_REQUEST_APPROVED:
      return {
        ...state,
        submitting: true,
        successAddRequest: false,
        errorAddRequest: false,
        errorHelperAddRequest: '',
      };

    case types.SUCCESS_FETCH_ADD_REQUEST_APPROVED:
      return {
        ...state,
        submitting: false,
        successAddRequest: true,
        errorAddRequest: false,
        errorHelperAddRequest: '',
      };

    case types.ERROR_FETCH_ADD_REQUEST_APPROVED:
      return {
        ...state,
        submitting: false,
        successAddRequest: false,
        errorAddRequest: true,
        errorHelperAddRequest: action.payload,
      };

    default:
      return state;
  }
}
