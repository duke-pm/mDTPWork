/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Bookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Bookings.js
 **/
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
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
import {Icons} from '~/utils/common';
import Routes from '~/navigation/Routes';
import {Booking} from '~/utils/mockup';
import {DEFAULT_FORMAT_DATE_6} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All refs */
const asFilterRef = createRef();

function Bookings(props) {
  const {customColors} = useTheme();
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
  const [loading, setLoading] = useState({
    main: true,
    startFetch: true,
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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBookingItem = () => {};

  const handleOpenFilter = () => {
    asFilterRef.current?.show();
  };

  const handleHideFilter = () => {
    asFilterRef.current?.hide();
  };

  const handleAddNew = () => {
    navigation.navigate(Routes.MAIN.ADD_BOOKING.name);
  };

  const handleFilter = (fromDate, toDate, status, type) => {
    asFilterRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onFetchData = () => {
    let params = {};

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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onFetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
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
  }, [navigation, isPermissionWrite]);

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
          {!loading.main && !loading.startFetch && (
            <CList
              contentStyle={cStyles.pt10}
              data={data}
              item={({item, index}) => {
                let between = false;
                between = Configs.toDay.isBetween(
                  moment(item.fromDate, DEFAULT_FORMAT_DATE_6),
                  moment(item.toDate, DEFAULT_FORMAT_DATE_6),
                );

                return (
                  <CCard
                    key={index}
                    customLabel={`#${item.id} ${item.label}`}
                    onPress={handleBookingItem}
                    content={
                      <View style={cStyles.flex1}>
                        <View style={[cStyles.row, cStyles.itemsStart]}>
                          <View style={styles.left}>
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
                                        DEFAULT_FORMAT_DATE_6,
                                      ).format(formatDateView)}\n${moment(
                                        item.fromDate,
                                        DEFAULT_FORMAT_DATE_6,
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
                                        DEFAULT_FORMAT_DATE_6,
                                      ).format(formatDateView)}\n${moment(
                                        item.toDate,
                                        DEFAULT_FORMAT_DATE_6,
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

                          <View style={styles.right}>
                            <View style={[cStyles.row, cStyles.itemsCenter]}>
                              <CIcon name={Icons.resource} size={'smaller'} />
                              <CLabel
                                style={cStyles.pl3}
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

          <CActionSheet actionRef={asFilterRef}>
            <View style={cStyles.p16}>
              <Filter
                data={params}
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
});

export default Bookings;
