/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Bookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Bookings.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {View, LayoutAnimation, UIManager} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useColorScheme} from 'react-native-appearance';
import {
  ExpandableCalendar,
  Timeline,
  CalendarProvider,
} from 'react-native-calendars';
import XDate from 'xdate';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CIconHeader from '~/components/CIconHeader';
import CActionSheet from '~/components/CActionSheet';
import BookingList from '../components/BookingList';
import Filter from '../components/Filter';
import FilterTags from '../components/FilterTags';
/* COMMON */
import Routes from '~/navigation/Routes';
import {Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {LOAD_MORE, REFRESH, THEME_DARK} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All refs */
const asFilterRef = createRef();

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
const MONTH_FORMAT = 'MMMM - yyyy';

function Bookings(props) {
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
  const masterState = useSelector(({masterData}) => masterData);
  const resourcesMaster = masterState.get('bkReSource');
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** All state */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [showSearchBar, setShowSearch] = useState(false);
  const [data, setData] = useState([]);
  const [dataCalendar, setDataCalendar] = useState([]);
  const [date, setDate] = useState({
    prevDate: null,
    currentDate: moment().format(formatDate),
  });
  const [marked, setMarked] = useState({});
  const [choosedReSrc, setChoosedReSrc] = useState({
    reSrc: {id: null, name: null},
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
  });
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
  const handleOpenFilter = () => asFilterRef.current?.show();

  const handleHideFilter = () => asFilterRef.current?.hide();

  const handleAddNew = () => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      isFilterByResource: choosedReSrc.reSrc.id,
      onRefresh: () => onRefresh(),
    });
  };

  const handleSearch = value => {
    setForm({...form, search: value, page: 1});
    onFetchData(form.fromDate, form.toDate, 1, value);
    return setLoading({...loading, startFetch: true});
  };

  const handleFilter = (fromDate, toDate, resources, resourcesORG) => {
    asFilterRef.current?.hide();
    setForm({...form, page: 1, fromDate, toDate, resources, resourcesORG});
    onFetchData(fromDate, toDate, 1, form.search, resources);
    return setLoading({...loading, startFetch: true});
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    if (form.search !== '') {
      handleSearch('');
    }
  };

  const handleChangeResource = (
    resourceID = -1,
    resourceName = '',
    fromDate = choosedReSrc.fromDate,
    toDate = choosedReSrc.toDate,
  ) => {
    onDone({...loading, startFetch: true});
    if (!choosedReSrc.reSrc.id) {
      setChoosedReSrc({
        ...choosedReSrc,
        reSrc: {id: resourceID, name: resourceName},
      });
    }
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      ResourceID: resourceID,
      PageNum: 1,
      PageSize: -1,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListBookingByReSrc(params, navigation));
  };

  const handleRemoveReSrc = () => {
    setChoosedReSrc({
      fromDate: moment().clone().startOf('month').format(formatDate),
      toDate: moment().clone().endOf('month').format(formatDate),
      reSrc: {id: null, name: null},
    });
    onFetchData();
  };

  const handleBookingItem = booking => {
    dispatch(Actions.resetBookingDetail());
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
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
    let params = fromJS({
      FromDate: fromDate,
      ToDate: toDate,
      PageNum: page,
      Search: search,
      ResourceID: resources,
      PageSize: perPage,
      IsMyBooking: false,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListBooking(params, navigation));
  };

  const onPrepareData = type => {
    let isLoadmore = true,
      cBookings = [...data],
      nBookings = bookingState.get('bookings');

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
    setData(cBookings);

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

    setChoosedReSrc({
      ...choosedReSrc,
      fromDate: tmpFromDate,
      toDate: tmpEndDate,
    });
    handleChangeResource(
      choosedReSrc.reSrc.id,
      choosedReSrc.reSrc.name,
      tmpFromDate,
      tmpEndDate,
    );
    return onDone({...loading, startFetch: true});
  };

  const onChangeReSrc = resource => {
    setChoosedReSrc({
      ...choosedReSrc,
      reSrc: {id: resource.resourceID, name: resource.resourceName},
    });
    handleChangeResource(
      resource.resourceID,
      resource.resourceName,
      choosedReSrc.fromDate,
      choosedReSrc.toDate,
    );
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
          if (choosedReSrc.reSrc.id) {
            let dataBookings = bookingState.get('bookings');
            return onPrepareCalendarData(dataBookings);
          } else {
            return onPrepareData(type);
          }
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: !choosedReSrc.reSrc.id,
              showRedDot: form.search !== '',
              icon: Icons.search,
              onPress: handleOpenSearch,
            },
            {
              show: !choosedReSrc.reSrc.id,
              showRedDot: false,
              icon: Icons.filter,
              onPress: handleOpenFilter,
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
  }, [navigation, choosedReSrc.reSrc.id, form.search, isPermissionWrite]);

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
          <CSearchBar
            loading={loading.startFetch}
            isVisible={showSearchBar}
            valueSearch={form.search}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />

          {/** All filter tag for current approved type */}
          <FilterTags
            customColors={customColors}
            translation={t}
            formatDateView={formatDateView}
            fromDate={form.fromDate}
            toDate={form.toDate}
            search={form.search}
            resourcesMaster={resourcesMaster}
            resource={choosedReSrc.reSrc}
            resources={
              resourcesMaster.length === form.resourcesORG.length
                ? 'all'
                : form.resourcesORG
            }
            primaryColor={colors.BG_MY_BOOKINGS}
            onChangeReSrc={onChangeReSrc}
            onPressRemoveReSrc={handleRemoveReSrc}
          />

          {!loading.main && !loading.startFetch && !choosedReSrc.reSrc.id && (
            <BookingList
              navigation={navigation}
              customColors={customColors}
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              isMyBooking={false}
              data={data}
              onRefresh={onRefresh}
              onLoadmore={onLoadmore}
              onPressResource={handleChangeResource}
            />
          )}

          {!loading.main && !loading.startFetch && choosedReSrc.reSrc.id && (
            <CalendarProvider
              date={date.currentDate}
              showTodayButton
              disabledOpacity={0.6}
              onDateChanged={onDateChanged}
              onMonthChange={onMonthChanged}>
              <ExpandableCalendar
                headerStyle={{backgroundColor: customColors.card}}
                displayLoadingIndicator={
                  loading.changeType || loading.startFetch
                }
                disableAllTouchEventsForDisabledDays
                firstDay={1}
                markingType={'multi-dot'}
                markedDates={marked}
                monthFormat={MONTH_FORMAT}
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
                  sameDate(new XDate(event.start), new XDate(date.currentDate)),
                )}
              />
            </CalendarProvider>
          )}

          <CActionSheet actionRef={asFilterRef}>
            <View style={[cStyles.px16, cStyles.pb16]}>
              <Filter
                data={form}
                onFilter={handleFilter}
                onClose={handleHideFilter}
              />
            </View>
          </CActionSheet>
        </CContent>
      }
    />
  );
}

export default Bookings;
