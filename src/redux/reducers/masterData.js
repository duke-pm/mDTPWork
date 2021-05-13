/**
 ** Name: Master data
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* LIBRARY */
import {fromJS, List} from 'immutable';
import * as types from '../actions/types';

export const initialState = fromJS({
  submitting: false,
  success: false,
  error: false,
  errorHelper: '',

  region: List(),
  department: List(),
  employees: List(),
  supplier: List(),
  company: List(),
  assetType: List(),
  assetGroup: List(),
  assetGroupDetail: List(),
  assetByUser: List(),
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
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
        .set(
          'assetGroupDetail',
          payload.assetGroupDetail || state.get('assetGroupDetail'),
        )
        .set('assetByUser', payload.assetByUser || List());

    default:
      return state;
  }
}
