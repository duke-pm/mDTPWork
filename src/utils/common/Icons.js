import {IS_IOS} from '~/utils/helper';

/**
 ** Name: Icons for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Icons.js
 **/
const Icons = {
  // Authentication
  usernameAuth: 'person',
  passwordAuth: 'lock-closed',
  mailAuth: 'mail',

  // Approved modules
  assets: 'cellphone-link-outline', //config on admin site, pls don't edit here
  requestsOffer: 'clipboard-text-multiple-outline', //config on admin site, pls don't edit here
  requestsHandling: 'clipboard-check-multiple-outline', //config on admin site, pls don't edit here
  request: 'clipboard-outline',
  requestApproved_1: 'checkmark-outline',
  requestApproved_2: 'checkmark-done-outline',
  requestRejected: 'close-outline',
  dateRequest: 'calendar',
  departmentRequest: 'people',
  typeAsset: 'construct',
  priceAsset: 'pricetag',
  statusAsset: 'pulse',
  detailAsset: 'reader',

  // Projects management modules
  projects: 'chart-gantt-outline', //config on admin site, pls don't edit here
  comments: 'chatbubbles-outline',
  watchers: 'people-outline',
  detail: IS_IOS
    ? 'ellipsis-horizontal-circle-outline'
    : 'ellipsis-vertical-outline',
  listPreview: 'list-outline',
  showChild: 'return-down-forward-outline',
  hideChild: 'remove-circle-outline',
  exportExcel: 'document-attach-outline',
  alarm: 'alarm-outline',
  children: 'git-merge-outline',
  dateCreateProj: 'calendar',
  timeTask: 'time',
  userTask: 'person',
  userCircleTask: 'person-circle',
  mailTask: 'mail',
  jobTask: 'hammer',
  departmentTask: 'people',

  // Booking
  resource: 'location',
  userCreated: 'person',
  calendarBooking: 'calendar-outline',
  calendarBookingClear: 'calendar-clear-outline',
  listBooking: 'list-outline',
  addUser: 'person-add-outline',

  // Common
  barChart: 'stats-chart-outline',
  tags: 'pricetags-outline',
  filter: 'options-outline',
  remove: 'close-circle-outline',
  close: 'close-sharp',
  informations: 'information-circle',
  calendar: 'calendar',
  list: 'list-outline',
  search: 'search-outline',
  addNew: 'add-sharp',
  circle: 'ellipse-outline',
  square: 'square-outline',
  checkSquare: 'checkbox-outline',
  checkCircle: 'checkmark-circle-outline',
  doubleCheck: 'checkmark-done-outline',
  check: 'checkmark-sharp',
  noneCheck: 'add-outline',
  eye: 'eye',
  eyeOff: 'eye-off',
  alert: 'alert-circle',
  backAndroid: 'arrow-back-outline',
  backiOS: 'chevron-back-outline',
  camera: 'camera-outline',
  image: 'image-outline',
  next: 'chevron-forward-outline',
  down: 'chevron-down-outline',
  up: 'chevron-up-outline',
  successHappy: 'happy',
  failedSad: 'sad',
  lock: 'lock-closed-outline',
  mailUnread: 'mail-unread-outline',
  upload: 'cloud-upload-outline',
  download: 'download-outline',
  time: 'time-outline',
  mail: 'mail-outline',
  send: 'send-outline',
  userCircle: 'person-circle-outline',
  user: 'person-outline',
  phone: 'call-outline',
  login: 'log-in-outline',
  save: 'save-outline',
  nextStep: 'arrow-forward-outline',
  downStep: 'arrow-down-outline',
  downItem: 'chevron-down-circle-outline',
  upItem: 'chevron-up-circle-outline',
  dot: 'ellipse',
  readMore: 'arrow-down-circle-outline',
  readLess: 'arrow-up-circle-outline',
  flag: 'flag',
  reconnection: 'repeat-outline',
};

export default Icons;
