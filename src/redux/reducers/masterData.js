/**
 ** Name: Master data
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/** REDUX */
import * as types from '../actions/types';

export const initialState = {
  submitting: false,
  success: false,
  error: false,
  errorHelper: '',

  region: [],
  department: [],
  employees: [],
  supplier: [],
  company: [],
  assetType: [],
  assetGroup: [],
  assetGroupDetail: [],
  assetByUser: [],
  users: [],
  projectStatus: [],
  projectSector: [],
  projectComponent: [],
  projectPriority: [],
  bkColor: [],
  bkReSource: [],
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_STATUS_MASTER_DATA:
      return {
        ...state,
        success: false,
        error: false,
        errorHelper: "",
      };

    case types.START_FETCH_MASTER_DATA:
      return {
        ...state,
        submitting: true,
        success: false,
        error: false,
        errorHelper: "",
      };

    case types.ERROR_FETCH_MASTER_DATA:
      return {
        ...state,
        submitting: false,
        success: false,
        error: true,
        errorHelper: payload,
      };

    case types.CHANGE_MASTER_ALL:
      let tmpUsers = payload.users;
      if (tmpUsers && tmpUsers.length > 0) {
        tmpUsers.shift();
      }

      return {
        ...state,
        submitting: false,
        success: true,
        error: false,
        errorHelper: "",
        region: payload.region || state["region"],
        department: payload.department || state["department"],
        employees: payload.employees || state["employees"],
        supplier: payload.supplier || state["supplier"],
        company: payload.company || state["company"],
        assetType: payload.assetType || state["assetType"],
        assetGroup: payload.assetGroup || state["assetGroup"],
        users: tmpUsers || state["users"],
        assetByUser: payload.assetByUser || [],
        assetGroupDetail: payload.assetGroupDetail || state["assetGroupDetail"],
        projectStatus: payload.projectStatus || state["projectStatus"],
        projectSector: payload.projectSector || state["projectSector"],
        projectComponent: payload.projectComponent || state["projectComponent"],
        projectPriority: payload.projectPriority || state["projectPriority"],
        bookingResource: payload.bookingResource || state["bookingResource"],
        bkColor: payload.bkColor || state["bkColor"],
        bkReSource: payload.bkReSource || state["bkReSource"],
      };

    default:
      return state;
  }
}
