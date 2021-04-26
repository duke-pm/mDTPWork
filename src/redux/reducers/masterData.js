/**
 ** Name: Master data
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* LIBRARY */
import * as types from '../actions/types';

const initialState = {
  submitting: false,
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
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.START_FETCH_MASTER_DATA:
      return {
        ...state,
        submitting: true,
        error: false,
        errorHelper: '',
      };
    case types.ERROR_FETCH_MASTER_DATA:
      return {
        ...state,
        submitting: false,
        error: true,
        errorHelper: action.payload,
      };
    case types.CHANGE_MASTER_ALL:
      let tmpRegions = action.payload.region.length > 0
        ? action.payload.region
        : state.region;
      let tmpDepartments = action.payload.department.length > 0
        ? action.payload.department
        : state.department;
      let tmpEmployees = action.payload.employees.length > 0
        ? action.payload.employees
        : state.employees;
      let tmpSuppliers = action.payload.supplier.length > 0
        ? action.payload.supplier
        : state.supplier;
      let tmpCompanys = action.payload.company.length > 0
        ? action.payload.company
        : state.company;
      let tmpAssetsType = action.payload.assetType.length > 0
        ? action.payload.assetType
        : state.assetType;
      let tmpAssetsGroup = action.payload.assetGroup.length > 0
        ? action.payload.assetGroup
        : state.assetGroup;
      let tmpAssetsGroupDetail = action.payload.assetGroupDetail.length > 0
        ? action.payload.assetGroupDetail
        : state.assetGroupDetail;
      let i;

      /** prepare regions */
      if (tmpRegions &&
        tmpRegions.length > 0 &&
        tmpRegions[0].hasOwnProperty('regionCode')) {
        for (i = 0; i < tmpRegions.length; i++) {
          tmpRegions[i].value = tmpRegions[i]['regionCode'];
          tmpRegions[i].label = tmpRegions[i]['regionName'];
        };
      }

      /** prepare departments */
      if (tmpDepartments &&
        tmpDepartments.length > 0 &&
        tmpDepartments[0].hasOwnProperty('deptCode')) {
        for (i = 0; i < tmpDepartments.length; i++) {
          tmpDepartments[i].value = tmpDepartments[i]['deptCode'];
          tmpDepartments[i].label = tmpDepartments[i]['deptName'];
        };
      }

      /** prepare suppliers */
      if (tmpSuppliers &&
        tmpSuppliers.length > 0 &&
        tmpSuppliers[0].hasOwnProperty('supplierID')) {
        for (i = 0; i < tmpSuppliers.length; i++) {
          tmpSuppliers[i].value = tmpSuppliers[i]['supplierID'];
          tmpSuppliers[i].label = tmpSuppliers[i]['supplierName'];
        };
      }

      /** prepare companys */
      if (tmpCompanys &&
        tmpCompanys.length > 0 &&
        tmpCompanys[0].hasOwnProperty('cmpnID')) {
        for (i = 0; i < tmpCompanys.length; i++) {
          tmpCompanys[i].value = tmpCompanys[i]['cmpnID'];
          tmpCompanys[i].label = tmpCompanys[i]['cmpnName'];
        };
      }

      /** prepare assetsType */
      if (tmpAssetsType &&
        tmpAssetsType.length > 0 &&
        tmpAssetsType[0].hasOwnProperty('code')) {
        for (i = 0; i < tmpAssetsType.length; i++) {
          tmpAssetsType[i].value = tmpAssetsType[i]['code'];
          tmpAssetsType[i].label = tmpAssetsType[i]['typeName'];
        };
      }

      /** prepare assetGroup */
      if (tmpAssetsGroup &&
        tmpAssetsGroup.length > 0 &&
        tmpAssetsGroup[0].hasOwnProperty('groupCode')) {
        for (i = 0; i < tmpAssetsGroup.length; i++) {
          tmpAssetsGroup[i].value = tmpAssetsGroup[i]['groupCode'];
          tmpAssetsGroup[i].label = tmpAssetsGroup[i]['groupName'];
        };
      }

      /** prepare assetGroup */
      if (tmpAssetsGroupDetail &&
        tmpAssetsGroupDetail.length > 0 &&
        tmpAssetsGroupDetail[0].hasOwnProperty('itemCode')) {
        for (i = 0; i < tmpAssetsGroupDetail.length; i++) {
          tmpAssetsGroupDetail[i].value = tmpAssetsGroupDetail[i]['itemCode'];
          tmpAssetsGroupDetail[i].label = tmpAssetsGroupDetail[i]['itemName'];
        };
      }

      return {
        ...state,
        submitting: false,
        error: false,
        errorHelper: '',
        region: tmpRegions,
        department: tmpDepartments,
        employees: tmpEmployees,
        supplier: tmpSuppliers,
        company: tmpCompanys,
        assetType: tmpAssetsType,
        assetGroup: tmpAssetsGroup,
        assetGroupDetail: tmpAssetsGroupDetail,
      };

    default:
      return state;
  }
}
