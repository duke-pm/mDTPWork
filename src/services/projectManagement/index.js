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
  listProject: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["ProjectID"]) {
        tmpConfigs.params.PrjParentID = params["ProjectID"];
      }
      if (params["StatusID"]) {
        tmpConfigs.params.StatusID = params["StatusID"];
      }
      if (params["OwnerID"]) {
        tmpConfigs.params.OwnerID = params["OwnerID"];
      }
      if (params["Year"]) {
        tmpConfigs.params.Year = params["Year"];
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      } else {
        tmpConfigs.params.PageSize = 25;
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      } else {
        tmpConfigs.params.PageSize = 1;
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }
      if (params["Search"]) {
        tmpConfigs.params.Search = params["Search"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.LIST_PROJECT,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH LIST PROJECT => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR LIST PROJECT => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  listTask: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["TaskParentID"]) {
        tmpConfigs.params.TaskParentID = params["TaskParentID"];
      }
      if (params["PrjID"]) {
        tmpConfigs.params.PrjID = params["PrjID"];
      }
      if (params["StatusID"]) {
        tmpConfigs.params.StatusID = params["StatusID"];
      }
      if (params["OwnerID"]) {
        tmpConfigs.params.OwnerID = params["OwnerID"];
      }
      if (params["SectorID"]) {
        tmpConfigs.params.SectorID = params["SectorID"];
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      } else {
        tmpConfigs.params.PageSize = 25;
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      } else {
        tmpConfigs.params.PageSize = 1;
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }
      if (params["Search"]) {
        tmpConfigs.params.Search = params["Search"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.LIST_TASK,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH LIST TASK => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR LIST TASK => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  taskDetail: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["TaskID"]) {
        tmpConfigs.params.TaskID = params["TaskID"];
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_DETAIL,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH TASK DETAIL => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR TASK DETAIL => ", error);
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
          console.log("FETCH TASK COMMENT => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR TASK COMMENT => ", error);
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
          console.log("FETCH TASK WATCHER => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR TASK WATCHER => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  taskUpdate: params => {
    return new Promise((resolve, reject) => {
      API.put(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.TASK_UPDATE,
        params,
      )
        .then(response => {
          console.log("FETCH TASK UPDATE => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR TASK UPDATE => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
  projectOverview: params => {
    return new Promise((resolve, reject) => {
      let tmpConfigs = {params: {}};
      if (params["Year"]) {
        tmpConfigs.params.Year = params["Year"];
      }
      if (params["FromDate"]) {
        tmpConfigs.params.FromDate = params["FromDate"];
      }
      if (params["ToDate"]) {
        tmpConfigs.params.ToDate = params["ToDate"];
      }
      if ( params["OwnerID"]) {
        tmpConfigs.params.OwnerID = params["OwnerID"];
      }
      if (params["SectorID"]) {
        tmpConfigs.params.SectorID = params["SectorID"];
      }
      if (params["StatusID"]) {
        tmpConfigs.params.StatusID = params["StatusID"];
      }
      if (params["PageSize"]) {
        tmpConfigs.params.PageSize = params["PageSize"];
      } else {
        tmpConfigs.params.PageSize = 25;
      }
      if (params["PageNum"]) {
        tmpConfigs.params.PageNum = params["PageNum"];
      } else {
        tmpConfigs.params.PageSize = 1;
      }
      if (params["Lang"]) {
        tmpConfigs.params.Lang = params["Lang"];
      }

      API.get(
        jwtServiceConfig.baseURL + Routes.PROJECT_MANAGEMENT.PROJECT_OVERVIEW,
        tmpConfigs,
      )
        .then(response => {
          console.log("FETCH PROJECT OVERVIEW => ", response);
          if (response.status === 200 && response.data) {
            resolve(response.data);
          } else {
            reject(response.statusText);
          }
        })
        .catch(error => {
          console.log("ERROR PROJECT OVERVIEW => ", error);
          reject(error.response ? error.response.data : error);
        });
    });
  },
};
