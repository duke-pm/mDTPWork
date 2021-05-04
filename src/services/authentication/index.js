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
          Object.assign({}, jwtServiceConfig),
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
};
