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
  submittingRemove: false,
  submittingDetail: false,

  successList: false,
  successAdd: false,
  successRemove: false,
  successDetail: false,

  errorList: false,
  errorHelperList: '',
  errorAdd: false,
  errorHelperAdd: '',
  errorRemove: false,
  errorHelperRemove: '',
  errorDetail: false,
  errorHelperDetail: '',

  bookings: [],
  bookingDetail: null,
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_BOOKING_DETAIL:
      return state
        .set('submittingDetail', false)
        .set('successDetail', false)
        .set('errorDetail', false)
        .set('errorHelperDetail', '')
        .set('bookingDetail', null);

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
        .set('errorHelperAdd', '');

    case types.ERROR_FETCH_ADD_BOOKING:
      return state
        .set('submittingAdd', false)
        .set('successAdd', false)
        .set('errorAdd', true)
        .set('errorHelperAdd', payload);

    /** For remove booking **/
    case types.START_FETCH_REMOVE_BOOKING:
      return state
        .set('submittingRemove', true)
        .set('successRemove', false)
        .set('errorRemove', false)
        .set('errorHelperRemove', '');

    case types.SUCCESS_FETCH_REMOVE_BOOKING:
      return state
        .set('submittingRemove', false)
        .set('successRemove', true)
        .set('errorRemove', false)
        .set('errorHelperRemove', '');

    case types.ERROR_FETCH_REMOVE_BOOKING:
      return state
        .set('submittingRemove', false)
        .set('successRemove', false)
        .set('errorRemove', true)
        .set('errorHelperRemove', payload);

    /** For remove booking **/
    case types.START_FETCH_BOOKING_DETAIL:
      return state
        .set('submittingDetail', true)
        .set('successDetail', false)
        .set('errorDetail', false)
        .set('errorHelperDetail', '');

    case types.SUCCESS_FETCH_BOOKING_DETAIL:
      return state
        .set('submittingDetail', false)
        .set('successDetail', true)
        .set('errorDetail', false)
        .set('errorHelperDetail', '')
        .set('bookingDetail', payload[0] || null);

    case types.ERROR_FETCH_BOOKING_DETAIL:
      return state
        .set('submittingDetail', false)
        .set('successDetail', false)
        .set('errorDetail', true)
        .set('errorHelperDetail', payload);

    /** For list booking by Resource **/
    case types.START_FETCH_LIST_BOOKING_BY_RESRC:
      return state
        .set('submittingList', true)
        .set('successList', false)
        .set('errorList', false)
        .set('errorHelperList', '');

    case types.SUCCESS_FETCH_LIST_BOOKING_BY_RESRC:
      return state
        .set('submittingList', false)
        .set('successList', true)
        .set('errorList', false)
        .set('errorHelperList', '')
        .set('bookings', payload);

    case types.ERROR_FETCH_LIST_BOOKING_BY_RESRC:
      return state
        .set('submittingList', false)
        .set('successList', false)
        .set('errorList', true)
        .set('errorHelperList', payload);
    default:
      return state;
  }
}
