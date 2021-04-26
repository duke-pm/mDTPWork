/**
 ** Name: Approved
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of approved.js
 **/
import axios from 'axios';
/** API */
import jwtServiceConfig from '../jwtServiceConfig';
import Routes from '../routesApi';

export default {
  addRequest: (params) => {
    return new Promise((resolve, reject) => {
      let configs = Object.assign({}, jwtServiceConfig);

      axios
        .post(
          jwtServiceConfig.baseURL + Routes.APPROVED.ADD_REQUEST,
          params,
          Object.assign({}, jwtServiceConfig)
        )
        .then((response) => {
          console.log("FETCH ADD REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          console.log("ERROR FETCH ADD REQUEST => ", error);
          reject(error.response ? error.response.data : null);
        });
    });
  },
};
