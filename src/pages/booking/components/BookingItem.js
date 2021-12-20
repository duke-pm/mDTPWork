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
import 'moment/locale/vi';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {Commons} from '~/utils/common';
import {DEFAULT_FORMAT_DATE_4, DEFAULT_FORMAT_DATE_9} from '~/configs/constants';

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
  let colorStatus = 'warning';
  if (data.statusID === Commons.BOOKING_STATUS.HAPPENNING.value) {
    colorStatus = 'success';
  } else if (data.statusID === Commons.BOOKING_STATUS.HAPPENED.value) {
    colorStatus = 'basic';
  }
  return (
    <Card
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
            <CText category="label">{`${data.bookID} | ${data.purpose}`}</CText>
            <CText category="c1" appearance="hint">{
              moment(
                data.crtdDate,
                DEFAULT_FORMAT_DATE_4,
              ).format(DEFAULT_FORMAT_DATE_9)
            }</CText>
          </View>
          <View style={styles.con_right}>
            <Button
              appearance="outline"
              size="tiny"
              status={colorStatus}>
              {data.statusName}
            </Button>
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View>
          <CText>{data.strStartDateTime}</CText>
          <CText category="c1" appearance="hint">
            {trans('bookings:start_time')}
          </CText>
        </View>
        {data.lstUserJoined.length > 0 && (
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
            {data.lstUserJoined.map((itemU, indexU) => {
              if (indexU === 3) return (
                <View style={[cStyles.rounded5, cStyles.center, {height: 24, width: 24}]}>
                  <Text category="c1">+{data.lstUserJoined.length - 3}</Text>
                </View>
              )
              if (indexU > 3) return;
              return <Avatar size="tiny" source={Assets.iconUser} />
            })}
          </View>
        )}
      </View>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View>
          <CText>{data.strEndDateTime}</CText>
          <CText category="c1" appearance="hint">
            {trans('bookings:end_time')}
          </CText>
        </View>
        {!isMyBooking && (
          <View style={cStyles.itemsEnd}>
            <Button appearance="ghost" size="tiny" onPress={handleResource}>
              {propsB => <CText style={cStyles.textUnderline}>{data.resourceName}</CText>}
            </Button>
            <CText category="c1" appearance="hint">
              {trans('bookings:resource')}
            </CText>
          </View>
        )}
        {isMyBooking && (
          <View style={cStyles.itemsEnd}>
            <CText style={cStyles.textUnderline}>{data.resourceName}</CText>
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
