/**
 ** Name: Common
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Common.js
 **/
const Commons = {
  SCHEMA_DROPDOWN: {
    DEPARTMENT: {
      label: 'deptName',
      value: 'deptCode',
      icon: 'icon',
      hidden: 'hidden',
    },
    REGION: {
      label: 'regionName',
      value: 'regionCode',
      icon: 'icon',
      hidden: 'hidden',
    },
    COMPANY: {
      label: 'cmpnName',
      value: 'cmpnID',
      icon: 'icon',
      hidden: 'hidden',
    },
    ASSETS_OF_USER: {
      label: 'assetName',
      value: 'assetID',
      icon: 'icon',
      hidden: 'hidden',
    },
  },

  APPROVED_TYPE: {
    ASSETS: {
      value: 1,
      label: 'add',
    },
    DAMAGED: {
      value: 2,
      label: 'damaged',
    },
    LOST: {
      value: 3,
      label: 'lost',
    },
  },

  STATUS_REQUEST: {
    ALL: {
      value: 0,
      label: 'All',
      color: '',
      bgColor: '',
    },
    WAIT: {
      value: 1,
      label: 'Wait',
      color: 'orange',
      bgColor: 'rgba(246,153,63,0.2)',
    },
    APPROVED: {
      value: 2,
      label: 'Approved',
      color: 'blue',
      bgColor: 'rgba(10,132,255, 0.2)',
    },
    DONE: {
      value: 3,
      label: 'Done',
      color: 'green',
      bgColor: 'rgba(50,215,75, 0.2)',
    },
    REJECT: {
      value: 4,
      label: 'Reject',
      color: 'red',
      bgColor: 'rgba(227,52,47,0.2)',
    },
  },

  STATUS_TASK: {
    "1": {
      value: 1,
      label: 'New',
      color: 'info',
    },
    "2": {
      value: 2,
      label: 'To Be Schedule',
      color: 'warning',
    },
    "3": {
      value: 3,
      label: 'Scheduled',
      color: 'success',
    },
    "4": {
      value: 4,
      label: 'In Progress',
      color: 'primary',
    },
    "5": {
      value: 5,
      label: 'Closed',
      color: 'basic',
    },
    "6": {
      value: 6,
      label: 'On Hold',
      color: 'warning',
    },
    "7": {
      value: 7,
      label: 'Rejected',
      color: 'danger',
    },
  },

  TYPE_TASK: {
    MILESTONE: {
      value: 3,
      label: 'type_task:milestone',
      color: 'success',
    },
    PHASE: {
      value: 1,
      label: 'type_task:phase',
      color: 'warning',
    },
    TASK: {
      value: 2,
      label: 'type_task:task',
      color: 'primary',
    },
  },

  PRIORITY_TASK: {
    "I": {
      value: 'I',
      label: 'Immediate',
      color: 'primary',
    },
    "H": {
      value: 'H',
      label: 'High',
      color: 'danger',
    },
    "N": {
      value: 'N',
      label: 'Normal',
      color: 'success',
    },
    "L": {
      value: 'L',
      label: 'Low',
      color: 'warning',
    },
  },

  TYPE_SHOW_BOOKING: {
    CALENDAR: {
      value: 'typeCalendar',
      label: 'Calendar',
      icon: 'calendar',
    },
    LIST: {
      value: 'typeList',
      label: 'List',
      icon: 'list',
    },
  },

  BOOKING_STATUS: {
    NOT_HAPPEND: {
      value: 1,
      color: 'statusOnHold',
      bgColor: 'rgba(246,153,63,0.2)',
    },
    HAPPENNING: {
      value: 2,
      color: 'green',
      bgColor: 'rgba(50,215,75, 0.2)',
    },
    HAPPENED: {
      value: 3,
      color: 'statusClosed',
      bgColor: 'rgba(160,174,192,0.2)',
    },
  },
};

export default Commons;
