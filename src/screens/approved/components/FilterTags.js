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

function FilterTags(props) {
  const {
    formatDateView = 'DD/MM/YYYY',
    customColors = {},
    fromDate = '',
    toDate = '',
    types = [],
    arrStatus = [],
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
          {backgroundColor: customColors.green2},
        ]}>
        <CText
          styles={'textCaption2'}
          customLabel={
            (fromDate !== '' ? moment(fromDate).format(formatDateView) : '#') +
            ' - ' +
            (toDate !== '' ? moment(toDate).format(formatDateView) : '#')
          }
        />
      </View>

      {arrStatus.length > 0 &&
        arrStatus.map(itemStatus => {
          return (
            <View
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mr4,
                cStyles.mt8,
                cStyles.rounded1,
                {backgroundColor: customColors.green2},
              ]}>
              <CText styles={'textCaption2'} label={itemStatus} />
            </View>
          );
        })}

      {types.length > 0 &&
        types.map(itemType => {
          return (
            <View
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mr4,
                cStyles.mt8,
                cStyles.rounded1,
                {backgroundColor: customColors.green2},
              ]}>
              <CText
                styles={'textCaption2'}
                label={'list_request_assets_handling:title_' + itemType.label}
              />
            </View>
          );
        })}
    </View>
  );
}

FilterTags.propTypes = {
  formatDateView: PropTypes.string,
  customColors: PropTypes.object.isRequired,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  types: PropTypes.array,
  arrStatus: PropTypes.array,
};

export default FilterTags;
