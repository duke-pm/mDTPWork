/**
 ** Name: Bookings
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Bookings.js
 **/
import React, {useRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, Text} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import CCard from '~/components/CCard';
/* COMMON */
import Configs from '~/config';
import {colors, cStyles} from '~/utils/style';
import {Booking} from '~/utils/mockup';
import moment from 'moment';
import CText from '~/components/CText';
import {useTheme} from '@react-navigation/native';
import CIcon from '~/components/CIcon';
import {Icons} from '~/utils/common';
import CLabel from '~/components/CLabel';
import {moderateScale} from '~/utils/helper';
import CAvatar from '~/components/CAvatar';
/* REDUX */

const paddingTopParticipant = moderateScale(10);
const paddingParticipant = moderateScale(14);

function Bookings(props) {
  const {customColors} = useTheme();
  const {} = props;

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
    // setLoading({...loading, startFetch: true});
  }, []);

  /************
   ** RENDER **
   ************/
  console.log('[LOG] ===  ===> ', data);
  return (
    <CContainer
      loading={false}
      contentLoader={loading.main && loading.startFetch}
      content={
        <CContent scrollEnabled={false}>
          {!loading.main && !loading.startFetch && (
            <CList
              contentStyle={cStyles.pt10}
              data={data}
              item={({item, index}) => {
                let between = false;
                between = Configs.toDay.isBetween(
                  moment(item.fromDate, 'YYYY-MM-DD HH:mm'),
                  moment(item.toDate, 'YYYY-MM-DD HH:mm'),
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
                                        'YYYY-MM-DD HH:mm',
                                      ).format(formatDateView)}\n${moment(
                                        item.fromDate,
                                        'YYYY-MM-DD HH:mm',
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
                                        'YYYY-MM-DD HH:mm',
                                      ).format(formatDateView)}\n${moment(
                                        item.toDate,
                                        'YYYY-MM-DD HH:mm',
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
                              <CIcon name={Icons.resource} size={'small'} />
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
                              <CIcon name={Icons.usersJoin} size={'small'} />
                              <View>
                                {item.users.length > 0 && (
                                  <View
                                    style={[cStyles.row, cStyles.itemsCenter]}>
                                    {item.users.map((itemUser, indexUser) => {
                                      if (indexUser < 3) {
                                        return (
                                          <View
                                            style={[
                                              cStyles.rounded10,
                                              cStyles.p1,
                                              cStyles.abs,
                                              {
                                                top: -paddingTopParticipant,
                                                left:
                                                  (indexUser + 1) *
                                                  paddingParticipant,
                                                zIndex: indexUser + 1,
                                              },
                                            ]}>
                                            <CAvatar
                                              size={'vsmall'}
                                              label={itemUser}
                                            />
                                          </View>
                                        );
                                      }
                                      return null;
                                    })}
                                    {item.users.length > 3 && (
                                      <View
                                        style={[
                                          cStyles.abs,
                                          cStyles.p1,
                                          cStyles.rounded10,
                                          cStyles.center,
                                          styles.con_user_invite,
                                          {
                                            left: paddingParticipant * 4.5,
                                            backgroundColor:
                                              customColors.cardDisable,
                                          },
                                        ]}>
                                        <CText
                                          styles={'textCaption2'}
                                          customLabel={`+${
                                            item.users.length - 3
                                          }`}
                                        />
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>
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
});

export default Bookings;
