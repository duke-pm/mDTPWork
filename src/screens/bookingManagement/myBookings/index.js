/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: MyBookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of MyBookings.js
 **/
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, Text} from 'react-native';
import {
  ExpandableCalendar,
  Timeline,
  CalendarProvider,
} from 'react-native-calendars';
import moment from 'moment';
import XDate from 'xdate';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import CText from '~/components/CText';
import CCard from '~/components/CCard';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CIconHeader from '~/components/CIconHeader';
/* COMMON */
import Configs from '~/config';
import {usePrevious} from '~/utils/hook';
import Routes from '~/navigation/Routes';
import {Booking} from '~/utils/mockup';
import {colors, cStyles} from '~/utils/style';
import {Commons, Icons} from '~/utils/common';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';
import {useColorScheme} from 'react-native-appearance';
import {THEME_DARK} from '~/config/constants';

/** All init */
const formatDateCalendar = 'YYYY-MM-DD HH:mm:ss';
const getTheme = {
  textDayFontSize: cStyles.textCallout.fontSize,
  textMonthFontSize: cStyles.textCallout.fontSize,
  textDayHeaderFontSize: cStyles.textCallout.fontSize,
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: 'bold',
  arrowColor: colors.ORANGE,
  selectedDotColor: colors.WHITE,
  selectedDayBackgroundColor: colors.GREEN,
  selectedDayTextColor: colors.WHITE,
  todayTextColor: colors.GREEN,
  'stylesheet.calendar.header': {
    dayTextAtIndex6: {
      color: colors.RED,
    },
  },
  // arrows
  arrowStyle: {padding: 0},
  // day names
  textSectionTitleColor: colors.GRAY_600,
  textDayFontWeight: cStyles.textBody.fontWeight,
  textDayStyle: {marginTop: IS_ANDROID ? moderateScale(2) : moderateScale(7)},
  // disabled date
  textDisabledColor: 'grey',
  // dot (marked date)
  dotColor: colors.PRIMARY,
  disabledDotColor: 'grey',
  dotStyle: {marginTop: -2},
};

function MyBookings(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** All state */
  const [marked, setMarked] = useState({});
  const [date, setDate] = useState({
    currentDate: moment().format('YYYY-MM-DD'),
  });
  const [typeShow, setTypeShow] = useState(
    Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
  );
  const [loading, setLoading] = useState({
    main: true,
    startFetch: true,
    changeType: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [params, setParams] = useState({
    fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
    toDate: Configs.toDay.clone().endOf('month').format(formatDate),
    page: 1,
    search: '',
  });
  const [data, setData] = useState([]);

  /** All prev */
  const prevType = usePrevious(typeShow);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = () => {};

  const handleAddNew = () => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name);
  };

  const handleChangeType = type => {
    if (typeShow !== type) {
      setLoading({...loading, changeType: true});
      setTypeShow(type);
    }
  };

  /**********
   ** FUNC **
   **********/
  const onFetchData = () => {
    let params = {};

    setData(Booking.Bookings);
    onDone(false);
  };

  const prepareCalendarData = () => {
    let dateDot = '',
      tmpData = [],
      tmpMarker = {},
      itemBooking = null,
      itemCalendar = {};

    for (itemBooking of Booking.Bookings) {
      itemCalendar = {};
      dateDot = moment(itemBooking.fromDate, formatDateCalendar).format(
        formatDate,
      );
      if (!tmpMarker[dateDot]) {
        tmpMarker[dateDot] = {dots: []};
      }
      tmpMarker[dateDot].dots.push({
        key: itemBooking.id,
        color: itemBooking.color,
      });

      itemCalendar.start = itemBooking.fromDate;
      itemCalendar.end = itemBooking.toDate;
      itemCalendar.title = itemBooking.label;
      itemCalendar.summary = itemBooking.note;
      itemCalendar.color = itemBooking.color;
      tmpData.push(itemCalendar);
    }

    setMarked(tmpMarker);
    setData(tmpData);
    onDone(false);
  };

  const prepareListData = () => {
    setData(Booking.Bookings);
    onDone(false);
  };

  const onDone = isLoadmore => {
    return setLoading({
      main: false,
      startFetch: false,
      changeType: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const sameDate = (a, b) => {
    if (!a || !b) {
      return false;
    }
    return (
      a instanceof XDate &&
      b instanceof XDate &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const onDateChanged = date => {
    setDate({currentDate: date});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value) {
      return prepareCalendarData();
    }
    if (typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value) {
      return prepareListData();
    }
  }, []);

  useEffect(() => {
    if (loading.changeType) {
      if (prevType && prevType !== typeShow) {
        if (typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value) {
          return prepareCalendarData();
        }
        if (typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value) {
          return prepareListData();
        }
      }
    }
  }, [loading.changeType, prevType, typeShow]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: false,
              active: typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
              icon: Icons.calendarBooking,
              onPress: () =>
                handleChangeType(Commons.TYPE_SHOW_BOOKING.CALENDAR.value),
            },
            {
              show: true,
              showRedDot: false,
              active: typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value,
              icon: Icons.listBooking,
              onPress: () =>
                handleChangeType(Commons.TYPE_SHOW_BOOKING.LIST.value),
            },
            {
              show: isPermissionWrite,
              showRedDot: false,
              icon: Icons.addNew,
              onPress: handleAddNew,
            },
          ]}
        />
      ),
    });
  }, [navigation, isPermissionWrite, typeShow]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main}
      content={
        <CContent scrollEnabled={false}>
          {!loading.main &&
            typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value && (
              <CalendarProvider
                date={date.currentDate}
                showTodayButton
                disabledOpacity={0.6}
                onDateChanged={onDateChanged}>
                <ExpandableCalendar
                  headerStyle={{backgroundColor: customColors.card}}
                  displayLoadingIndicator={loading.changeType}
                  disableAllTouchEventsForDisabledDays={true}
                  firstDay={1}
                  markingType={'multi-dot'}
                  markedDates={marked}
                  monthFormat={'MMMM - yyyy'}
                  enableSwipeMonths={true}
                  theme={{
                    ...getTheme,
                    backgroundColor: customColors.card,
                    calendarBackground: customColors.card,
                    textDayStyle: {color: customColors.text},
                    monthTextColor: customColors.text,
                    selectedDayBackgroundColor: isDark
                      ? colors.BG_BOOKING
                      : customColors.green,
                  }}
                />
                <Timeline
                  style={{backgroundColor: customColors.card}}
                  format24h={true}
                  eventTapped={e =>
                    console.log('[LOG] === eventTapped ===> ', e)
                  }
                  events={data.filter(event =>
                    sameDate(
                      new XDate(event.start),
                      new XDate(date.currentDate),
                    ),
                  )}
                />
              </CalendarProvider>
            )}

          {!loading.main &&
            !loading.startFetch &&
            typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value && (
              <CList
                contentStyle={cStyles.pt10}
                data={data}
                item={({item, index}) => {
                  let between = false;
                  between = Configs.toDay.isBetween(
                    moment(item.fromDate, formatDateCalendar),
                    moment(item.toDate, formatDateCalendar),
                  );

                  return (
                    <CCard
                      key={index}
                      customLabel={`#${item.id} ${item.label}`}
                      onPress={handleBookingItem}
                      content={
                        <View style={cStyles.flex1}>
                          <View style={[cStyles.row, cStyles.itemsStart]}>
                            <View style={[styles.left]}>
                              <View style={[cStyles.row, cStyles.itemsCenter]}>
                                <CIcon
                                  name={Icons.timeTask}
                                  size={'smaller'}
                                  color={between ? 'green' : 'icon'}
                                />
                                <View>
                                  <View
                                    style={[cStyles.row, cStyles.itemsCenter]}>
                                    <Text
                                      style={[cStyles.textCenter, cStyles.pl4]}
                                      numberOfLines={2}>
                                      <Text
                                        style={[
                                          cStyles.textCaption2,
                                          {color: customColors.text},
                                        ]}>
                                        {`${moment(
                                          item.fromDate,
                                          formatDateCalendar,
                                        ).format(formatDateView)}\n${moment(
                                          item.fromDate,
                                          formatDateCalendar,
                                        ).format('HH:mm')}`}
                                      </Text>
                                    </Text>
                                    <CIcon
                                      name={Icons.nextStep}
                                      size={'minimum'}
                                    />
                                    <Text
                                      style={cStyles.textCenter}
                                      numberOfLines={2}>
                                      <Text
                                        style={[
                                          cStyles.textCaption2,
                                          {color: customColors.text},
                                        ]}>
                                        {`${moment(
                                          item.toDate,
                                          formatDateCalendar,
                                        ).format(formatDateView)}\n${moment(
                                          item.toDate,
                                          formatDateCalendar,
                                        ).format('HH:mm')}`}
                                      </Text>
                                    </Text>
                                  </View>
                                  {between && (
                                    <View
                                      style={[
                                        cStyles.itemsCenter,
                                        cStyles.rounded5,
                                        cStyles.py2,
                                        cStyles.px2,
                                        {
                                          backgroundColor:
                                            colors.STATUS_SCHEDULE_OPACITY,
                                        },
                                      ]}>
                                      <CText
                                        styles={
                                          'textCaption2 colorGreen fontBold'
                                        }
                                        label={'bookings:resume'}
                                      />
                                    </View>
                                  )}
                                </View>
                              </View>
                            </View>

                            <View style={[styles.right]}>
                              <View style={[cStyles.row, cStyles.itemsCenter]}>
                                <CIcon name={Icons.resource} size={'smaller'} />
                                <CLabel
                                  style={cStyles.pl5}
                                  customLabel={item.resource.label}
                                />
                              </View>
                              <View
                                style={[
                                  cStyles.row,
                                  cStyles.itemsCenter,
                                  cStyles.mt6,
                                ]}>
                                <CIcon
                                  name={Icons.userCreated}
                                  size={'smaller'}
                                />
                                <CLabel
                                  style={cStyles.pl5}
                                  customLabel={item.cretaedUser}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      }
                    />
                  );
                }}
              />
            )}
        </CContent>
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
});

export default MyBookings;
