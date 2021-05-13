/**
 ** Name: Common reducers
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Common.js
 **/
/* LIBRARY */
import {fromJS} from 'immutable';

import * as types from '../actions/types';
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_FORMAT_DATE_1,
  DEFAULT_FORMAT_DATE_2,
  DEFAULT_FORMAT_DATE_3,
  DEFAULT_PER_PAGE,
  DEFAULT_THEME,
} from '~/config/constants';

export const initialState = fromJS({
  theme: DEFAULT_THEME,
  connection: true,
  language: DEFAULT_LANGUAGE_CODE,
  formatDate: DEFAULT_FORMAT_DATE_1,
  formatDateView: DEFAULT_FORMAT_DATE_2,
  formatDateCustom1: DEFAULT_FORMAT_DATE_3,
  perPage: DEFAULT_PER_PAGE,
  isSearch: false,
});

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.CHANGE_THEME:
      return state.set('theme', payload);

    case types.CHANGE_CONNECTION_STATUS:
      return state.set('connection', payload);

    case types.CHANGE_LANGUAGE:
      return state.set('language', payload);

    case types.CHANGE_FORMAT_DATE:
      return state.set('formatDate', payload);

    case types.CHANGE_FORMAT_DATE_VIEW:
      return state.set('formatDateView', payload);

    case types.CHANGE_FORMAT_DATE_CUSTOM1:
      return state.set('formatDateCustom1', payload);

    case types.CHANGE_PER_PAGE:
      return state.set('perPage', payload);

    case types.CHANGE_IS_SEARCH:
      return state.set('isSearch', payload);

    default:
      return state;
  }
}
