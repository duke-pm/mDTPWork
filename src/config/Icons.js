import {IS_IOS} from '~/utils/helper';

/**
 ** Name: Icons for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Icons.js
 **/
const Icons = {
  // Approved modules
  assets: 'cellphone-link-outline', //config on admin site, pls don't edit here
  requestsOffer: 'clipboard-text-multiple-outline', //config on admin site, pls don't edit here
  requestsHandling: 'clipboard-check-multiple-outline', //config on admin site, pls don't edit here
  request: 'clipboard-outline',
  requestApproved_1: 'checkmark-outline',
  requestApproved_2: 'checkmark-done-outline',
  requestRejected: 'close-outline',

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

  // Common
  filter: 'filter-outline',
  remove: 'close-circle',
  close: 'close-sharp',
  informations: 'information-circle',
  calendar: 'calendar-outline',
  search: 'search-outline',
  addNew: 'add-circle-outline',
  circle: 'ellipse-outline',
  checkCircle: 'checkmark-circle-outline',
  doubleCheck: 'checkmark-done-outline',
  check: 'checkmark-sharp',
  noneCheck: 'add-outline',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  alert: 'alert-circle-outline',
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
  downItem: 'chevron-down-circle-outline',
  upItem: 'chevron-up-circle-outline',
  dot: 'ellipse',
  readMore: 'arrow-down-circle-outline',
  readLess: 'arrow-up-circle-outline',
  flag: 'flag',
};

export default Icons;
