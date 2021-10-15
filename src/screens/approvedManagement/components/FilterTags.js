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
    types = [],
    arrStatus = [],
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
          styles={'textCaption2'}
          customLabel={`${translation('common:from_date')}${
            fromDate !== '' ? moment(fromDate).format(formatDateView) : '#'
          }\n${translation('common:to_date')}${
            toDate !== '' ? moment(toDate).format(formatDateView) : '#'
          }`}
        />
      </View>

      {arrStatus.length > 0 &&
        arrStatus.map(itemStatus => {
          return (
            <View
              key={itemStatus}
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mr4,
                cStyles.mt8,
                cStyles.rounded1,
                {backgroundColor: primaryColor},
              ]}>
              <CText styles={'textCaption2 colorBlack'} label={itemStatus} />
            </View>
          );
        })}

      {types.length > 0 &&
        types.map(itemType => {
          return (
            <View
              key={itemType.label}
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mr4,
                cStyles.mt8,
                cStyles.rounded1,
                {backgroundColor: primaryColor},
              ]}>
              <CText
                styles={'textCaption2 colorBlack'}
                label={'list_request_assets_handling:title_' + itemType.label}
              />
            </View>
          );
        })}

      {search !== '' && (
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
  types: PropTypes.array,
  arrStatus: PropTypes.array,
  search: PropTypes.string,
  primaryColor: PropTypes.string,
  translation: PropTypes.func,
};

export default FilterTags;
