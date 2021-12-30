/**
 ** Name: Custom Status
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatus.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@ui-kitten/components';
/* COMMON */
import {Commons} from '~/utils/common';

function CStatus(props) {
  const {t} = useTranslation();
  const {
    type = 'approved',
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

CStatus.propTypes = {
  type: PropTypes.oneOf([
    'approved',
    'project',
    'booking',
  ]),
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  label: PropTypes.string,
  customLabel: PropTypes.any,
  onPress: PropTypes.func,
}

export default React.memo(CStatus);
