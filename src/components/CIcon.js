/**
 ** Name: Custom Icon
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Icon, useTheme} from '@ui-kitten/components';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/* COMMON */
import {moderateScale} from '~/utils/helper';

const CIcon = (propsI, type = 'eva', name = '', fill = undefined, size = undefined) => {
  const theme = useTheme();
  if (type === 'eva') {
    return (
      <Icon {...propsI}
        name={name + '-outline'}
        fill={fill}
      />
    );
  }
  if (type === 'ioni') {
    return (
      <IoniIcon
        name={name + '-outline'}
        color={fill || theme['color-basic-600']}
        size={size || moderateScale(18)}
      />
    );
  }
  return null;
};

CIcon.propTypes = {
  type: PropTypes.oneOf(['eva', 'ioni']),
  name: PropTypes.string,
  fill: PropTypes.string,
};

export default CIcon;
