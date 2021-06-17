/**
 ** Name: CLabel
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CLabel.js
 **/
import React from 'react';
/* COMPONENTS */
import CText from './CText';
/** COMMON */
import {cStyles} from '~/utils/style';

function CLabel(props) {
  const {
    medium = false,
    bold = false,
    color = null,
    label = null,
    customLabel = null,
  } = props;

  if (label) {
    return (
      <CText
        customStyles={[
          cStyles.textMeta,
          medium && cStyles.fontMedium,
          bold && cStyles.fontBold,
          color && {color},
        ]}
        label={label}
      />
    );
  }
  if (customLabel) {
    return (
      <CText
        customStyles={[
          cStyles.textMeta,
          medium && cStyles.fontMedium,
          bold && cStyles.fontBold,
          color && {color},
        ]}
        customLabel={customLabel}
      />
    );
  }
  return null;
}

export default CLabel;
