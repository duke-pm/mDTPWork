/**
 ** Name: Master data
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* LIBRARY */
import { fromJS } from 'immutable';
import * as types from '../actions/types';

export const initialState = fromJS({
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
});

export default function (state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case types.START_FETCH_MASTER_DATA:
      return state
        .set('submitting', true)
        .set('error', false)
        .set('errorHelper', '');

    case types.ERROR_FETCH_MASTER_DATA:
      return state
        .set('submitting', false)
        .set('error', true)
        .set('errorHelper', payload);

    case types.CHANGE_MASTER_ALL:
      let tmpRegions = payload.region.length > 0
        ? payload.region
        : state.get('region');
      let tmpDepartments = payload.department.length > 0
        ? payload.department
        : state.get('department');
      let tmpEmployees = payload.employees.length > 0
        ? payload.employees
        : state.get('employees');
      let tmpSuppliers = payload.supplier.length > 0
        ? payload.supplier
        : state.get('supplier');
      let tmpCompanys = payload.company.length > 0
        ? payload.company
        : state.get('company');
      let tmpAssetsType = payload.assetType.length > 0
        ? payload.assetType
        : state.get('assetsType');
      let tmpAssetsGroup = payload.assetGroup.length > 0
        ? payload.assetGroup
        : state.get('assetGroup');
      let tmpAssetsGroupDetail = payload.assetGroupDetail.length > 0
        ? payload.assetGroupDetail
        : state.get('assetGroupDetail');
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

      return state
        .set('submitting', false)
        .set('error', false)
        .set('errorHelper', '')
        .set('region', tmpRegions)
        .set('department', tmpDepartments)
        .set('employees', tmpEmployees)
        .set('supplier', tmpSuppliers)
        .set('company', tmpCompanys)
        .set('assetType', tmpAssetsType)
        .set('assetGroup', tmpAssetsGroup)
        .set('assetGroupDetail', tmpAssetsGroupDetail);

    default:
      return state;
  }
};
