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
      value: 1,
      label: 'New',
    },
    TO_BE_SCHEDULE: {
      value: 2,
      label: 'To Be Schedule',
    },
    SCHEDULE: {
      value: 3,
      label: 'Scheduled',
    },
    IN_PROCESS: {
      value: 4,
      label: 'In Progress',
    },
    CLOSED: {
      value: 5,
      label: 'Closed',
    },
    ON_HOLD: {
      value: 6,
      label: 'On Hold',
    },
    REJECTED: {
      value: 7,
      label: 'Rejected',
    },
  },

  STATUS_PROJECT: {
    IN_PROCESS: {
      value: 4,
      label: 'status:in_progress',
      color: 'statusInProgress',
    },
    CLOSED: {
      value: 5,
      label: 'status:closed',
      color: 'statusClosed',
    },
    REJECTED: {
      value: 7,
      label: 'status:rejected',
      color: 'statusRejected',
    },
  },
};

export default Commons;
