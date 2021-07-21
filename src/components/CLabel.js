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
    style = {},
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
          cStyles.textCaption1,
          medium && cStyles.fontMedium,
          bold && cStyles.fontBold,
          color && {color},
          style,
        ]}
        label={label}
      />
    );
  }
  if (customLabel) {
    return (
      <CText
        customStyles={[
          cStyles.textCaption1,
          medium && cStyles.fontMedium,
          bold && cStyles.fontBold,
          color && {color},
          style,
        ]}
        customLabel={customLabel}
      />
    );
  }
  return null;
}

export default CLabel;
