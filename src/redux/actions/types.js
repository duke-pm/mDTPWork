/**
 ** Name: Types redux
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Types.js
 **/
/** COMMON */
export const CHANGE_CONNECTION_STATUS = '[COMMON] CHANGE_CONNECTION_STATUS';
export const CHANGE_LANGUAGE = '[COMMON] CHANGE_LANGUAGE';
export const CHANGE_FORMAT_DATE = '[COMMON] CHANGE_FORMAT_DATE';
export const CHANGE_FORMAT_DATE_VIEW = '[COMMON] CHANGE_FORMAT_DATE_VIEW';
export const CHANGE_FORMAT_DATE_CUSTOM1 = '[COMMON] CHANGE_FORMAT_DATE_CUSTOM1';
export const CHANGE_PER_PAGE = '[COMMON] CHANGE_PER_PAGE';
export const CHANGE_IS_SEARCH = '[COMMON] CHANGE_IS_SEARCH';
/** AUTH */
export const LOGOUT = '[AUTH] LOGOUT';
export const START_LOGIN = '[AUTH] START_LOGIN';
export const SUCCESS_LOGIN = '[AUTH] SUCCESS_LOGIN';
export const ERROR_LOGIN = '[AUTH] ERROR_LOGIN';
export const START_REFRESH_TOKEN = '[AUTH] START_REFRESH_TOKEN';
export const SUCCESS_REFRESH_TOKEN = '[AUTH] SUCCESS_REFRESH_TOKEN';
export const ERROR_REFRESH_TOKEN = '[AUTH] ERROR_REFRESH_TOKEN';
/** MASTER DATA */
export const START_FETCH_MASTER_DATA = '[MASTER] START_FETCH_MASTER_DATA';
export const ERROR_FETCH_MASTER_DATA = '[MASTER] ERROR_FETCH_MASTER_DATA';
export const START_FETCH_ASSET_BY_USER = '[MASTER] START_FETCH_ASSET_BY_USER';
export const ERROR_FETCH_ASSET_BY_USER = '[MASTER] ERROR_FETCH_ASSET_BY_USER';
export const CHANGE_MASTER_ALL = '[MASTER] CHANGE_MASTER_ALL';
export const CHANGE_MASTER_REGIONS = '[MASTER] CHANGE_MASTER_REGIONS';
export const CHANGE_MASTER_DEPARTMENT = '[MASTER] CHANGE_MASTER_DEPARTMENT';
export const CHANGE_MASTER_EMPLOYEES = '[MASTER] CHANGE_MASTER_EMPLOYEES';
export const CHANGE_MASTER_SUPPLIERS = '[MASTER] CHANGE_MASTER_SUPPLIERS';
export const CHANGE_MASTER_COMPANYS = '[MASTER] CHANGE_MASTER_COMPANYS';
export const CHANGE_MASTER_ASSETSTYPE = '[MASTER] CHANGE_MASTER_ASSETSTYPE';
export const CHANGE_MASTER_ASSETSGROUP = '[MASTER] CHANGE_MASTER_ASSETSGROUP';
export const CHANGE_MASTER_ASSETSGROUPDETAIL =
  '[MASTER] CHANGE_MASTER_ASSETSGROUPDETAIL';
export const CHANGE_MASTER_ASSET_BY_USER =
  '[MASTER] CHANGE_MASTER_ASSET_BY_USER';
/** APPROVED ASSETS */
export const START_FETCH_LIST_REQUEST_APPROVED =
  '[APPROVED] START_FETCH_LIST_REQUEST_APPROVED';
export const SUCCESS_FETCH_LIST_REQUEST_APPROVED =
  '[APPROVED] SUCCESS_FETCH_LIST_REQUEST_APPROVED';
export const ERROR_FETCH_LIST_REQUEST_APPROVED =
  '[APPROVED] ERROR_FETCH_LIST_REQUEST_APPROVED';
export const START_FETCH_ADD_REQUEST_APPROVED =
  '[APPROVED] START_FETCH_ADD_REQUEST_APPROVED';
export const SUCCESS_FETCH_ADD_REQUEST_APPROVED =
  '[APPROVED] SUCCESS_FETCH_ADD_REQUEST_APPROVED';
export const ERROR_FETCH_ADD_REQUEST_APPROVED =
  '[APPROVED] ERROR_FETCH_ADD_REQUEST_APPROVED';
export const START_FETCH_APPROVED_REQUEST =
  '[APPROVED] START_FETCH_APPROVED_REQUEST';
export const SUCCESS_FETCH_APPROVED_REQUEST =
  '[APPROVED] SUCCESS_FETCH_APPROVED_REQUEST';
export const ERROR_FETCH_APPROVED_REQUEST =
  '[APPROVED] ERROR_FETCH_APPROVED_REQUEST';
export const START_FETCH_REJECT_REQUEST =
  '[APPROVED] START_FETCH_REJECT_REQUEST';
export const SUCCESS_FETCH_REJECT_REQUEST =
  '[APPROVED] SUCCESS_FETCH_REJECT_REQUEST';
export const ERROR_FETCH_REJECT_REQUEST =
  '[APPROVED] ERROR_FETCH_REJECT_REQUEST';
/** APPROVED DAMAGED NAD DAMAGE */
export const START_FETCH_LIST_REQUEST_DAMAGE =
  '[APPROVED] START_FETCH_LIST_REQUEST_DAMAGE';
export const SUCCESS_FETCH_LIST_REQUEST_DAMAGE =
  '[APPROVED] SUCCESS_FETCH_LIST_REQUEST_DAMAGE';
export const ERROR_FETCH_LIST_REQUEST_DAMAGE =
  '[APPROVED] ERROR_FETCH_LIST_REQUEST_DAMAGE';
export const START_FETCH_LIST_REQUEST_LOST =
  '[APPROVED] START_FETCH_LIST_REQUEST_LOST';
export const SUCCESS_FETCH_LIST_REQUEST_LOST =
  '[APPROVED] SUCCESS_FETCH_LIST_REQUEST_LOST';
export const ERROR_FETCH_LIST_REQUEST_LOST =
  '[APPROVED] ERROR_FETCH_LIST_REQUEST_LOST';
export const START_FETCH_ADD_REQUEST_LOST =
  '[APPROVED] START_FETCH_ADD_REQUEST_LOST';
export const SUCCESS_FETCH_ADD_REQUEST_LOST =
  '[APPROVED] SUCCESS_FETCH_ADD_REQUEST_LOST';
export const ERROR_FETCH_ADD_REQUEST_LOST =
  '[APPROVED] ERROR_FETCH_ADD_REQUEST_LOST';
export const START_FETCH_APPROVED_LOST = '[APPROVED] START_FETCH_APPROVED_LOST';
export const SUCCESS_FETCH_APPROVED_LOST =
  '[APPROVED] SUCCESS_FETCH_APPROVED_LOST';
export const ERROR_FETCH_APPROVED_LOST = '[APPROVED] ERROR_FETCH_APPROVED_LOST';
export const START_FETCH_REJECT_LOST = '[APPROVED] START_FETCH_REJECT_LOST';
export const SUCCESS_FETCH_REJECT_LOST = '[APPROVED] SUCCESS_FETCH_REJECT_LOST';
export const ERROR_FETCH_REJECT_LOST = '[APPROVED] ERROR_FETCH_REJECT_LOST';
/** PROJECT MANAGEMENT */
export const START_FETCH_LIST_PROJECT = '[PROJECT] START_FETCH_LIST_PROJECT';
export const SUCCESS_FETCH_LIST_PROJECT =
  '[PROJECT] SUCCESS_FETCH_LIST_PROJECT';
export const ERROR_FETCH_LIST_PROJECT = '[PROJECT] ERROR_FETCH_LIST_PROJECT';
export const START_FETCH_LIST_TASK = '[PROJECT] START_FETCH_LIST_TASK';
export const SUCCESS_FETCH_LIST_TASK = '[PROJECT] SUCCESS_FETCH_LIST_TASK';
export const ERROR_FETCH_LIST_TASK = '[PROJECT] ERROR_FETCH_LIST_TASK';
