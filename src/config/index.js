/**
 ** Name: Configs for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of configs.js
 **/
import {Assets} from '~/utils/asset';
import {
  HOST_DEV,
  HOST_PROD,
  PREFIXES_IOS,
  PREFIXES_API,
  PREFIXES_ANDROID,
  PREFIXES_ANDROID_PROD,
} from './constants';

const Configs = {
  // for Host APIs
  hostDevelopment: HOST_DEV,
  hostProduction: HOST_PROD,
  prefixApi: PREFIXES_API,
  // for deep liking
  prefixesDev: [
    PREFIXES_ANDROID, // for Android
    PREFIXES_IOS, // for iOS
  ],
  prefixesProd: [
    PREFIXES_ANDROID_PROD, // for Android
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
  // for alarm in android platform
  alarmsAndroid: [
    {
      value: 5,
      label: 'project_management:five_minutes',
    },
    {
      value: 10,
      label: 'project_management:ten_minutes',
    },
    {
      value: 15,
      label: 'project_management:fifteen_minutes',
    },
    {
      value: 30,
      label: 'project_management:thirty_minutes',
    },
    {
      value: 60,
      label: 'project_management:sixty_minutes',
    },
    {
      value: 1440,
      label: 'project_management:one_day',
    },
    {
      value: 10080,
      label: 'project_management:one_week',
    },
  ],
};

export default Configs;
