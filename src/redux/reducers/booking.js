/**
 ** Name: Booking Reducer
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Booking.js
 **/
/* LIBRARY */
import {fromJS} from 'immutable';
/** REDUX */
import * as types from '../actions/types';

export const initialState = fromJS({
  submittingList: false,
  submittingAdd: false,

  successList: false,
  successAdd: false,

  errorList: false,
  errorHelperList: '',
  errorAdd: false,
  errorHelperAdd: '',

  bookings: [],
  bookingDetail: null,
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_BOOKING:
      return state
        .set('submittingAdd', false)
        .set('successAdd', false)
        .set('errorAdd', false)
        .set('errorHelperAdd', '');

    /** For list booking **/
    case types.START_FETCH_LIST_BOOKING:
      return state
        .set('submittingList', true)
        .set('successList', false)
        .set('errorList', false)
        .set('errorHelperList', '');

    case types.SUCCESS_FETCH_LIST_BOOKING:
      return state
        .set('submittingList', false)
        .set('successList', true)
        .set('errorList', false)
        .set('errorHelperList', '')
        .set('bookings', payload);

    case types.ERROR_FETCH_LIST_BOOKING:
      return state
        .set('submittingList', false)
        .set('successList', false)
        .set('errorList', true)
        .set('errorHelperList', payload);

    /** For add booking **/
    case types.START_FETCH_ADD_BOOKING:
      return state
        .set('submittingAdd', true)
        .set('successAdd', false)
        .set('errorAdd', false)
        .set('errorHelperAdd', '');

    case types.SUCCESS_FETCH_ADD_BOOKING:
      return state
        .set('submittingAdd', false)
        .set('successAdd', true)
        .set('errorAdd', false)
        .set('errorHelperAdd', '')
        .set('bookingDetail', payload);

    case types.ERROR_FETCH_ADD_BOOKING:
      return state
        .set('submittingAdd', false)
        .set('successAdd', false)
        .set('errorAdd', true)
        .set('errorHelperAdd', payload);
    default:
      return state;
  }
}
