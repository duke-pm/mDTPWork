/**
 ** Name: JWT Services Config
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of JWTServiceConfig.js
**/
/* COMMON */
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

export default jwtServiceConfig;
