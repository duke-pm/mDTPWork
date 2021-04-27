/**
 ** Name: Master data
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of master.js
 **/
import axios from 'axios';
/** API */
import jwtServiceConfig from '../jwtServiceConfig';
import Routes from '../routesApi';

export default {
  get: (params) => {
    return new Promise((resolve, reject) => {
      let configs = Object.assign({}, jwtServiceConfig);
      configs.params = params;

      axios
        .get(jwtServiceConfig.baseURL + Routes.MASTER_DATA.GET_ALL, configs)
        .then((response) => {
          console.log("FETCH MASTER DATA => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR MASTER DATA => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
