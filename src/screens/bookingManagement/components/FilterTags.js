/**
 ** Name: FilterTags
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: All tags of filter requests
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CIcon from '~/components/CIcon';
import CText from '~/components/CText';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_2} from '~/config/constants';

function FilterTags(props) {
  const {
    formatDateView = DEFAULT_FORMAT_DATE_2,
    fromDate = '',
    toDate = '',
    search = '',
    primaryColor = undefined,
    translation = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.flexWrap,
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.px6,
        cStyles.pt10,
        cStyles.pb6,
      ]}>
      <CIcon name={Icons.tags} />
      <View
        style={[
          cStyles.px6,
          cStyles.py2,
          cStyles.mx4,
          cStyles.rounded1,
          {backgroundColor: primaryColor},
        ]}>
        <CText
          styles={'textCaption2 colorBlack'}
          customLabel={`${translation('common:from_date')}${
            fromDate !== '' ? moment(fromDate).format(formatDateView) : '#'
          } ${translation('common:to_date')}${
            toDate !== '' ? moment(toDate).format(formatDateView) : '#'
          }`}
        />
      </View>

      {search !== '' && (
        <View
          style={[
            cStyles.px6,
            cStyles.py2,
            cStyles.mx4,
            cStyles.mt3,
            cStyles.rounded1,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2 colorBlack'}
            customLabel={`${translation('common:find')}: "${search}"`}
          />
        </View>
      )}
    </View>
  );
}

FilterTags.propTypes = {
  formatDateView: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  search: PropTypes.string,
  primaryColor: PropTypes.string,
  translation: PropTypes.func,
};

export default FilterTags;
