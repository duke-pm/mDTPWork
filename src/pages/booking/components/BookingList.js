/**
 ** Name: Booking List
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingList.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";
import {List} from "@ui-kitten/components";
import {View} from "react-native";
/* COMPONENTS */
import CFooterList from "~/components/CFooterList";
import CEmpty from "~/components/CEmpty";
import BookingItem from "./BookingItem";
/* COMMON */
import Routes from "~/navigator/Routes";
import {cStyles} from "~/utils/style";

function BookingList(props) {
  const {t} = useTranslation();
  const {
    navigation = null,
    refreshing = false,
    loadmore = false,
    isMyBooking = false,
    data = [],
    onRefresh = undefined,
    onLoadmore = undefined,
    onPressResource = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = index => {
    navigation.navigate(Routes.ADD_BOOKING.name, {
      type: "UPDATE",
      data: data[index],
      onRefresh: () => onRefresh(),
    });
  };

  /************
   ** RENDER **
   ************/
  return (
    <List
      contentContainerStyle={cStyles.p10}
      data={data}
      renderItem={info => {
        return (
          <BookingItem
            index={info.index}
            data={info.item}
            isMyBooking={isMyBooking}
            trans={t}
            onPress={handleBookingItem}
            onPressResource={onPressResource}
          />
        )
      }}
      keyExtractor={(item, index) => "listBooking_" + index.toString()}
      refreshing={refreshing}
      onEndReachedThreshold={0.1}
      onRefresh={onRefresh}
      onEndReached={onLoadmore}
      ItemSeparatorComponent={() => <View style={cStyles.py5} />}
      ListEmptyComponent={
        <CEmpty
          label={"common:empty_data"}
          description={"common:cannot_find_data_filter"}
        />
      }
      ListFooterComponent={loadmore ? <CFooterList /> : null}
    />
  );
}

BookingList.propTypes = {
  navigation: PropTypes.any,
  refreshing: PropTypes.bool,
  loadmore: PropTypes.bool,
  isMyBooking: PropTypes.bool,
  data: PropTypes.array,
  onRefresh: PropTypes.func,
  onLoadmore: PropTypes.func,
  onPressResource: PropTypes.func,
};

export default BookingList;
