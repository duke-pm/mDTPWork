/**
 ** Name: JWT Services
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of JWTServices.js
**/
/* COMMON */
import Configs from "~/config";

const JWT_PROD_CONFIG = {
  URL: Configs.hostProduction,
  prefix: '/api',
  timeout: 30000,
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json'
  },
  responseType: "json",
  responseEncoding: "utf8",
};

const JWT_DEV_CONFIG = {
  URL: Configs.hostDevelopment,
  prefix: '/api',
  timeout: 30000,
  headers: {
    Accept: "application/json",
    'Content-Type': 'application/json'
  },
  responseType: "json",
  responseEncoding: "utf8",
};

const jwtServiceConfig =
  __DEV__ ? JWT_DEV_CONFIG : JWT_PROD_CONFIG;

export default jwtServiceConfig;
