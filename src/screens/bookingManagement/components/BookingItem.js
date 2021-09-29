/**
 ** Name: Booking Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CCard from '~/components/CCard';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
/* COMMON */
import Configs from '~/config';
import {colors, cStyles} from '~/utils/style';
import {Commons, Icons} from '~/utils/common';
import {moderateScale, isTimeBetween} from '~/utils/helper';

function BookingItem(props) {
  const {
    customColors = {},
    index = -1,
    data = null,
    onPress = () => null,
  } = props;
  let isLive = false;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(index, isLive);

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
  isLive = Configs.toDay.isBetween(
    moment(timeDate.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    moment(timeDate.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    'dates',
    '[]',
  );
  if (isLive) {
    isLive = isTimeBetween(
      data.strStartTime,
      data.strEndTime,
      moment().format('HH:mm'),
    );
  }
  let colorTime = isLive
    ? Commons.BOOKING_STATUS_HAPPEND.HAPPENNING.color
    : data.statusHappend === Commons.BOOKING_STATUS_HAPPEND.NOT_HAPPEND.value
    ? Commons.BOOKING_STATUS_HAPPEND.NOT_HAPPEND.color
    : Commons.BOOKING_STATUS_HAPPEND.HAPPENED.color;

  return (
    <CCard
      key={index}
      customLabel={`#${data.bookID} ${data.purpose}`}
      onPress={handleItem}
      content={
        <View style={cStyles.flex1}>
          <View style={[cStyles.row, cStyles.itemsStart]}>
            <View style={styles.left}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CIcon
                  name={Icons.timeTask}
                  size={'smaller'}
                  color={colorTime}
                />
                <View>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Text
                      style={[cStyles.textCenter, cStyles.pl4]}
                      numberOfLines={2}>
                      <Text
                        style={[
                          cStyles.textCaption2,
                          {color: customColors.text},
                        ]}>
                        {`${timeDate.startDate}\n${data.strStartTime}`}
                      </Text>
                    </Text>
                    <CIcon name={Icons.nextStep} size={'minimum'} />
                    <Text style={cStyles.textCenter} numberOfLines={2}>
                      <Text
                        style={[
                          cStyles.textCaption2,
                          {color: customColors.text},
                        ]}>
                        {`${timeDate.endDate}\n${data.strEndTime}`}
                      </Text>
                    </Text>
                  </View>
                  {isLive && (
                    <View
                      style={[
                        cStyles.itemsCenter,
                        cStyles.rounded5,
                        cStyles.py2,
                        cStyles.px2,
                        styles.live,
                      ]}>
                      <CText
                        styles={'textCaption2 colorRed fontBold'}
                        label={'bookings:resume'}
                      />
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.right}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CIcon
                  name={Icons.resource}
                  size={'smaller'}
                  customColor={data.color}
                />
                <CLabel style={cStyles.pl3} customLabel={data.resourceName} />
              </View>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                <CIcon name={Icons.userCreated} size={'smaller'} />
                <CLabel style={cStyles.pl5} customLabel={data.ownerName} />
              </View>
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
  con_user_invite: {
    top: -moderateScale(10),
    height: moderateScale(20),
    width: moderateScale(20),
    zIndex: 0,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  live: {backgroundColor: colors.STATUS_REJECT_OPACITY},
});

BookingItem.propTypes = {
  customColors: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  onPress: PropTypes.func,
};

export default BookingItem;
