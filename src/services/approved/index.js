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
  listRequest: (params) => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = { params: {} };
      if (params.get('StatusID')) tmpConfigs.params['StatusID'] = params.get('StatusID');
      if (params.get('FromDate')) tmpConfigs.params['FromDate'] = params.get('FromDate');
      if (params.get('ToDate')) tmpConfigs.params['ToDate'] = params.get('ToDate');
      if (params.get('PageSize')) tmpConfigs.params['PageSize'] = params.get('PageSize');
      if (params.get('PageNum')) tmpConfigs.params['PageNum'] = params.get('PageNum');
      if (params.get('Search')) tmpConfigs.params['Search'] = params.get('Search');
      if (params.get('RequestTypeID'))
        tmpConfigs.params['RequestTypeID'] = params.get('RequestTypeID');
      if (params.get('IsResolveRequest'))
        tmpConfigs.params['IsResolveRequest'] = params.get('IsResolveRequest');

      API
        .get(
          jwtServiceConfig.baseURL + Routes.APPROVED.LIST_REQUEST,
          tmpConfigs
        )
        .then((response) => {
          console.log("FETCH LIST REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR LIST REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  addRequest: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.APPROVED.ADD_REQUEST,
          params,
        )
        .then((response) => {
          console.log("FETCH ADD REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR ADD REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  addRequestLostDamage: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.APPROVED.ADD_REQUEST_LOST_DAMAGE,
          params,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          console.log("FETCH ADD REQUEST LOST DAMAGE => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR ADD REQUEST LOST DAMAGE => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  approvedRequest: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.APPROVED.APPROVED_REQUEST,
          params,
        )
        .then((response) => {
          console.log("FETCH APPROVED REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR APPROVED REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  rejectRequest: (params) => {
    return new Promise((resolve, reject) => {
      API
        .post(
          jwtServiceConfig.baseURL + Routes.APPROVED.REJECT_REQUEST,
          params,
        )
        .then((response) => {
          console.log("FETCH REJECT REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch((error) => {
          console.log("ERROR REJECT REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
