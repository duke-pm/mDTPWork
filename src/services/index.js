/**
 ** Name: Api
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Api.js
 **/
/** SERVICES */
import master from './master';
import approved from './approved';
import authentication from './authentication';

const Services = {
  authentication,
  master,
  approved,
};

export default Services;
