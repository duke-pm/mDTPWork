/**
 ** Name: Configs for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of configs.js
 **/
const Configs = {
  hostDevelopment: 'http://api.dtp-education.com',
  hostProduction: 'http://api.dtp-education.com',
  appStoreID: '12345678',
  googlePlayPackage: 'com.mdtpwork',
  lengthNewPassword: 6,
  salesVisit: false,
  prefixes: [
    'http://dtpwork.dtp-education.com', // deep linking for Android
    'mdtpwork://', // deep linking for iOS
  ],
  routePath: {
    ProjectDetail: 'ProjectDetail/:projectID', // Config params for route Project Detail
    TaskDetail: 'TaskDetail/:taskID', // Config params for route Task Detail
  },
};

export default Configs;
