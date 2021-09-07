/**
 ** Name: Axios
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Axios.js
 **/
/** LIBRARY */
import axios from 'axios';
/** COMMON */
import Configs from '~/config';

const jwtServiceConfig = {
  baseURL: Configs.hostAPI + '/' + Configs.prefixAPI,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
  responseType: 'json',
  responseEncoding: 'utf8',
};

const API = axios.create(jwtServiceConfig);

export default API;
