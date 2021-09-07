/**
 ** Name: CLabel
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CLabel.js
 **/
import PropTypes from 'prop-types';
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
          cStyles.textCaption1,
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
          cStyles.textCaption1,
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

CLabel.propTypes = {
  style: PropTypes.object,
  medium: PropTypes.bool,
  bold: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string,
  customLabel: PropTypes.string,
  numberOfLines: PropTypes.number,
};

export default React.memo(CLabel);
