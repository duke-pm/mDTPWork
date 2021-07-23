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
    numberOfLines = undefined,
  } = props;

  if (label) {
    return (
      <CText
        customStyles={[
          cStyles.textCallout,
          medium && cStyles.fontBold,
          bold && cStyles.fontBold,
          color && {color},
          style,
        ]}
        numberOfLines={numberOfLines}
        label={label}
      />
    );
  }
  if (customLabel) {
    return (
      <CText
        customStyles={[
          cStyles.textCallout,
          medium && cStyles.fontBold,
          bold && cStyles.fontBold,
          color && {color},
          style,
        ]}
        numberOfLines={numberOfLines}
        customLabel={customLabel}
      />
    );
  }
  return null;
}

export default CLabel;
