/**
 ** Name: Configs for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of configs.js
 **/
import {Assets} from '~/utils/asset';

const HOST_DEV = 'http://api.dtpeducation.com';
const HOST_PROD = 'http://api.dtp-education.com';
const PREFIXES_IOS = 'mdtpwork://';

const Configs = {
  // for Host APIs
  hostDevelopment: HOST_DEV,
  hostProduction: HOST_PROD,
  prefixApi: 'api',
  // for deep liking
  prefixesDev: [
    HOST_DEV, // for Android
    PREFIXES_IOS, // for iOS
  ],
  prefixesProd: [
    HOST_PROD, // for Android
    PREFIXES_IOS, // for iOS
  ],
  routePath: {
    ChangePassword: 'ChangePassword/:tokenData', // Config params for route update new password
    ProjectDetail: 'ProjectDetail/:projectID', // Config params for route Project Detail
    TaskDetail: 'TaskDetail/:taskID', // Config params for route Task Detail
  },
  // for name of app in account page
  nameOfApp: '2021 DTP-Education',
  // for rating app
  appStoreID: '12345678',
  googlePlayPackage: 'com.dtpwork',
  // for change password
  lengthNewPassword: 6,
  // for filter project
  numberYearToFilter: 10,
  perPageProjects: 25,
  // for dev new feature
  salesVisit: false,
  // for link to socials
  socialsNetwork: [
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Assets.imgFacebook,
      url: 'https://www.facebook.com/daitruongphat.education',
    },
    {
      id: 'youtube',
      label: 'Youtube',
      icon: Assets.imgYoutube,
      url: 'https://www.youtube.com/channel/UCPirvav1R6BC2WQoEyBy0PQ',
    },
  ],
};

export default Configs;
