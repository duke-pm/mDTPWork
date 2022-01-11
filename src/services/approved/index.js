/**
 ** Name: Approved
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of approved.js
 **/
/** COMMON */
import jwtServiceConfig from "../jwtServiceConfig";
import Routes from "../routesApi";
import API from "../axios";

export default {
  listRequest: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["StatusID"]) {
        tmpConfigs.params.StatusID = params["StatusID"];
      }
      if (params["FromDate"]) {
        tmpConfigs.params.FromDate = params["FromDate"];
      }
      if (params["ToDate"]) {
        tmpConfigs.params.ToDate = params["ToDate"];
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      }
      if (params["Search"]) {
        tmpConfigs.params.Search = params["Search"];
      }
      if (params["RequestTypeID"]) {
        tmpConfigs.params.RequestTypeID = params["RequestTypeID"];
      }
      if (params["IsResolveRequest"]) {
        tmpConfigs.params.IsResolveRequest = params["IsResolveRequest"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.APPROVED.LIST_REQUEST,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH LIST REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR LIST REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  requestDetail: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["RequestID"]) {
        tmpConfigs.params.RequestID = params["RequestID"];
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.APPROVED.REQUEST_DETAIL,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH REQUEST APPROVED DETAIL => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR REQUEST APPROVED DETAIL => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  addRequest: params => {
    return new Promise((resolve, reject) => {
      API.post(jwtServiceConfig.baseURL + Routes.APPROVED.ADD_REQUEST, params)
        .then(response => {
          console.log("FETCH ADD REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR ADD REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  addRequestLostDamage: params => {
    return new Promise((resolve, reject) => {
      API.post(
        jwtServiceConfig.baseURL + Routes.APPROVED.ADD_REQUEST_LOST_DAMAGE,
        params,
        {headers: {"Content-Type": "multipart/form-data"}},
      )
        .then(response => {
          console.log("FETCH ADD REQUEST LOST DAMAGE => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR ADD REQUEST LOST DAMAGE => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  approvedRequest: params => {
    return new Promise((resolve, reject) => {
      API.post(
        jwtServiceConfig.baseURL + Routes.APPROVED.APPROVED_REQUEST,
        params,
      )
        .then(response => {
          console.log("FETCH APPROVED REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR APPROVED REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },

  rejectRequest: params => {
    return new Promise((resolve, reject) => {
      API.post(
        jwtServiceConfig.baseURL + Routes.APPROVED.REJECT_REQUEST,
        params,
      )
        .then(response => {
          console.log("FETCH REJECT REQUEST => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR REJECT REQUEST => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
