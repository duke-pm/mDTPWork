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
  taskDetail: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('TaskID')) {
        tmpConfigs.params.TaskID = params.get('TaskID');
      }
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_DETAIL,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH TASK DETAIL => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR TASK DETAIL => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  taskComment: params => {
    return new Promise((resolve, reject) => {
      API.post(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_COMMENT,
        params,
      )
        .then(response => {
          console.log('FETCH TASK COMMENT => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR TASK COMMENT => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  taskWatcher: params => {
    return new Promise((resolve, reject) => {
      API.post(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_WATCHER,
        params,
      )
        .then(response => {
          console.log('FETCH TASK WATCHER => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR TASK WATCHER => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  taskUpdateStatus: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params.get('TaskID')) {
        tmpConfigs.params.TaskID = params.get('TaskID');
      }
      if (params.get('Lang')) {
        tmpConfigs.params.Lang = params.get('Lang');
      }
      if (params.get('StatusID')) {
        tmpConfigs.params.StatusID = params.get('StatusID');
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_STATUS,
        tmpConfigs,
      )
        .then(response => {
          console.log('FETCH TASK UPDATE STATUS => ', response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log('ERROR TASK UPDATE STATUS => ', error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
