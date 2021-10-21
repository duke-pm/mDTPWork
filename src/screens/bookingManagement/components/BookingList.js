/**
 ** Name: Booking List
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingList.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
/* COMPONENTS */
import CList from '~/components/CList';
import BookingItem from './BookingItem';
/* COMMON */
import Routes from '~/navigation/Routes';
import {cStyles} from '~/utils/style';

function BookingList(props) {
  const {
    navigation = null,
    customColors = {},
    refreshing = false,
    loadmore = false,
    data = [],
    onRefresh = undefined,
    onLoadmore = undefined,
    onPressResource = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = index => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      data: data[index],
      onRefresh: () => onRefresh(),
    });
  };

  /************
   ** RENDER **
   ************/
  return (
    <CList
      contentStyle={cStyles.pt10}
      data={data}
      item={({item, index}) => (
        <BookingItem
          index={index}
          data={item}
          customColors={customColors}
          onPress={handleBookingItem}
          onPressResource={onPressResource}
        />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      loadingmore={loadmore}
      onLoadmore={onLoadmore}
    />
  );
}

BookingList.propTypes = {
  navigation: PropTypes.any,
  customColors: PropTypes.object,
  refreshing: PropTypes.bool,
  loadmore: PropTypes.bool,
  data: PropTypes.array,
  onRefresh: PropTypes.func,
  onLoadmore: PropTypes.func,
  onPressResource: PropTypes.func,
};

export default BookingList;
