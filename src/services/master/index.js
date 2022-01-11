/**
 ** Name: Master data
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of master.js
 **/
/** COMMON */
import jwtServiceConfig from "../jwtServiceConfig";
import Routes from "../routesApi";
import API from "../axios";

export default {
  get: params => {
    return new Promise((resolve, reject) => {
      let configs = Object.assign({}, jwtServiceConfig);
      configs.params = params;

      API.get(jwtServiceConfig.baseURL + Routes.MASTER_DATA.GET_ALL, configs)
        .then(response => {
          console.log("FETCH MASTER DATA => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR MASTER DATA => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  getAssetsByUser: params => {
    return new Promise((resolve, reject) => {
      let configs = Object.assign({}, jwtServiceConfig);
      configs.params = params;

      API.get(
        jwtServiceConfig.baseURL + Routes.MASTER_DATA.GET_ASSETS_BY_USER,
        configs,
      )
        .then(response => {
          console.log("FETCH ASSETS BY USER => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR ASSETS BY USER => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
