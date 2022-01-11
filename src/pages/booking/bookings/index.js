/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Bookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Bookings.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  ExpandableCalendar, Timeline, CalendarProvider,
} from 'react-native-calendars';
import {useTheme} from '@ui-kitten/components';
import XDate from 'xdate';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CLoading from '~/components/CLoading';
import CButtonAdd from '~/components/CButtonAdd';
import BookingList from '../components/BookingList';
import Filter from '../components/Filter';
/* COMMON */
import Routes from '~/navigator/Routes';
import {colors, cStyles} from '~/utils/style';
import {
  moderateScale,
  IS_ANDROID,
} from '~/utils/helper';
import {
  REFRESH,
  LOAD_MORE,
} from '~/configs/constants';
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

function Bookings(props) {
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
  const resourcesMaster = masterState["bkReSource"];
  const perPage = commonState["perPage"];
  const formatDate = commonState["formatDate"];
  const refreshToken = authState["login"]["refreshToken"];
  const language = commonState["language"];

  /** All state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [date, setDate] = useState({
    prevDate: null,
    currentDate: moment().format(formatDate),
  });
  const [dataList, setDataList] = useState([]);
  const [dataCalendar, setDataCalendar] = useState([]);
  const [choosedReSrc, setChoosedReSrc] = useState(null);
  const [marked, setMarked] = useState({});
  const [form, setForm] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    page: 1,
    search: '',
    resources: '',
    resourcesORG: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddNew = () => {
    navigation.navigate(Routes.ADD_BOOKING.name, {
      type: 'ADD',
      isFilterByResource: choosedReSrc,
      onRefresh: () => onRefresh(),
    });
  };

  const handleSearch = value => {
    setForm({...form, search: value, page: 1});
    onFetchData(form.fromDate, form.toDate, 1, value);
    return setLoading({...loading, startFetch: true});
  };

  const handleFilter = (fromDate, toDate, resources, resourcesORG, toggle) => {
    setChoosedReSrc(null);
    toggle();
    setForm({...form, page: 1, fromDate, toDate, resources, resourcesORG});
    onFetchData(fromDate, toDate, 1, form.search, resources);
    return setLoading({...loading, startFetch: true});
  };

  const handleChangeResource = (
    resourceID = -1,
    resourceName = '',
    fromDate = form.fromDate,
    toDate = form.toDate,
  ) => {
    onDone({...loading, startFetch: true});
    if (resourceID !== -1) {
      setChoosedReSrc(resourceID);
      setForm({
        ...form,
        resources: resourceID.toString(),
        fromDate: fromDate,
        toDate: toDate,
      });
    } else {
      setChoosedReSrc(null);
      setForm({...form, resources: ''});
    }
    let params = {
      FromDate: fromDate,
      ToDate: toDate,
      ResourceID: resourceID,
      PageNum: 1,
      PageSize: -1,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchListBookingByReSrc(params, navigation));
  };

  const handleBookingItem = booking => {
    dispatch(Actions.resetBookingDetail());
    navigation.navigate(Routes.ADD_BOOKING.name, {
      type: 'UPDATE',
      bookingID: booking.dataFull.bookID,
      onRefresh: () => onRefresh(),
    });
  };

  /**********
   ** FUNC **
   **********/
  const onDone = stateloading => setLoading(stateloading);

  const onFetchData = (
    fromDate = form.fromDate,
    toDate = form.toDate,
    page = 1,
    search = '',
    resources = '',
  ) => {
    let params = {
      FromDate: fromDate,
      ToDate: toDate,
      PageNum: page,
      Search: search,
      ResourceID: resources,
      PageSize: perPage,
      IsMyBooking: false,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchListBooking(params, navigation));
  };

  const onPrepareData = type => {
    let isLoadmore = true,
      cBookings = [...dataList],
      nBookings = bookingState["bookings"];

    // If count result < perPage => loadmore is unavailable
    if (nBookings.length < perPage) {
      isLoadmore = false;
    }

    if (type === REFRESH) {
      // Fetch is refresh
      cBookings = nBookings;
    } else if (type === LOAD_MORE) {
      // Fetch is loadmore
      cBookings = [...cBookings, ...nBookings];
    }
    setDataList(cBookings);

    return onDone({
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
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
      isLoadmore: true,
    });
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
      main: false,
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore: false,
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

    setForm({
      ...form,
      fromDate: tmpFromDate,
      toDate: tmpEndDate,
    });
    handleChangeResource(
      choosedReSrc,
      '',
      tmpFromDate,
      tmpEndDate,
    );
    return onDone({...loading, startFetch: true});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (resourcesMaster.length > 0) {
      let i,
        objResource = {},
        tmpDataResources = [],
        tmpDataResourcesID = resourcesMaster.map(item => item.resourceID);
      for (i = 0; i < resourcesMaster.length; i++) {
        objResource = {};
        objResource.value = resourcesMaster[i].resourceID;
        objResource.label = resourcesMaster[i].resourceName;
        tmpDataResources.push(objResource);
      }
      setForm({
        ...form,
        resourcesORG: tmpDataResources,
        resources: tmpDataResourcesID,
      });
    }

    onFetchData();
    return onDone({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!bookingState["submittingList"]) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (bookingState["successList"]) {
          if (choosedReSrc) {
            let dataBookings = bookingState["bookings"];
            return onPrepareCalendarData(dataBookings);
          } else {
            return onPrepareData(type);
          }
        }

        if (bookingState["errorList"]) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    bookingState["submittingList"],
    bookingState["successList"],
    bookingState["errorList"],
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top', 'bottom']}
      loading={loading.main}
      headerComponent={
        <CTopNavigation
          loading={loading.startFetch}
          title={'bookings:title'}
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
      {!loading.main && !loading.startFetch && !choosedReSrc && (
        <BookingList
          navigation={navigation}
          refreshing={loading.refreshing}
          loadmore={loading.loadmore}
          isMyBooking={false}
          data={dataList}
          onRefresh={onRefresh}
          onLoadmore={onLoadmore}
          onPressResource={handleChangeResource}
        />
      )}
      {!loading.main && !loading.startFetch && choosedReSrc && (
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
            allowShadow={false}
            firstDay={1}
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
              selectedDayBackgroundColor: theme['color-primary-500']
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
            eventTapped={handleBookingItem}
            events={dataCalendar.filter(event =>
              sameDate(new XDate(event.start), new XDate(date.currentDate)),
            )}
          />
        </CalendarProvider>
      )}
      <CButtonAdd show={isPermissionWrite} onPress={handleAddNew} />
      <CLoading show={loading.main || loading.startFetch} />
    </CContainer>
  );
}

export default Bookings;
