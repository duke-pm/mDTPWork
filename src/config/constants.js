/**
 ** Name: Constants
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Constants.js
 **/
import Commons from '~/utils/common/Commons';
import {colors} from '~/utils/style';

export const LOAD_MORE = 'LOAD_MORE';
export const REFRESH = 'REFRESH';

export const LOGIN = 'LOGIN';
export const LANGUAGE = 'LANGUAGE';

export const DEFAULT_LANGUAGE_CODE = 'vi';
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_FORMAT_DATE_1 = 'YYYY-MM-DD';
export const DEFAULT_FORMAT_DATE_2 = 'DD/MM/YYYY';
export const DEFAULT_FORMAT_DATE_3 = 'YYYY/MM/DD';
export const DEFAULT_HEIGHT_UPLOAD = 250;
export const DEFAULT_WIDTH_UPLOAD = 250;

export const STATUS_TASK = [
  {
    value: Commons.STATUS_TASK.NEW.value,
    label: Commons.STATUS_TASK.NEW.label,
    color: {
      dark: colors.STATUS_NEW_DARK,
      light: colors.STATUS_NEW,
      opacity: colors.STATUS_NEW_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.TO_BE_SCHEDULE.value,
    label: Commons.STATUS_TASK.TO_BE_SCHEDULE.label,
    color: {
      dark: colors.STATUS_TO_BE_SCHEDULE_DARK,
      light: colors.STATUS_TO_BE_SCHEDULE,
      opacity: colors.STATUS_TO_BE_SCHEDULE_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.SCHEDULE.value,
    label: Commons.STATUS_TASK.SCHEDULE.label,
    color: {
      dark: colors.STATUS_SCHEDULE_DARK,
      light: colors.STATUS_SCHEDULE,
      opacity: colors.STATUS_SCHEDULE_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.IN_PROCESS.value,
    label: Commons.STATUS_TASK.IN_PROCESS.label,
    color: {
      dark: colors.STATUS_IN_PROCESS_DARK,
      light: colors.STATUS_IN_PROCESS,
      opacity: colors.STATUS_IN_PROCESS_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.CLOSED.value,
    label: Commons.STATUS_TASK.CLOSED.label,
    color: {
      dark: colors.STATUS_CLOSE_DARK,
      light: colors.STATUS_CLOSE,
      opacity: colors.STATUS_CLOSE_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.ON_HOLD.value,
    label: Commons.STATUS_TASK.ON_HOLD.label,
    color: {
      dark: colors.STATUS_ON_HOLD_DARK,
      light: colors.STATUS_ON_HOLD,
      opacity: colors.STATUS_ON_HOLD_OPACITY,
    },
  },
  {
    value: Commons.STATUS_TASK.REJECTED.value,
    label: Commons.STATUS_TASK.REJECTED.label,
    color: {
      dark: colors.STATUS_REJECT_DARK,
      light: colors.STATUS_REJECT,
      opacity: colors.STATUS_REJECT_OPACITY,
    },
  },
];
