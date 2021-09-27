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
import {StyleSheet, View, Text, LayoutAnimation, UIManager} from 'react-native';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CSearchBar from '~/components/CSearchBar';
import CList from '~/components/CList';
import CText from '~/components/CText';
import CCard from '~/components/CCard';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CIconHeader from '~/components/CIconHeader';
import CActionSheet from '~/components/CActionSheet';
import Filter from '../components/Filter';
/* COMMON */
import Configs from '~/config';
import {Icons, Commons} from '~/utils/common';
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {LOAD_MORE, REFRESH} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All refs */
const asFilterRef = createRef();

function Bookings(props) {
  const {customColors} = useTheme();
  const {t} = useTranslation();
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
  const [loading, setLoading] = useState({
    main: true,
    startFetch: true,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [showSearchBar, setShowSearch] = useState(false);
  const [form, setForm] = useState({
    fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
    toDate: Configs.toDay.clone().endOf('month').format(formatDate),
    page: 1,
    search: '',
  });
  const [data, setData] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = () => {};

  const handleOpenFilter = () => asFilterRef.current?.show();

  const handleHideFilter = () => asFilterRef.current?.hide();

  const handleAddNew = () => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name, {
      onRefresh: () => onRefresh(),
    });
  };

  const handleSearch = value => {
    setForm({...form, search: value, page: 1});
    onFetchData(form.fromDate, form.toDate, 1, value);
    return setLoading({...loading, startFetch: true});
  };

  const handleFilter = (fromDate, toDate) => {
    asFilterRef.current?.hide();
    setForm({...form, page: 1, fromDate, toDate});
    onFetchData(fromDate, toDate, 1, form.search);
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

  /**********
   ** FUNC **
   **********/
  const onDone = stateloading => setLoading(stateloading);

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
      PageSize: perPage,
      IsMyBooking: false,
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onFetchData(form.fromDate, form.toDate, form.page, form.search);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: form.search !== '',
              icon: Icons.search,
              onPress: handleOpenSearch,
            },
            {
              show: true,
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
  }, [navigation, form.search, isPermissionWrite]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main}
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
          {!loading.main && !loading.startFetch && (
            <CList
              contentStyle={cStyles.pt10}
              data={data}
              item={({item, index}) => {
                let timeDate = {
                  startDate: item.strStartDateTime.split(' - ')[0],
                  startTime: item.strStartDateTime.split(' - ')[1],
                  endDate: item.strEndDateTime.split(' - ')[0],
                  endTime: item.strEndDateTime.split(' - ')[1],
                };

                return (
                  <CCard
                    key={index}
                    customLabel={`#${item.bookID} ${item.purpose}`}
                    onPress={handleBookingItem}
                    content={
                      <View style={cStyles.flex1}>
                        <View style={[cStyles.row, cStyles.itemsStart]}>
                          <View style={styles.left}>
                            <View style={[cStyles.row, cStyles.itemsCenter]}>
                              <CIcon
                                name={Icons.timeTask}
                                size={'smaller'}
                                color={
                                  item.statusHappend ===
                                  Commons.BOOKING_STATUS_HAPPEND.HAPPENNING
                                    .value
                                    ? Commons.BOOKING_STATUS_HAPPEND.HAPPENNING
                                        .color
                                    : item.statusHappend ===
                                      Commons.BOOKING_STATUS_HAPPEND.NOT_HAPPEND
                                        .value
                                    ? Commons.BOOKING_STATUS_HAPPEND.NOT_HAPPEND
                                        .color
                                    : Commons.BOOKING_STATUS_HAPPEND.HAPPENED
                                        .color
                                }
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
                                      {`${timeDate.startDate}\n${timeDate.startTime}`}
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
                                      {`${timeDate.endDate}\n${timeDate.endTime}`}
                                    </Text>
                                  </Text>
                                </View>
                                {item.statusHappend ===
                                  Commons.BOOKING_STATUS_HAPPEND.HAPPENNING
                                    .value && (
                                  <View
                                    style={[
                                      cStyles.itemsCenter,
                                      cStyles.rounded5,
                                      cStyles.py2,
                                      cStyles.px2,
                                      styles.live,
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

                          <View style={styles.right}>
                            <View style={[cStyles.row, cStyles.itemsCenter]}>
                              <CIcon
                                name={Icons.resource}
                                size={'smaller'}
                                customColor={item.color}
                              />
                              <CLabel
                                style={cStyles.pl3}
                                customLabel={item.resourceName}
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
                                customLabel={item.ownerName}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    }
                  />
                );
              }}
              refreshing={loading.refreshing}
              onRefresh={onRefresh}
              loadingmore={loading.loadmore}
              onLoadmore={onLoadmore}
            />
          )}

          <CActionSheet actionRef={asFilterRef}>
            <View style={cStyles.p16}>
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
  live: {backgroundColor: colors.STATUS_SCHEDULE_OPACITY},
});

export default Bookings;
