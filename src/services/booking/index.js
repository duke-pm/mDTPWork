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
      if (params["FromDate"]) {
        tmpConfigs.params.FromDate = params["FromDate"];
      }
      if (params["ToDate"]) {
        tmpConfigs.params.ToDate = params["ToDate"];
      }
      if (params["Search"]) {
        tmpConfigs.params.Search = params["Search"];
      }
      if (params["ResourceID"]) {
        tmpConfigs.params.ResourceID = params["ResourceID"];
      }
      if (params["IsMyBooking"]) {
        tmpConfigs.params.IsMyBooking = params["IsMyBooking"];
      } else {
        tmpConfigs.params.IsMyBooking = false;
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      } else {
        tmpConfigs.params.PageSize = 10;
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      } else {
        tmpConfigs.params.PageNum = 1;
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
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
      if (params["BookID"]) {
        tmpConfigs.params.BookID = params["BookID"];
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
      if (params["BookID"]) {
        tmpConfigs.params.BookID = params["BookID"];
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
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

  listBookingByResource: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["FromDate"]) {
        tmpConfigs.params.FromDate = params["FromDate"];
      }
      if (params["ToDate"]) {
        tmpConfigs.params.ToDate = params["ToDate"];
      }
      if (params["ResourceID"]) {
        tmpConfigs.params.ResourceID = params["ResourceID"];
      }
      if (params["StatusID"]) {
        tmpConfigs.params.StatusID = params["StatusID"];
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      } else {
        tmpConfigs.params.PageSize = -1;
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      } else {
        tmpConfigs.params.PageNum = 1;
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.BOOKING.BOOKING_RESOURCE,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH LIST BOOKING BY RESOURCE => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR LIST BOOKING BY RESOURCE => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
