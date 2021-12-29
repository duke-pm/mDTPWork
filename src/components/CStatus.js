/**
 ** Name: Custom status
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatus.js
 **/
import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@ui-kitten/components';
/* COMMON */
import {Commons} from '~/utils/common';
import {LIGHT} from '~/configs/constants';
import {ThemeContext} from '~/configs/theme-context';

function CStatus(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const {
    type = 'approved', // approved | project | booking
    disabled = false,
    value = null,
    label = '',
    customLabel = null,
    onPress = undefined,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!value) return null;
  let status = null;
  if (type === 'approved') {
    status = Commons.STATUS_APPROVED.find(f => f.value === value);
  }
  if (type === 'project') {
    status = Commons.STATUS_PROJECT.find(f => f.value === value);
  }
  if (type === 'booking') {
    status = Commons.STATUS_BOOKING.find(f => f.value === value);
  }
  if (!status) return null;
  return (
    <Button
      disabled={disabled}
      size="tiny"
      status={status.color}
      onPress={onPress}>
      {customLabel
        ? propsB => customLabel(propsB)
        : t(label)}
    </Button>
  );
}

export default React.memo(CStatus);
