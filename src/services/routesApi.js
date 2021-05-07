/**
 ** Name: Routes api
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of routesApi.js
 **/
const Routes = {
  AUTHENTICATION: {
    LOGIN: '/User/Login',
    REFRESH_TOKEN: '/User/RefreshToken',
  },
  MASTER_DATA: {
    GET_ALL: '/MasterData/GetDataForForm',
    GET_ASSETS_BY_USER: '/Assets/GetListByUser',
  },
  APPROVED: {
    LIST_REQUEST: '/RQAsset/GetList',
    ADD_REQUEST: '/RQAsset/CreateAllocation',
    ADD_REQUEST_LOST_DAMAGE: '/RQAsset/CreateHandling',
    APPROVED_REQUEST: '/RequestApprove/Approve',
    REJECT_REQUEST: '/RequestApprove/Approve',
  },
}

export default Routes;
