/**
 ** Name: Booking actions
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Booking.js
 **/
/* COMMON */
import Services from '~/services';
/** REDUX */
import * as types from './types';
import * as Actions from '~/redux/actions';

export const resetAllBooking = () => ({
  type: types.RESET_REQUEST_BOOKING,
});

/** For get list booking */
export const listBookingError = error => ({
  type: types.ERROR_FETCH_LIST_BOOKING,
  payload: error,
});

export const listBookingSuccess = bookings => ({
  type: types.SUCCESS_FETCH_LIST_BOOKING,
  payload: bookings,
});

export const fetchListBooking = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_LIST_BOOKING});

    Services.booking
      .listBooking(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(listBookingSuccess(res.data.lstBooking));
        } else {
          return dispatch(listBookingError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(listBookingError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchListBooking(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For add booking */
export const addBookingError = error => ({
  type: types.ERROR_FETCH_ADD_BOOKING,
  payload: error,
});

export const addBookingSuccess = () => ({
  type: types.SUCCESS_FETCH_ADD_BOOKING,
});

export const fetchAddBooking = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_ADD_BOOKING});

    Services.booking
      .addBooking(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(addBookingSuccess());
        } else {
          return dispatch(addBookingError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(addBookingError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.RefreshToken,
            Lang: params.Lang,
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchAddBooking(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For remove booking */
export const removeBookingError = error => ({
  type: types.ERROR_FETCH_REMOVE_BOOKING,
  payload: error,
});

export const removeBookingSuccess = () => ({
  type: types.SUCCESS_FETCH_REMOVE_BOOKING,
});

export const fetchRemoveBooking = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_REMOVE_BOOKING});

    Services.booking
      .removeBooking(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(removeBookingSuccess());
        } else {
          return dispatch(removeBookingError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(removeBookingError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.RefreshToken,
            Lang: params.Lang,
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchRemoveBooking(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/

/** For get booking detail */
export const bookingDetailError = error => ({
  type: types.ERROR_FETCH_BOOKING_DETAIL,
  payload: error,
});

export const bookingDetailSuccess = data => ({
  type: types.SUCCESS_FETCH_BOOKING_DETAIL,
  payload: data,
});

export const fetchBookingDetail = (params, navigation) => {
  return dispatch => {
    dispatch({type: types.START_FETCH_BOOKING_DETAIL});

    Services.booking
      .bookingDetail(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(bookingDetailSuccess(res.data));
        } else {
          return dispatch(bookingDetailError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(bookingDetailError(error));
        if (error.message && error.message.search('Authorization') !== -1) {
          let tmp = {
            RefreshToken: params.get('RefreshToken'),
            Lang: params.get('Lang'),
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchBookingDetail(params),
              navigation,
            ),
          );
        }
      });
  };
};
/*****************************/
