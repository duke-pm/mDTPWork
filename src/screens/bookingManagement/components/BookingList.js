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
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = (index, isLive) => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      data: data[index],
      isLive,
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
          customColors={customColors}
          index={index}
          data={item}
          onPress={handleBookingItem}
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
};

export default BookingList;
