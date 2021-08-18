/**
 ** Name: Master data
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* LIBRARY */
import {fromJS} from 'immutable';
/** REDUX */
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
  users: [],
  projectStatus: [],
  projectSector: [],
  projectComponent: [],
  projectPriority: [],
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.RESET_STATUS_MASTER_DATA:
      return state
        .set('success', false)
        .set('error', false)
        .set('errorHelper', '');
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
      let tmpUsers = payload.users;
      if (tmpUsers && tmpUsers.length > 0) {
        tmpUsers.shift();
      }

      return state
        .set('submitting', false)
        .set('success', true)
        .set('error', false)
        .set('errorHelper', '')
        .set('region', payload.region || state.get('region'))
        .set('department', payload.department || state.get('department'))
        .set('employees', payload.employees || state.get('employees'))
        .set('supplier', payload.supplier || state.get('supplier'))
        .set('company', payload.company || state.get('company'))
        .set('assetType', payload.assetType || state.get('assetType'))
        .set('assetGroup', payload.assetGroup || state.get('assetGroup'))
        .set('users', tmpUsers || state.get('users'))
        .set(
          'assetGroupDetail',
          payload.assetGroupDetail || state.get('assetGroupDetail'),
        )
        .set('assetByUser', payload.assetByUser || [])
        .set(
          'projectStatus',
          payload.projectStatus || state.get('projectStatus'),
        )
        .set(
          'projectSector',
          payload.projectSector || state.get('projectSector'),
        )
        .set(
          'projectComponent',
          payload.projectComponent || state.get('projectComponent'),
        )
        .set(
          'projectPriority',
          payload.projectPriority || state.get('projectPriority'),
        );

    default:
      return state;
  }
}
