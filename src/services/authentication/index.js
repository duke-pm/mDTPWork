/**
 ** Name: Authentication
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Authentication.js
 **/
/** API */
import jwtServiceConfig from '../jwtServiceConfig';
import Routes from '../routesApi';
import API from '../axios';

export default {
  login: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.AUTHENTICATION.LOGIN,
          params,
        )
        .then((response) => {
          console.log("FETCH USER LOGIN => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR USER LOGIN => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  refreshToken: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.AUTHENTICATION.REFRESH_TOKEN,
          params,
        )
        .then((response) => {
          console.log("FETCH REFRESH TOKEN => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR REFRESH TOKEN => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
