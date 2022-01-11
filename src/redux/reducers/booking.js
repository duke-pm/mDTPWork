/**
 ** Name: Booking Reducer
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Booking.js
 **/
/** REDUX */
import * as types from '../actions/types';

export const initialState = {
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
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_BOOKING_DETAIL:
      return {
        ...state,
        submittingDetail: false,
        successDetail: false,
        errorDetail: false,
        errorHelperDetail: "",
        bookingDetail: null,
      };

    case types.RESET_REQUEST_BOOKING:
      return {
        ...state,
        submittingAdd: false,
        successAdd: false,
        errorAdd: false,
        errorHelperAdd: "",
        bookingDetail: null,
      };

    /** For list booking **/
    case types.START_FETCH_LIST_BOOKING:
      return {
        ...state,
        submittingList: true,
        successList: false,
        errorList: false,
        errorHelperList: "",
      };

    case types.SUCCESS_FETCH_LIST_BOOKING:
      return {
        ...state,
        submittingList: false,
        successList: true,
        errorList: false,
        errorHelperList: "",
        bookings: payload,
      };

    case types.ERROR_FETCH_LIST_BOOKING:
      return {
        ...state,
        submittingList: false,
        successList: false,
        errorList: true,
        errorHelperList: payload,
      };

    /** For add booking **/
    case types.START_FETCH_ADD_BOOKING:
      return {
        ...state,
        submittingAdd: true,
        successAdd: false,
        errorAdd: false,
        errorHelperAdd: "",
      };

    case types.SUCCESS_FETCH_ADD_BOOKING:
      return {
        ...state,
        submittingAdd: false,
        successAdd: true,
        errorAdd: false,
        errorHelperAdd: "",
      };

    case types.ERROR_FETCH_ADD_BOOKING:
      return {
        ...state,
        submittingAdd: false,
        successAdd: false,
        errorAdd: true,
        errorHelperAdd: payload,
      };

    /** For remove booking **/
    case types.START_FETCH_REMOVE_BOOKING:
      return {
        ...state,
        submittingRemove: true,
        successRemove: false,
        errorRemove: false,
        errorHelperRemove: "",
      };

    case types.SUCCESS_FETCH_REMOVE_BOOKING:
      return {
        ...state,
        submittingRemove: fasle,
        successRemove: true,
        errorRemove: false,
        errorHelperRemove: "",
      };

    case types.ERROR_FETCH_REMOVE_BOOKING:
      return {
        ...state,
        submittingRemove: false,
        successRemove: false,
        errorRemove: true,
        errorHelperRemove: payload,
      };

    /** For remove booking **/
    case types.START_FETCH_BOOKING_DETAIL:
      return {
        ...state,
        submittingDetail: true,
        successDetail: false,
        errorDetail: false,
        errorHelperDetail: "",
      };

    case types.SUCCESS_FETCH_BOOKING_DETAIL:
      return {
        ...state,
        submittingDetail: false,
        successDetail: true,
        errorDetail: false,
        errorHelperDetail: "",
        bookingDetail: payload[0] || null,
      };

    case types.ERROR_FETCH_BOOKING_DETAIL:
      return {
        ...state,
        submittingDetail: false,
        successDetail: false,
        errorDetail: true,
        errorHelperDetail: payload,
      };

    /** For list booking by Resource **/
    case types.START_FETCH_LIST_BOOKING_BY_RESRC:
      return {
        ...state,
        submittingList: true,
        successList: false,
        errorList: false,
        errorHelperList: "",
      };

    case types.SUCCESS_FETCH_LIST_BOOKING_BY_RESRC:
      return {
        ...state,
        submittingList: false,
        successList: true,
        errorList: false,
        errorHelperList: "",
        bookings: payload,
      };

    case types.ERROR_FETCH_LIST_BOOKING_BY_RESRC:
      return {
        ...state,
        submittingList: false,
        successList: false,
        errorList: true,
        errorHelperList: payload,
      };
      
    default:
      return state;
  }
}
