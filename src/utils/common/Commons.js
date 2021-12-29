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

  STATUS_APPROVED: [
    {
      value: 1,
      label: 'approved_assets:status_wait',
      color: 'basic',
    },
    {
      value: 2,
      label: 'approved_assets:status_approved_done',
      color: 'warning',
    },
    {
      value: 3,
      label: 'approved_assets:status_approved_done',
      color: 'success',
    },
    {
      value: 4,
      label: 'approved_assets:status_reject',
      color: 'danger',
    },
  ],

  STATUS_PROJECT: [
    {
      value: 1,
      label: 'New',
      color: 'info',
    },
    {
      value: 2,
      label: 'To Be Schedule',
      color: 'warning',
    },
    {
      value: 3,
      label: 'Scheduled',
      color: 'success',
    },
    {
      value: 4,
      label: 'In Progress',
      color: 'primary',
    },
    {
      value: 5,
      label: 'Closed',
      color: 'basic',
    },
    {
      value: 6,
      label: 'On Hold',
      color: 'warning',
    },
    {
      value: 7,
      label: 'Rejected',
      color: 'danger',
    },
  ],

  STATUS_BOOKING: [
    {
      value: 1,
      label: 'Not happend',
      color: 'warning',
    },
    {
      value: 2,
      label: 'Happening',
      color: 'success',
    },
    {
      value: 3,
      label: 'Happend',
      color: 'basic',
    },
  ],

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
      color: 'success',
    },
    "H": {
      value: 'H',
      label: 'High',
      color: 'danger',
    },
    "N": {
      value: 'N',
      label: 'Normal',
      color: 'primary',
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
