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
});

export default function (state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case types.START_FETCH_MASTER_DATA:
      return state
        .set('submitting', true)
        .set('success', false)
        .set('error', false)
        .set('errorHelper', '');

    case types.ERROR_FETCH_MASTER_DATA:
      return state
        .set('submitting', false)
        .set('success', false)
        .set('error', true)
        .set('errorHelper', payload);

    case types.CHANGE_MASTER_ALL:
      let tmpRegions = payload.region
        ? payload.region
        : state.get('region');
      let tmpDepartments = payload.department
        ? payload.department
        : state.get('department');
      let tmpEmployees = payload.employees
        ? payload.employees
        : state.get('employees');
      let tmpSuppliers = payload.supplier
        ? payload.supplier
        : state.get('supplier');
      let tmpCompanys = payload.company
        ? payload.company
        : state.get('company');
      let tmpAssetsType = payload.assetType
        ? payload.assetType
        : state.get('assetsType');
      let tmpAssetsGroup = payload.assetGroup
        ? payload.assetGroup
        : state.get('assetGroup');
      let tmpAssetsGroupDetail = payload.assetGroupDetail
        ? payload.assetGroupDetail
        : state.get('assetGroupDetail');
      let tmpAssetsByUser = payload.assetByUser
        ? payload.assetByUser
        : state.get('assetByUser');
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

      /** prepare assetByUser */
      if (tmpAssetsByUser &&
        tmpAssetsByUser.length > 0 &&
        tmpAssetsByUser[0].hasOwnProperty('assetID')) {
        for (i = 0; i < tmpAssetsByUser.length; i++) {
          tmpAssetsByUser[i].value = tmpAssetsByUser[i]['assetID'];
          tmpAssetsByUser[i].label = tmpAssetsByUser[i]['assetName'];
        };
      }

      return state
        .set('submitting', false)
        .set('success', true)
        .set('error', false)
        .set('errorHelper', '')
        .set('region', tmpRegions)
        .set('department', tmpDepartments)
        .set('employees', tmpEmployees)
        .set('supplier', tmpSuppliers)
        .set('company', tmpCompanys)
        .set('assetType', tmpAssetsType)
        .set('assetGroup', tmpAssetsGroup)
        .set('assetGroupDetail', tmpAssetsGroupDetail)
        .set('assetByUser', tmpAssetsByUser);

    default:
      return state;
  }
};
