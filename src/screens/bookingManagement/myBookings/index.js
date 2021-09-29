/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: MyBookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of MyBookings.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {View} from 'react-native';
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
import CText from '~/components/CText';
import CIconButton from '~/components/CIconButton';
import CIconHeader from '~/components/CIconHeader';
import BookingList from '../components/BookingList';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {Commons, Icons} from '~/utils/common';
import {IS_ANDROID, moderateScale, isTimeBetween} from '~/utils/helper';
import {THEME_DARK, REFRESH, LOAD_MORE} from '~/config/constants';
import {usePrevious} from '~/utils/hook';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All init */
const THEME_CALENDAR = {
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
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const bookingState = useSelector(({booking}) => booking);
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** All state */
  const [marked, setMarked] = useState({});
  const [date, setDate] = useState({
    prevDate: null,
    currentDate: moment().format(formatDate),
  });
  const [typeShow, setTypeShow] = useState(
    Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
  );
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    changeType: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [form, setForm] = useState({
    fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
    toDate: Configs.toDay.clone().endOf('month').format(formatDate),
    page: 1,
    search: '',
  });
  const [data, setData] = useState([]);
  const [dataCalendar, setDataCalendar] = useState([]);

  /** All prev */
  const prevType = usePrevious(typeShow);
  const prevData = usePrevious(data);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddNew = () => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      onRefresh: () => onRefresh(),
    });
  };

  const handleChangeType = type => {
    if (typeShow !== type) {
      setLoading({...loading, changeType: true, startFetch: true, main: true});
      setTypeShow(type);
    }
  };

  const handleBookingItem = booking => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      data: booking.dataFull,
      isLive: booking.isLive,
      onRefresh: () => onRefresh(),
    });
  };

  /**********
   ** FUNC **
   **********/
  const onDone = stateloading => setLoading(stateloading);

  const onDateChanged = newDate => {
    let prevDate = date.currentDate;
    setDate({prevDate, currentDate: newDate});
  };

  const onMonthChanged = newMonth => {
    let tmpFromDate = moment(newMonth.dateString)
      .clone()
      .startOf('month')
      .format(formatDate);
    let tmpEndDate = moment(newMonth.dateString)
      .clone()
      .endOf('month')
      .format(formatDate);

    onFetchData(tmpFromDate, tmpEndDate, 1, form.search);
    return onDone({...loading, startFetch: true});
  };

  const onFetchData = (
    fromDate = form.fromDate,
    toDate = form.toDate,
    page = 1,
    search = '',
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      PageNum: page,
      Search: search,
      PageSize:
        typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value ? perPage : -1,
      IsMyBooking: true,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListBooking(params, navigation));
  };

  const onPrepareData = type => {
    let isLoadmore = true;
    let cBookings = [...data];
    let nBookings = bookingState.get('bookings');

    // If count result < perPage => loadmore is unavailable
    if (typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value) {
      if (nBookings.length < perPage) {
        isLoadmore = false;
      }
    }

    if (type === REFRESH) {
      // Fetch is refresh
      cBookings = nBookings;
    } else if (type === LOAD_MORE) {
      // Fetch is loadmore
      cBookings = [...cBookings, ...nBookings];
    }
    setData(cBookings);
    if (typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value) {
      return onDone({
        main: false,
        startFetch: false,
        refreshing: false,
        loadmore: false,
        isLoadmore,
        changeType: false,
      });
    } else {
      return onDone({
        ...loading,
        main: true,
        startFetch: false,
        refreshing: false,
        loadmore: false,
        isLoadmore: false,
      });
    }
  };

  const onPrepareCalendarData = dataBookings => {
    if (dataBookings.length > 0) {
      let tmpData = [],
        tmpMarker = {},
        itemBooking = null,
        itemCalendar = {},
        startDate = '',
        endDate = '',
        startTime = '',
        endTime = '',
        isLive = '';

      for (itemBooking of dataBookings) {
        startDate = itemBooking.startDate.split('T')[0];
        endDate = itemBooking.endDate.split('T')[0];
        startTime = itemBooking.strStartTime + ':00';
        endTime = itemBooking.strEndTime + ':00';

        itemCalendar = {};

        if (!tmpMarker[startDate]) {
          tmpMarker[startDate] = {dots: []};
        }
        tmpMarker[startDate].dots.push({
          key: itemBooking.bookID,
          color: itemBooking.color,
        });

        isLive = false;
        isLive = Configs.toDay.isBetween(startDate, endDate, 'dates', '[]');
        if (isLive) {
          isLive = isTimeBetween(
            itemBooking.strStartTime,
            itemBooking.strEndTime,
            moment().format('HH:mm'),
          );
        }

        itemCalendar.dataFull = itemBooking;
        itemCalendar.isLive = isLive;
        itemCalendar.start = startDate + ' ' + startTime;
        itemCalendar.end = endDate + ' ' + endTime;
        itemCalendar.title =
          itemBooking.purpose +
          t('my_bookings:at') +
          itemBooking.resourceName +
          (isLive ? t('my_bookings:live') : '');
        itemCalendar.summary =
          t('my_bookings:notes') +
          `\n${itemBooking.remarks !== '' ? itemBooking.remarks : '-'}`;
        itemCalendar.color = itemBooking.color;
        tmpData.push(itemCalendar);
      }
      setMarked(tmpMarker);
      setDataCalendar(tmpData);
    }
    return onDone({
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore: false,
      changeType: false,
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

  const onRefresh = () => {
    if (!loading.refreshing) {
      setForm({...form, page: 1});
      onFetchData(form.fromDate, form.toDate, 1, form.search);
      return onDone({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onLoadmore = () => {
    if (!loading.loadmore && loading.isLoadmore) {
      let newPage = form.page + 1;
      setForm({...form, page: newPage});
      onFetchData(form.fromDate, form.toDate, newPage, form.search);
      return onDone({...loading, loadmore: true});
    }
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
    });
    return onDone({
      ...loading,
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore: false,
    });
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onFetchData(form.fromDate, form.toDate, 1, form.search);
    return onDone({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!bookingState.get('submittingList')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (bookingState.get('successList')) {
          return onPrepareData(type);
        }

        if (bookingState.get('errorList')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    bookingState.get('submittingList'),
    bookingState.get('successList'),
    bookingState.get('errorList'),
  ]);

  useEffect(() => {
    if (loading.main && !loading.startFetch) {
      if (prevData && prevData != data) {
        if (typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value) {
          onPrepareCalendarData(data);
        }
      }
    }
  }, [loading, typeShow, prevData, data]);

  useEffect(() => {
    if (loading.changeType) {
      if (prevType && prevType !== typeShow) {
        onFetchData(form.fromDate, form.toDate, 1, form.search);
        return onDone({...loading, startFetch: true});
      }
    }
  }, [loading.changeType, prevType, typeShow]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
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
      loading={loading.main || loading.startFetch}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_BOOKING}
      primaryColorShapesDark={colors.BG_HEADER_BOOKING_DARK}
      content={
        <CContent scrollEnabled={false}>
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
                    typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value
                      ? customColors.cardDisable
                      : colors.TRANSPARENT,
                },
              ]}>
              <CIconButton
                iconName={Icons.calendarBooking}
                onPress={() =>
                  handleChangeType(Commons.TYPE_SHOW_BOOKING.CALENDAR.value)
                }
              />
            </View>
            <View
              style={[
                cStyles.rounded1,
                {
                  backgroundColor:
                    typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value
                      ? customColors.cardDisable
                      : colors.TRANSPARENT,
                },
              ]}>
              <CIconButton
                iconName={Icons.listBooking}
                onPress={() =>
                  handleChangeType(Commons.TYPE_SHOW_BOOKING.LIST.value)
                }
              />
            </View>
          </View>

          {!loading.main &&
            typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value && (
              <CalendarProvider
                date={date.currentDate}
                showTodayButton
                disabledOpacity={0.6}
                onDateChanged={onDateChanged}
                onMonthChange={onMonthChanged}>
                <ExpandableCalendar
                  headerStyle={{backgroundColor: customColors.card}}
                  displayLoadingIndicator={loading.changeType}
                  disableAllTouchEventsForDisabledDays
                  firstDay={1}
                  markingType={'multi-dot'}
                  markedDates={marked}
                  monthFormat={'MMMM - yyyy'}
                  enableSwipeMonths={false}
                  theme={{
                    ...THEME_CALENDAR,
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
                  format24h
                  eventTapped={handleBookingItem}
                  events={dataCalendar.filter(event =>
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
              <BookingList
                navigation={navigation}
                customColors={customColors}
                refreshing={loading.refreshing}
                loadmore={loading.loadmore}
                data={data}
                onRefresh={onRefresh}
                onLoadmore={onLoadmore}
              />
            )}
        </CContent>
      }
    />
  );
}

export default MyBookings;
