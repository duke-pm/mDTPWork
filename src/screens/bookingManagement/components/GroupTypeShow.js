/**
 ** Name: Group Type Show
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of GroupTypeShow.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import {Commons, Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';

function GroupTypeShow(props) {
  const {
    customColors = {},
    type = Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
    onChange = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  let active = {
    background: colors.BG_BOOKING,
    icon: colors.WHITE,
  };

  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyEnd,
        cStyles.py6,
        cStyles.px16,
      ]}>
      <CText styles={'textCaption1'} label={'my_bookings:see_as'} />
      <View
        style={[
          cStyles.rounded1,
          cStyles.mr6,
          {
            backgroundColor:
              type === Commons.TYPE_SHOW_BOOKING.CALENDAR.value
                ? active.background
                : colors.TRANSPARENT,
          },
        ]}>
        <CIconButton
          iconName={Icons.calendarBooking}
          iconColor={
            type === Commons.TYPE_SHOW_BOOKING.CALENDAR.value
              ? active.icon
              : customColors.icon
          }
          onPress={() => onChange(Commons.TYPE_SHOW_BOOKING.CALENDAR.value)}
        />
      </View>
      <View
        style={[
          cStyles.rounded1,
          {
            backgroundColor:
              type === Commons.TYPE_SHOW_BOOKING.LIST.value
                ? active.background
                : colors.TRANSPARENT,
          },
        ]}>
        <CIconButton
          iconName={Icons.listBooking}
          iconColor={
            type === Commons.TYPE_SHOW_BOOKING.LIST.value
              ? active.icon
              : customColors.icon
          }
          onPress={() => onChange(Commons.TYPE_SHOW_BOOKING.LIST.value)}
        />
      </View>
    </View>
  );
}

GroupTypeShow.propTypes = {
  customColors: PropTypes.object,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default GroupTypeShow;
