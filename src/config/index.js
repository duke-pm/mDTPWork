/**
 ** Name: Configs for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of configs.js
 **/
import {Assets} from '~/utils/asset';

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
  socialsNetwork: [
    // link socials network at account screen
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
