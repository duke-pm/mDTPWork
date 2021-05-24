import { colors } from "../style";

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
      value: 1,
      label: 'add',
    },
    DAMAGED: {
      value: 2,
      label: 'damage',
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
      value: 0,
      label: 'New',
    },
    TO_BE_SCHEDULE: {
      value: 1,
      label: 'To Be Schedule',
    },
    SCHEDULE: {
      value: 2,
      label: 'Scheduled',
    },
    IN_PROCESS: {
      value: 3,
      label: 'In Process',
    },
    CLOSED: {
      value: 4,
      label: 'Closed',
    },
    ON_HOLD: {
      value: 5,
      label: 'On Hold',
    },
    REJECTED: {
      value: 6,
      label: 'Rejected',
    },
  },
};

export default Commons;
