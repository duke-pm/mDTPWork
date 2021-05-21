/**
 ** Name: Common
 ** Author:
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
      code: 1,
      name: 'add',
    },
    DAMAGED: {
      code: 2,
      name: 'damage',
    },
    LOST: {
      code: 3,
      name: 'lost',
    },
  },

  STATUS_REQUEST: {
    ALL: {
      code: 0,
    },
    WAIT: {
      code: 1,
    },
    APPROVED: {
      code: 2,
    },
    DONE: {
      code: 3,
    },
    REJECT: {
      code: 4,
    },
  },

  STATUS_TASK: {
    NEW: {
      code: 0,
      name: 'New',
    },
    TO_BE_SCHEDULE: {
      code: 1,
      name: 'To Be Schedule',
    },
    SCHEDULE: {
      code: 2,
      name: 'Scheduled',
    },
    IN_PROCESS: {
      code: 3,
      name: 'In Process',
    },
    CLOSED: {
      code: 4,
      name: 'Closed',
    },
    ON_HOLD: {
      code: 5,
      name: 'On Hold',
    },
    REJECTED: {
      code: 6,
      name: 'Rejected',
    },
  },
};

export default Commons;
