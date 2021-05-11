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
    },
    DAMAGED: {
      code: 2,
    },
    LOST: {
      code: 3,
    }
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
};

export default Commons;
