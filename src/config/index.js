/**
 ** Name: Configs for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of configs.js
 **/
import {LocaleConfig} from 'react-native-calendars';
import Config from 'react-native-config';
import moment from 'moment';
/** COMMON */
import {Assets} from '~/utils/asset';
import {colors} from '~/utils/style';
import {
  HOST_DEV,
  HOST_PROD,
  PREFIXES_IOS,
  PREFIXES_API,
  PREFIXES_ANDROID,
  PREFIXES_ANDROID_PROD,
} from './constants';

LocaleConfig.locales['en-SG'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thurday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

LocaleConfig.locales.vi = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Thg 1',
    'Thg 2',
    'Thg 3',
    'Thg 4',
    'Thg 5',
    'Thg 6',
    'Thg 7',
    'Thg 8',
    'Thg 9',
    'Thg 10',
    'Thg 11',
    'Thg 12',
  ],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'H', 'B', 'T', 'N', 'S', 'B'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

const Configs = {
  // for Host APIs
  hostAPI: Config.API_URL,
  prefixAPI: Config.API_PREFIX,
  // for deep liking
  prefixesDeepLink: [
    Config.ANDROID_DEEP_LINK, // for Android
    Config.IOS_DEEP_LINK, // for iOS
  ],
  routePath: {
    // Config params for route update new password
    ChangePassword: 'ChangePassword/:tokenData',
    // Config params for route Request Assets Detail
    AddRequestAsset: 'AddRequestAsset/:requestID',
    // Config params for route Request Lost Damage Detail
    AddRequestLostDamage: 'AddRequestLostDamage/:requestID',
    // Config params for route Project Detail
    ProjectDetail: 'ProjectDetail/:projectID',
    // Config params for route Task Detail
    TaskDetail: 'TaskDetail/:taskID',
  },
  // for name of app in account page
  nameOfApp: 'DTP-Education',
  // for rating app
  appStoreID: '12345678',
  googlePlayPackage: 'com.dtpwork',
  // for change password
  lengthNewPassword: 6,
  // for filter project
  numberYearToFilter: 10,
  perPageProjects: 25,
  perPageProjectOverview: 50,
  // for dev new feature
  salesVisit: false,
  toDay: moment(),
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
  colorsSubMenu: {
    main: [
      {
        colors: [colors.YELLOW, '#373B44'],
        bgColor: colors.BG_APPROVED,
      },
      {
        colors: [colors.BLUE, '#373B44'],
        bgColor: colors.BG_PROJECT,
      },
      {
        colors: [colors.GREEN, '#373B44'],
        bgColor: colors.BG_BOOKING,
      },
    ],
    approved: [
      {
        colors: [colors.YELLOW_2, '#373B44'],
        bgColor: colors.BG_APPROVED_ASSETS,
      },
      {
        colors: [colors.YELLOW_2, '#373B44'],
        bgColor: colors.BG_HANDLED_ASSETS,
      },
    ],
    project: [
      {
        colors: [colors.BLUE_2, '#373B44'],
        bgColor: colors.BG_PROJECT_M,
      },
      {
        colors: [colors.BLUE_2, '#373B44'],
        bgColor: colors.BG_PROJECT_O,
      },
    ],
    booking: [
      {
        colors: [colors.GREEN_2, '#373B44'],
        bgColor: colors.BG_BOOKINGS,
      },
      {
        colors: [colors.GREEN_2, '#373B44'],
        bgColor: colors.BG_MY_BOOKINGS,
      },
    ],
  },
};

export default Configs;
