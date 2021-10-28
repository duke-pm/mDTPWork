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
import CIconButton from '~/components/CIconButton';

function FilterTags(props) {
  const {
    formatDateView = DEFAULT_FORMAT_DATE_2,
    fromDate = '',
    toDate = '',
    search = '',
    resource = null,
    resources = [],
    primaryColor = undefined,
    translation = () => null,
    onPressRemoveReSrc = () => null,
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
      {!resource && (
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
      )}

      {!resource && search !== '' && (
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

      {resource && (
        <View
          style={[
            cStyles.px6,
            cStyles.mx4,
            cStyles.mt3,
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2 colorBlack pr4'}
            customLabel={`${translation('bookings:resource')}: ${resource}`}
          />
          <CIconButton iconName={Icons.remove} onPress={onPressRemoveReSrc} />
        </View>
      )}

      {!resource &&
        resources &&
        resources !== 'all' &&
        resources.map((itemResrc, index) => {
          return (
            <View
              key={itemResrc.label + index}
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
                customLabel={itemResrc.label}
              />
            </View>
          );
        })}

      {!resource && resources && resources === 'all' && (
        <View
          style={[
            cStyles.px6,
            cStyles.py2,
            cStyles.mr4,
            cStyles.mt8,
            cStyles.rounded1,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2'}
            customLabel={`${translation('bookings:resource')}: ${translation(
              'common:all',
            )}`}
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
  resource: PropTypes.any,
  resources: PropTypes.array,
  primaryColor: PropTypes.string,
  translation: PropTypes.func,
  onPressRemoveReSrc: PropTypes.func,
};

export default FilterTags;
