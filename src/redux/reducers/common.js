/**
 ** Name: Common reducers
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Common.js
 **/
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_THEME,
  DEFAULT_FORMAT_DATE_1,
  DEFAULT_FORMAT_DATE_2,
  DEFAULT_FORMAT_DATE_3,
  DEFAULT_PER_PAGE,
} from '~/configs/constants';
/** REDUX */
import * as types from '../actions/types';

export const initialState = {
  connection: true,
  language: DEFAULT_LANGUAGE_CODE,
  theme: DEFAULT_THEME,
  formatDate: DEFAULT_FORMAT_DATE_1,
  formatDateView: DEFAULT_FORMAT_DATE_2,
  formatDateCustom1: DEFAULT_FORMAT_DATE_3,
  perPage: DEFAULT_PER_PAGE,
};

export default function (state = initialState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.CHANGE_CONNECTION_STATUS:
      return {
        ...state,
        connection: payload,
      };

    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        language: payload,
      };

    case types.CHANGE_THEME:
      return {
        ...state,
        theme: payload,
      };

    case types.CHANGE_FORMAT_DATE:
      return {
        ...state,
        formatDate: payload,
      };

    case types.CHANGE_FORMAT_DATE_VIEW:
      return {
        ...state,
        formatDateView: payload,
      };

    case types.CHANGE_FORMAT_DATE_CUSTOM1:
      return {
        ...state,
        formatDateCustom1: payload,
      };

    case types.CHANGE_PER_PAGE:
      return {
        ...state,
        perPage: payload,
      };

    default:
      return state;
  }
}
