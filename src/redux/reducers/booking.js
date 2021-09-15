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
  submittingListBooking: false,
  submittingAddBooking: false,

  successListBooking: false,
  successAddBooking: false,

  errorListBooking: false,
  errorHelperListBooking: '',
  errorAddBooking: false,
  errorHelperAddBooking: '',

  bookings: [],
  bookingDetail: null,
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_REQUEST_BOOKING:
      return state
        .set('submittingAddBooking', false)
        .set('successAddBooking', false)
        .set('errorAddBooking', false)
        .set('errorHelperAddBooking', '');

    /** For list booking **/
    case types.START_FETCH_LIST_BOOKING:
      return state
        .set('submittingListBooking', true)
        .set('successListBooking', false)
        .set('errorListBooking', false)
        .set('errorHelperListBooking', '');

    case types.SUCCESS_FETCH_LIST_PROJECT:
      return state
        .set('submittingListBooking', false)
        .set('successListBooking', true)
        .set('errorListBooking', false)
        .set('errorHelperListBooking', '')
        .set('bookings', payload);

    case types.ERROR_FETCH_LIST_PROJECT:
      return state
        .set('submittingListBooking', false)
        .set('successListBooking', false)
        .set('errorListBooking', true)
        .set('errorHelperListBooking', payload);

    /** For add booking **/
    case types.START_FETCH_ADD_BOOKING:
      return state
        .set('submittingAddBooking', true)
        .set('successAddBooking', false)
        .set('errorAddBooking', false)
        .set('errorHelperAddBooking', '');

    case types.SUCCESS_FETCH_ADD_BOOKING:
      return state
        .set('submittingAddBooking', false)
        .set('successAddBooking', true)
        .set('errorAddBooking', false)
        .set('errorHelperAddBooking', '')
        .set('bookingDetail', payload);

    case types.ERROR_FETCH_ADD_BOOKING:
      return state
        .set('submittingAddBooking', false)
        .set('successAddBooking', false)
        .set('errorAddBooking', true)
        .set('errorHelperAddBooking', payload);
    default:
      return state;
  }
}
