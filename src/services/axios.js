/**
 ** Name: Axios
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Axios.js
 **/
/** LIBRARY */
import axios from "axios";
/** COMMON */
import {jwtServiceConfig} from "./jwtServiceConfig";

const API = axios.create(jwtServiceConfig);

export default API;
