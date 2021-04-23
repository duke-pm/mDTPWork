/**
 ** Name: Master data
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
**/
/* TYPES */
import * as types from './types';

export const changeMasterAll = data => ({
  type: types.CHANGE_MASTER_ALL,
  payload: data
});
export const changeMasterRegions = regions => ({
  type: types.CHANGE_MASTER_REGIONS,
  payload: regions
});
export const changeMasterDepartments = departments => ({
  type: types.CHANGE_MASTER_DEPARTMENT,
  payload: departments
});
export const changeMasterEmployees = employees => ({
  type: types.CHANGE_MASTER_EMPLOYEES,
  payload: employees
});
export const changeMasterSuppliers = suppliers => ({
  type: types.CHANGE_MASTER_SUPPLIERS,
  payload: suppliers
});
export const changeMasterCompanys = companys => ({
  type: types.CHANGE_MASTER_COMPANYS,
  payload: companys
});
export const changeMasterAssetsType = assetsType => ({
  type: types.CHANGE_MASTER_ASSETSTYPE,
  payload: assetsType
});
export const changeMasterAssetsGroup = assetsGroup => ({
  type: types.CHANGE_MASTER_ASSETSGROUP,
  payload: assetsGroup
});
export const changeMasterAssetsGroupDetail = assetsGroupDetail => ({
  type: types.CHANGE_MASTER_ASSETSGROUPDETAIL,
  payload: assetsGroupDetail
});