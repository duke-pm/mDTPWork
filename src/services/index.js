/**
 ** Name: Api
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Api.js
 **/
/** COMMON */
import master from "./master";
import authentication from "./authentication";
import approved from "./approved";
import projectManagement from "./projectManagement";
import booking from "./booking";

const Services = {
  authentication,
  master,
  approved,
  projectManagement,
  booking,
};

export default Services;
