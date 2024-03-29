/**
 ** Name: Booking Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CStatusTag from '~/components/CStatusTag';
import CUser from '~/components/CUser';
import CTouchable from '~/components/CTouchable';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {Commons, Icons} from '~/utils/common';

function BookingItem(props) {
  const {
    customColors = {},
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
  let timeDate = {
    startDate: data.strStartDateTime.split(' - ')[0],
    endDate: data.strEndDateTime.split(' - ')[0],
  };
  let colorStatus = Commons.BOOKING_STATUS.NOT_HAPPEND.color,
    bgColor = Commons.BOOKING_STATUS.NOT_HAPPEND.bgColor;
  if (data.statusID === Commons.BOOKING_STATUS.HAPPENNING.value) {
    colorStatus = Commons.BOOKING_STATUS.HAPPENNING.color;
    bgColor = Commons.BOOKING_STATUS.HAPPENNING.bgColor;
  } else if (data.statusID === Commons.BOOKING_STATUS.HAPPENED.value) {
    colorStatus = Commons.BOOKING_STATUS.HAPPENED.color;
    bgColor = Commons.BOOKING_STATUS.HAPPENED.bgColor;
  }

  return (
    <CCard
      key={index + 'item_bk_' + data.bookID}
      customLabel={`${data.purpose}`}
      idx={data.bookID}
      color={colors.BG_BOOKINGS}
      onPress={handleItem}
      content={
        <View style={cStyles.flex1}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <View style={styles.left}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CIcon
                  name={Icons.timeTask}
                  size={'smaller'}
                  color={
                    colorStatus === Commons.BOOKING_STATUS.HAPPENNING.color
                      ? colorStatus
                      : 'icon'
                  }
                />
                <View>
                  <Text style={[cStyles.textCaption1, cStyles.pl4]}>
                    <Text
                      style={[
                        cStyles.textCaption1,
                        {color: customColors.text},
                      ]}>
                      {timeDate.startDate} -{' '}
                    </Text>
                    <Text
                      style={[
                        cStyles.textCaption1,
                        cStyles.fontBold,
                        {color: customColors.text},
                      ]}>
                      {data.strStartTime}
                    </Text>
                  </Text>
                  <View style={[cStyles.itemsCenter, cStyles.py4]}>
                    <CIcon name={Icons.downStep} size={'minimum'} />
                  </View>
                  <Text style={[cStyles.textCaption1, cStyles.pl4]}>
                    <Text
                      style={[
                        cStyles.textCaption1,
                        {color: customColors.text},
                      ]}>
                      {timeDate.endDate} -{' '}
                    </Text>
                    <Text
                      style={[
                        cStyles.textCaption1,
                        cStyles.fontBold,
                        {color: customColors.text},
                      ]}>
                      {data.strEndTime}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.right}>
              <View style={cStyles.itemsStart}>
                <CStatusTag
                  customLabel={data.statusName}
                  color={customColors[colorStatus]}
                  bgColor={bgColor}
                />
              </View>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                <CUser label={data.ownerName} />
              </View>
              {!isMyBooking && (
                <CTouchable onPress={handleResource}>
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.mt6,
                      cStyles.py5,
                    ]}>
                    <CIcon
                      name={Icons.resource}
                      size={'smaller'}
                      customColor={data.color}
                    />
                    <CLabel
                      style={[
                        cStyles.pl5,
                        cStyles.textUnderline,
                        cStyles.textItalic,
                      ]}
                      customLabel={data.resourceName}
                    />
                  </View>
                </CTouchable>
              )}
              {isMyBooking && (
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CIcon
                    name={Icons.resource}
                    size={'smaller'}
                    customColor={data.color}
                  />
                  <CLabel style={cStyles.pl5} customLabel={data.resourceName} />
                </View>
              )}
            </View>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  left: {flex: 0.5},
  right: {flex: 0.5},
  live: {backgroundColor: colors.STATUS_REJECT_OPACITY},
});

BookingItem.propTypes = {
  customColors: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  isMyBooking: PropTypes.bool,
  onPress: PropTypes.func,
  onPressResource: PropTypes.func,
};

export default BookingItem;
