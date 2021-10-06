/**
 ** Name: Booking
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Booking.js
 **/
/** COMMON */
import jwtServiceConfig from '../jwtServiceConfig';
import Routes from '../routesApi';
import API from '../axios';

export default {
  listBooking: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('FromDate')) {
        tmpConfigs.params.FromDate = params.get('FromDate');
      }
      if (params.get('ToDate')) {
        tmpConfigs.params.ToDate = params.get('ToDate');
      }
      if (params.get('Search')) {
        console.log('[LOG] === Search ===> ', params.get('Search'));
        tmpConfigs.params.Search = params.get('Search');
      }
      if (params.get('IsMyBooking')) {
        tmpConfigs.params.IsMyBooking = params.get('IsMyBooking');
      } else {
        tmpConfigs.params.IsMyBooking = false;
      }
      if (params.get('PageSize')) {
        tmpConfigs.params.PageSize = params.get('PageSize');
      } else {
        tmpConfigs.params.PageSize = 10;
      }
      if (params.get('PageNum')) {
        tmpConfigs.params.PageNum = params.get('PageNum');
      } else {
        tmpConfigs.params.PageSize = 1;
      }
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.BOOKING.LIST_BOOKING,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH LIST BOOKING => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR LIST BOOKING => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  addBooking: params => {
    return new Promise((resolve, reject) => {
      API.put(jwtServiceConfig.baseURL + Routes.BOOKING.ADD_BOOKING, params)
        .then(response => {
          console.log('FETCH ADD/UPDATE BOOKING => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR ADD/UPDATE BOOKING => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  removeBooking: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('BookID')) {
        tmpConfigs.params.BookID = params.get('BookID');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.BOOKING.REMOVE_BOOKING,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH REMOVE BOOKING => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR REMOVE BOOKING => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  bookingDetail: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('BookID')) {
        tmpConfigs.params.BookID = params.get('BookID');
      }
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.BOOKING.BOOKING_DETAIL,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH BOOKING DETAIL => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR BOOKING DETAIL => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
