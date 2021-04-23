/**
 ** Name: Master data
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of master.js
 **/
/** API */
import Api from '../api';
import Routes from '../routesApi';

export default {
  get: async (params) => {
    try {
      let newURL = Routes.MASTER_DATA + '?ListType=' + params;
      let results = Api.get(newURL);
      return results;
    } catch (error) {
      console.log('ERROR API: ', error);
      return error;
    }
  },
};
