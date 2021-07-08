/**
 ** Name: Common actions
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of Common.js
 **/
/* TYPES */
import * as types from './types';

export const changeLanguage = language => ({
  type: types.CHANGE_LANGUAGE,
  payload: language,
});

export const changeNetStatus = connection => ({
  type: types.CHANGE_CONNECTION_STATUS,
  payload: connection,
});

export const changeFormatDate = format => ({
  type: types.CHANGE_FORMAT_DATE,
  payload: format,
});

export const changeFormatDateView = format => ({
  type: types.CHANGE_FORMAT_DATE_VIEW,
  payload: format,
});

export const changeFormatDateCustom1 = format => ({
  type: types.CHANGE_FORMAT_DATE_CUSTOM1,
  payload: format,
});

export const changePerPage = perPage => ({
  type: types.CHANGE_PER_PAGE,
  payload: perPage,
});
