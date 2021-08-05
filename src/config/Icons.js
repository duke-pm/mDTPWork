import {IS_IOS} from '~/utils/helper';

/**
 ** Name: Icons for app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Icons.js
 **/
const Icons = {
  // Approved modules
  assets: 'cellphone-link', //config on admin site, pls don't edit here
  requestsOffer: 'clipboard-text-multiple', //config on admin site, pls don't edit here
  requestsHandling: 'clipboard-check-multiple', //config on admin site, pls don't edit here
  request: 'clipboard-outline',
  requestApproved_1: 'checkmark',
  requestApproved_2: 'checkmark-done',
  requestRejected: 'close',

  // Projects management modules
  projects: 'chart-gantt', //config on admin site, pls don't edit here
  comments: 'chatbubbles',
  watchers: 'people',
  detail: IS_IOS ? 'ellipsis-horizontal-circle-outline' : 'ellipsis-vertical',
  listPreview: 'list-outline',
  showChild: 'return-down-forward-outline',
  hideChild: 'remove-circle',
  exportExcel: 'document-attach-outline',
  alarm: 'alarm',

  // Common
  filter: 'filter',
  remove: 'close-circle',
  close: 'close-sharp',
  informations: 'information-circle',
  calendar: 'calendar',
  search: 'search',
  addNew: 'add-circle',
  circle: 'ellipse-outline',
  checkCircle: 'checkmark-circle',
  doubleCheck: 'checkmark-done',
  check: 'checkmark-sharp',
  noneCheck: 'add-outline',
  eye: 'eye',
  eyeOff: 'eye-off',
  alert: 'alert-circle',
  backAndroid: 'arrow-back',
  backiOS: 'chevron-back',
  camera: 'camera',
  image: 'image',
  next: 'chevron-forward',
  down: 'chevron-down',
  up: 'chevron-up',
  successHappy: 'happy',
  failedSad: 'sad',
  lock: 'lock-closed',
  mailUnread: 'mail-unread',
  upload: 'cloud-upload',
  download: 'download',
  time: 'time',
  mail: 'mail',
  send: 'send',
  userCircle: 'person-circle',
  login: 'log-in',
  save: 'save',
  nextStep: 'arrow-forward-outline',
  downItem: 'chevron-down-circle-outline',
  upItem: 'chevron-up-circle-outline',
  dot: 'ellipse',
  readMore: 'arrow-down-circle-outline',
  readLess: 'arrow-up-circle-outline',
};

export default Icons;
