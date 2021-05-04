/**
 ** Name: Routes api
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of routesApi.js
 **/
const Routes = {
  AUTHENTICATION: {
    LOGIN: '/User/Login',
  },
  MASTER_DATA: {
    GET_ALL: '/MasterData/GetDataForForm',
  },
  APPROVED: {
    LIST_REQUEST: '/RQAsset/GetList',
    ADD_REQUEST: '/RQAsset/CreateAllocation',
  },
}

export default Routes;
