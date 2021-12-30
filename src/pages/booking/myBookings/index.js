/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: MyBookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of MyBookings.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {ExpandableCalendar, Timeline, CalendarProvider} from 'react-native-calendars';
import {Layout, useTheme} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import XDate from 'xdate';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CButtonAdd from '~/components/CButtonAdd';
import CLoading from '~/components/CLoading';
import BookingList from '../components/BookingList';
import GroupTypeShow from '../components/GroupTypeShow';
import Filter from '../components/Filter';
/* COMMON */
import Routes from '~/navigator/Routes';
import {colors, cStyles} from '~/utils/style';
import {Commons} from '~/utils/common';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {REFRESH, LOAD_MORE} from '~/configs/constants';
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
  arrowColor: colors.BLACK,
  selectedDotColor: colors.WHITE,
  selectedDayTextColor: colors.WHITE,
  todayTextColor: colors.PRIMARY,
  'stylesheet.calendar.header': {
    dayTextAtIndex5: {
      color: colors.RED,
    },
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
const MONTH_FORMAT = 'MMMM - yyyy';

function MyBookings(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation, route} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const bookingState = useSelector(({booking}) => booking);
  const masterState = useSelector(({masterData}) => masterData);
  const resourcesMaster = masterState.get('bkReSource');
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** All state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    changeType: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [marked, setMarked] = useState({});
  const [dataList, setDataList] = useState([]);
  const [dataCalendar, setDataCalendar] = useState([]);
  const [date, setDate] = useState({
    prevDate: null,
    currentDate: moment().format(formatDate),
  });
  const [typeShow, setTypeShow] = useState(
    Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
  );
  const [form, setForm] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    page: 1,
    search: '',
    resources: '',
    resourcesORG: [],
  });

  /** All prev */
  const prevType = usePrevious(typeShow);
  const prevData = usePrevious(dataList);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddNew = () => {
    navigation.navigate(Routes.ADD_BOOKING.name, {
      type: 'ADD',
      onRefresh: () => onRefresh(),
    });
  };

  const handleBookingItem = booking => {
    navigation.navigate(Routes.ADD_BOOKING.name, {
      type: 'UPDATE',
      data: booking.dataFull,
      onRefresh: () => onRefresh(),
    });
  };

  const handleChangeType = type => {
    if (typeShow !== type) {
      setLoading({...loading, changeType: true});
      setTypeShow(type);
    }
  };

  const handleFilter = (fromDate, toDate, resources, resourcesORG, toogle) => {
    toogle();
    setForm({...form, page: 1, fromDate, toDate, resources, resourcesORG});
    onFetchData(fromDate, toDate, 1, form.search, resources);
    return setLoading({...loading, startFetch: true});
  };

  const handleSearch = value => {
    setForm({...form, search: value, page: 1});
    onFetchData(form.fromDate, form.toDate, 1, value);
    return setLoading({...loading, startFetch: true});
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
      .startOf('month')
      .format(formatDate);
    let tmpEndDate = moment(newMonth.dateString)
      .endOf('month')
      .format(formatDate);

    setForm({...form, fromDate: tmpFromDate, toDate: tmpEndDate});
    onFetchData(tmpFromDate, tmpEndDate, 1, form.search);
    return onDone({...loading, startFetch: true});
  };

  const onFetchData = (
    fromDate = form.fromDate,
    toDate = form.toDate,
    page = 1,
    search = '',
    resources = '',
  ) => {
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      PageNum: page,
      Search: search,
      ResourceID: resources,
      PageSize:
        typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value ? perPage : -1,
      IsMyBooking: true,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListBooking(params, navigation));
  };

  const onPrepareData = type => {
    let isLoadmore = true,
      cBookings = [...dataList],
      nBookings = bookingState.get('bookings');

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
    setDataList(cBookings);

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
        endTime = '';

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

        itemCalendar.dataFull = itemBooking;
        itemCalendar.start = startDate + ' ' + startTime;
        itemCalendar.end = endDate + ' ' + endTime;
        itemCalendar.title = itemBooking.purpose;
        itemCalendar.summary =
          t('my_bookings:notes') +
          `${itemBooking.remarks !== '' ? itemBooking.remarks : '-'}\n${t(
            'my_bookings:owner',
          )}${itemBooking.ownerName}\n${t('my_bookings:resource')}${
            itemBooking.resourceName
          }`;
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
    if (resourcesMaster.length > 0) {
      let i,
        objResource = {},
        tmpDataResources = [];
      for (i = 0; i < resourcesMaster.length; i++) {
        objResource = {};
        objResource.value = resourcesMaster[i].resourceID;
        objResource.label = resourcesMaster[i].resourceName;
        tmpDataResources.push(objResource);
      }
      setForm({...form, resourcesORG: tmpDataResources});
    }

    onFetchData();
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
      if (prevData && prevData != dataList) {
        if (typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value) {
          onPrepareCalendarData(dataList);
        }
      }
    }
  }, [loading, typeShow, prevData, dataList]);

  useEffect(() => {
    if (loading.changeType) {
      if (prevType && prevType !== typeShow) {
        onFetchData(form.fromDate, form.toDate, 1, form.search);
        return onDone({...loading, startFetch: true, main: true});
      }
    }
  }, [loading.changeType, prevType, typeShow, dataList]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top', 'bottom']}
      headerComponent={
        <CTopNavigation
          title="my_bookings:title"
          back
          searchFilter
          onSearch={handleSearch}
          renderFilter={(propsF, toggleFilter) =>
            <View style={propsF.style}>
              <Filter
                data={form}
                formatDate={formatDate}
                resourcesMaster={resourcesMaster}
                onFilter={(fromDate, toDate, resources, resourcesORG) =>
                  handleFilter(fromDate, toDate, resources, resourcesORG, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      <Layout
        style={[
          cStyles.row,
          cStyles.itemsCenter,
        ]}>
        <View style={styles.left} />
        <View style={styles.right}>
          <GroupTypeShow
            type={typeShow}
            onChange={handleChangeType}
          />
        </View>
      </Layout>
      {!loading.main &&
        typeShow === Commons.TYPE_SHOW_BOOKING.CALENDAR.value && (
          <CalendarProvider
            date={date.currentDate}
            showTodayButton
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChanged}>
            <ExpandableCalendar
              style={[cStyles.borderBottom, {borderBottomColor: theme['border-basic-color-3']}]}
              displayLoadingIndicator={
                loading.changeType || loading.startFetch
              }
              disableAllTouchEventsForDisabledDays
              firstDay={1}
              allowShadow={false}
              markingType={'multi-dot'}
              markedDates={marked}
              monthFormat={MONTH_FORMAT}
              enableSwipeMonths={false}
              theme={{
                ...THEME_CALENDAR,
                arrowColor: theme['text-hint-color'],
                calendarBackground: theme['background-basic-color-1'],
                textDayStyle: {color: theme['text-basic-color']},
                monthTextColor: theme['text-basic-color'],
                selectedDayBackgroundColor: theme['color-primary-500'],
              }}
            />
            <Timeline
              styles={{
                contentStyle: {
                  backgroundColor: theme['background-basic-color-3'],
                },
                line: {
                  backgroundColor: theme['outline-color'],
                },
              }}
              format24h
              scrollToFirst
              eventTapped={handleBookingItem}
              events={dataCalendar.filter(event =>
                sameDate(new XDate(event.start), new XDate(date.currentDate)),
              )}
            />
          </CalendarProvider>
        )}

      {!loading.main &&
        !loading.startFetch &&
        typeShow === Commons.TYPE_SHOW_BOOKING.LIST.value && (
          <BookingList
            navigation={navigation}
            refreshing={loading.refreshing}
            loadmore={loading.loadmore}
            isMyBooking
            data={dataList}
            onRefresh={onRefresh}
            onLoadmore={onLoadmore}
          />
        )}

      <CButtonAdd show={isPermissionWrite} onPress={handleAddNew} />
      <CLoading show={loading.main || loading.startFetch} />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  left: {flex: 0.7},
  right: {flex: 0.3},
});

export default MyBookings;
