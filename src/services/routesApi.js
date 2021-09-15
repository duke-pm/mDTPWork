/**
 ** Name: Routes api
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of routesApi.js
 **/
const Routes = {
  AUTHENTICATION: {
    LOGIN: '/User/Login',
    REFRESH_TOKEN: '/User/RefreshToken',
    CHANGE_PASSWORD: '/User/ChangePassword',
    FORGOT_PASSWORD: '/User/ForgotPassword',
    UPDATE_PASSWORD: '/User/UpdateNewPassword',
    CHECK_TOKEN_PASSWORD: '/User/CheckToken',
  },
  MASTER_DATA: {
    GET_ALL: '/MasterData/GetDataForForm',
    GET_ASSETS_BY_USER: '/Assets/GetListByUser',
  },
  APPROVED: {
    LIST_REQUEST: '/RQAsset/GetList',
    REQUEST_DETAIL: '/RQAsset/GetByID',
    ADD_REQUEST: '/RQAsset/CreateAllocation',
    ADD_REQUEST_LOST_DAMAGE: '/RQAsset/CreateHandling',
    APPROVED_REQUEST: '/RequestApprove/Approve',
    REJECT_REQUEST: '/RequestApprove/Approve',
  },
  PROJECT_MANAGEMENT: {
    LIST_PROJECT: '/Project/GetList',
    LIST_TASK: '/Task/GetList',
    TASK_DETAIL: '/Task/GetByID',
    TASK_UPDATE: '/Task/UpdateTaskInfo',
    TASK_COMMENT: '/TaskActivity/Modify',
    TASK_WATCHER: '/TaskWatcher/Modify',
    PROJECT_OVERVIEW: '/Project/GetListOverview',
  },
  BOOKING: {
    LIST_BOOKING: '/Booking/GetList',
    ADD_BOOKING: '/Booking/CreateBooking',
  },
};

export default Routes;
