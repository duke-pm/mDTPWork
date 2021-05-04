/**
 ** Name: Axios 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Axios.js
 **/
import axios from 'axios';
/** COMMON */
import Configs from "~/config";

const JWT_PROD_CONFIG = {
  baseURL: Configs.hostProduction + '/api',
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  responseType: "json",
  responseEncoding: "utf8",
};

const JWT_DEV_CONFIG = {
  baseURL: Configs.hostDevelopment + '/api',
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  responseType: "json",
  responseEncoding: "utf8",
};

const jwtServiceConfig =
  __DEV__ ? JWT_DEV_CONFIG : JWT_PROD_CONFIG;

const API = axios.create(jwtServiceConfig);

export default API;