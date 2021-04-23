/**
 ** Name: Master data
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* LIBRARY */
import * as types from '../actions/types';

const initialState = {
  regions: [],
  departments: [],
  employees: [],
  suppliers: [],
  companys: [],
  assetsType: [],
  assetsGroup: [],
  assetsGroupDetail: [],
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_MASTER_ALL:
      return {
        regions: action.payload.regions,
        departments: action.payload.departments,
        employees: action.payload.employees,
        suppliers: action.payload.suppliers,
        companys: action.payload.companys,
        assetsType: action.payload.assetsType,
        assetsGroup: action.payload.assetsGroup,
        assetsGroupDetail: action.payload.assetsGroupDetail,
      };

    case types.CHANGE_MASTER_REGIONS:
      return {
        ...state,
        regions: action.payload,
      };

    case types.CHANGE_MASTER_DEPARTMENT:
      return {
        ...state,
        departments: action.payload,
      };

    case types.CHANGE_MASTER_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
      };

    case types.CHANGE_MASTER_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
      };

    case types.CHANGE_MASTER_COMPANYS:
      return {
        ...state,
        companys: action.payload,
      };

    case types.CHANGE_MASTER_ASSETSTYPE:
      return {
        ...state,
        assetsType: action.payload,
      };

    case types.CHANGE_MASTER_ASSETSGROUP:
      return {
        ...state,
        assetsGroup: action.payload,
      };

    case types.CHANGE_MASTER_ASSETSGROUPDETAIL:
      return {
        ...state,
        assetsGroupDetail: action.payload,
      };

    default:
      return state;
  }
}
