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
    },
    WAIT: {
      value: 1,
      label: 'Wait',
    },
    APPROVED: {
      value: 2,
      label: 'Approved',
    },
    DONE: {
      value: 3,
      label: 'Done',
    },
    REJECT: {
      value: 4,
      label: 'Reject',
    },
  },

  STATUS_TASK: {
    NEW: {
      value: 1,
      label: 'New',
      color: 'statusNew',
    },
    TO_BE_SCHEDULE: {
      value: 2,
      label: 'To Be Schedule',
      color: 'stausToBeSchedule',
    },
    SCHEDULE: {
      value: 3,
      label: 'Scheduled',
      color: 'statusScheduled',
    },
    IN_PROGRESS: {
      value: 4,
      label: 'In Progress',
      color: 'statusInProgress',
    },
    CLOSED: {
      value: 5,
      label: 'Closed',
      color: 'statusClosed',
    },
    ON_HOLD: {
      value: 6,
      label: 'On Hold',
      color: 'statusOnHold',
    },
    REJECTED: {
      value: 7,
      label: 'Rejected',
      color: 'statusRejected',
    },
  },

  TYPE_TASK: {
    MILESTONE: {
      value: 3,
      label: 'type_task:milestone',
      color: 'typeMilestone',
    },
    PHASE: {
      value: 1,
      label: 'type_task:phase',
      color: 'typePhase',
    },
    TASK: {
      value: 2,
      label: 'type_task:task',
      color: 'typeTask',
    },
  },

  PRIORITY_TASK: {
    IMMEDIATE: {
      value: 'I',
      label: 'Immediate',
      color: 'pink',
    },
    HIGH: {
      value: 'H',
      label: 'High',
      color: 'red',
    },
    MEDIUM: {
      value: 'N',
      label: 'Normal',
      color: 'teal',
    },
    LOW: {
      value: 'L',
      label: 'Low',
      color: 'indigo',
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

  BOOKING_STATUS_HAPPEND: {
    NOT_HAPPEND: {
      value: 'Not happen',
      label: '',
      color: 'orange',
    },
    HAPPENNING: {
      value: 'Happenning',
      label: 'bookings:resume',
      color: 'green',
    },
    HAPPENED: {
      value: 'Happened',
      label: '',
      color: 'icon',
    },
  },
};

export default Commons;
