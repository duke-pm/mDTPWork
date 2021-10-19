/**
 ** Name: Booking Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CStatusTag from '~/components/CStatusTag';
import CUser from '~/components/CUser';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {Commons, Icons} from '~/utils/common';

function BookingItem(props) {
  const {
    customColors = {},
    index = -1,
    data = null,
    onPress = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(index);

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
  let colorStatus = Commons.BOOKING_STATUS.NOT_HAPPEND.color;
  if (data.statusID === Commons.BOOKING_STATUS.HAPPENNING.value) {
    colorStatus = Commons.BOOKING_STATUS.HAPPENNING.color;
  } else if (data.statusID === Commons.BOOKING_STATUS.HAPPENED.value) {
    colorStatus = Commons.BOOKING_STATUS.HAPPENED.color;
  }

  return (
    <CCard
      key={index}
      customLabel={`#${data.bookID} ${data.purpose}`}
      onPress={handleItem}
      content={
        <View style={cStyles.flex1}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <View style={styles.left}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <CIcon name={Icons.timeTask} size={'smaller'} color={'icon'} />
                <View>
                  <CLabel
                    style={cStyles.pl4}
                    customLabel={`${timeDate.startDate} - ${data.strStartTime}`}
                  />
                  <View style={[cStyles.itemsCenter, cStyles.py4]}>
                    <CIcon name={Icons.downStep} size={'minimum'} />
                  </View>
                  <CLabel
                    style={cStyles.pl4}
                    customLabel={`${timeDate.endDate} - ${data.strEndTime}`}
                  />
                </View>
              </View>
            </View>

            <View style={styles.right}>
              <View style={cStyles.itemsStart}>
                <CStatusTag
                  customLabel={data.statusName}
                  color={customColors[colorStatus]}
                />
              </View>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                <CIcon
                  name={Icons.resource}
                  size={'smaller'}
                  customColor={data.color}
                />
                <CLabel style={cStyles.pl5} customLabel={data.resourceName} />
              </View>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                <CUser label={data.ownerName} />
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
  live: {backgroundColor: colors.STATUS_REJECT_OPACITY},
});

BookingItem.propTypes = {
  customColors: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  onPress: PropTypes.func,
};

export default BookingItem;
