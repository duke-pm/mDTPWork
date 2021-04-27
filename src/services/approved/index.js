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
  listRequest: (params) => {
    return new Promise((resolve, reject) => {
      let newURL = Routes.APPROVED.LIST_REQUEST + '?';
      if (params.get('StatusID')) newURL += 'StatusID=' + params.get('StatusID');
      if (params.get('FromDate')) newURL += 'FromDate=' + params.get('FromDate');
      if (params.get('ToDate')) newURL += 'ToDate=' + params.get('ToDate');
      if (params.get('PageSize')) newURL += 'PageSize=' + params.get('PageSize');
      if (params.get('PageNum')) newURL += 'PageNum=' + params.get('PageNum');
      if (params.get('Search')) newURL += 'Search=' + params.get('Search');

      axios
        .get(
          jwtServiceConfig.baseURL + newURL,
          Object.assign({}, jwtServiceConfig)
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
};
