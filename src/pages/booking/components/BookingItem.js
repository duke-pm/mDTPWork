/**
 ** Name: Booking Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Button, Card, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {Commons} from '~/utils/common';
import {DEFAULT_FORMAT_DATE_4, DEFAULT_FORMAT_DATE_9} from '~/configs/constants';
import CAvatar from '~/components/CAvatar';

function BookingItem(props) {
  const {
    trans = {},
    index = -1,
    data = null,
    isMyBooking = false,
    onPress = () => null,
    onPressResource = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(index);

  const handleResource = () =>
    onPressResource(data.resourceID, data.resourceName);

  /************
   ** RENDER **
   ************/
  if (!data) {
    return null;
  }
  let colorStatus = 'warning',
    arrAvatarParticipant = [];
  if (data.statusID === Commons.BOOKING_STATUS.HAPPENNING.value) {
    colorStatus = 'success';
  } else if (data.statusID === Commons.BOOKING_STATUS.HAPPENED.value) {
    colorStatus = 'basic';
  }
  if (data.lstUserJoined.length > 0) {
    arrAvatarParticipant = data.lstUserJoined.map(item =>
      Assets.iconUser);
  } 
  return (
    <Card
      onPress={handleItem}
      header={propsH =>
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px16,
            cStyles.py10,
          ]}>
          <View style={styles.con_left}>
            <CText category="s1">{`${data.purpose}`}</CText>
            <CText category="c1" appearance="hint">
              {`${trans('common:created_at')} ${moment(
                data.crtdDate,
                DEFAULT_FORMAT_DATE_4,
              ).format(DEFAULT_FORMAT_DATE_9)}`}
            </CText>
          </View>
          <View style={[cStyles.itemsEnd, styles.con_right]}>
            <Button
              size="tiny"
              status={colorStatus}>
              {data.statusName}
            </Button>
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View>
          <CText>{`${moment(
              data.startDate,
              DEFAULT_FORMAT_DATE_4,
            ).format(DEFAULT_FORMAT_DATE_9)} - ${data.strStartTime}`}</CText>
          <CText category="c1" appearance="hint">
            {trans('bookings:start_time')}
          </CText>
        </View>
        {isMyBooking && arrAvatarParticipant.length > 0 && (
          <View style={cStyles.itemsEnd}>
            <CAvatar
              absolute={false}
              size="tiny"
              sources={arrAvatarParticipant}
            />
            <CText category="c1" appearance="hint" style={cStyles.mt5}>
              {trans('bookings:participants')}
            </CText>
          </View>
        )}
        {!isMyBooking && (
          <View style={cStyles.itemsEnd}>
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <Avatar size="tiny" source={Assets.iconUser} />
              <CText style={cStyles.ml5}>{data.ownerName}</CText>
            </View>
            <CText category="c1" appearance="hint" style={cStyles.mt5}>
              {trans('bookings:owner')}
            </CText>
          </View>
        )}
      </View>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          isMyBooking && cStyles.mt10,
        ]}>
        <View>
          <CText>{`${moment(
              data.endDate,
              DEFAULT_FORMAT_DATE_4,
            ).format(DEFAULT_FORMAT_DATE_9)} - ${data.strEndTime}`}</CText>
          <CText category="c1" appearance="hint">
            {trans('bookings:end_time')}
          </CText>
        </View>
        {!isMyBooking && (
          <View style={cStyles.itemsEnd}>
            <Button appearance="ghost" size="tiny" onPress={handleResource}>
              {propsB => <CText style={cStyles.textUnderline} status="primary">{data.resourceName}</CText>}
            </Button>
            <CText category="c1" appearance="hint">
              {trans('bookings:resource')}
            </CText>
          </View>
        )}
        {isMyBooking && (
          <View style={cStyles.itemsEnd}>
            <CText>{data.resourceName}</CText>
            <CText category="c1" appearance="hint">
              {trans('bookings:resource')}
            </CText>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.7},
  con_right: {flex: 0.3},
  con_num_user: {height: 24, width: 24},
});

BookingItem.propTypes = {
  trans: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  isMyBooking: PropTypes.bool,
  onPress: PropTypes.func,
  onPressResource: PropTypes.func,
};

export default BookingItem;
