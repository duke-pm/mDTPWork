/**
 ** Name: Approved
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of approved.js
 **/
import jwtServiceConfig from '../jwtServiceConfig';
import Routes from '../routesApi';
import API from '../axios';

export default {
  listProject: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }
      if (params.get('Search')) {
        tmpConfigs.params.Search = params.get('Search');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.LIST_PROJECT,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH LIST PROJECT => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR LIST PROJECT => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  listTask: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('PrjID')) {
        tmpConfigs.params.PrjID = params.get('PrjID');
      }
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }
      if (params.get('Search')) {
        tmpConfigs.params.Search = params.get('Search');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.LIST_TASK,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH LIST TASK => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR LIST TASK => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
