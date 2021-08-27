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
          return dispatch(listBookingSuccess(res.data));
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
