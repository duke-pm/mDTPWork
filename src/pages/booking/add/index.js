/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: AddBooking
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AddBooking.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  Card, Select, SelectGroup, SelectItem, Avatar, IndexPath,
  Text,
} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CAlert from '~/components/CAlert';
import CStatus from '~/components/CStatus';
import CLoading from '~/components/CLoading';
/* COMMON */
import Routes from '~/navigator/Routes';
import FieldsAuth from '~/configs/fieldsAuth';
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {getSecretInfo, resetRoute} from '~/utils/helper';
import {
  DATA_TIME_BOOKING,
  DEFAULT_FORMAT_DATE_3,
  AST_LOGIN,
} from '~/configs/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

/** All init */
const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME_BOOKING: "s1",
  NOTE_BOOKING: 'note',
  PARTICIPANT: 'participants',
  FROM_DATE_TIME: 'fromDate',
  TO_DATE_TIME: 'toDate',
  RESOURCE: 'resource',
};
const TYPE = {
  ADD: 'ADD',
  UPDATE: 'UDPATE',
};

const RenderAvatar = props => (
  <Avatar size="tiny" source={Assets.iconUser} />
);

function AddBooking(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;
  let bookingParam = route.params?.data || -1;
  if (bookingParam === -1) {
    bookingParam = route.params?.bookingID || -1;
  }
  let isFilterResourceParam = route.params?.isFilterByResource || false;

  /** Use ref */
  const formRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const bookingState = useSelector(({booking}) => booking);
  const formatDate = commonState.get('formatDate');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** use states */
  const [loading, setLoading] = useState({
    main: true,
    startFetch: false,
    startFetchLogin: false,
    submitAdd: false,
    submitRemove: false,
  });
  const [showAlertRemove, setShowAlertRemove] = useState(false);
  const [isDetail] = useState(
    route.params?.data || bookingParam !== -1 ? true : false,
  );
  const [dataResources, setDataResources] = useState([]);
  const [dataParticipants, setDataParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [dataBooking, setDataBooking] = useState({
    id: '',
    label: '',
    resource: '',
    note: '',
    participants: [],
    fromDate: moment().format(formatDate),
    toDate: moment().format(formatDate),
    fromTime: '',
    toTime: '',
    statusID: -1,
    statusName: '',
    isUpdated: false,
    oneTime: false,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleRemove = () => setShowAlertRemove(!showAlertRemove);

  /**********
   ** FUNC **
   **********/
  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.LOGIN_IN.name);

  const onPrepareDetail = users => {
    let detail = route.params?.data;
    if (!detail) {
      detail = bookingState.get('bookingDetail');
    }
    if (detail) {
      /** Find participants */
      if (detail.lstUserJoined.length > 0) {
        let tmpSelectedParti = [...selectedParticipants],
          i, j;
        for (i of detail.lstUserJoined) {
          for (j = 0; j < users.length; j++) {
            let fUser = users[j].values.findIndex(f => f.empID === i.userID);
            if (fUser !== -1) {
              tmpSelectedParti.push(new IndexPath(fUser, j));
              break;
            }
          }
        }
        setSelectedParticipants(tmpSelectedParti);
      }

      /** Find time start, end */
      let idxFromTime = DATA_TIME_BOOKING.findIndex(f =>
        f.value === detail.strStartTime);
      let idxToTime = DATA_TIME_BOOKING.findIndex(f =>
        f.value === detail.strEndTime);

      let tmpParamsDetail = {
        id: detail.bookID,
        label: detail.purpose,
        resource: detail.resourceID,
        note: detail.remarks,
        participants: detail.lstUserJoined,
        oneTime: detail.isOneTimeBooking,
        fromDate: detail.startDate.split('T')[0],
        toDate: detail.endDate.split('T')[0],
        fromTime: idxFromTime !== -1 ? idxFromTime : '',
        toTime: idxToTime !== -1 ? idxToTime : '',
        statusID: detail.statusID,
        statusName: detail.statusName,
        isUpdated: detail.isUpdated,
      };
      setDataBooking(tmpParamsDetail);
    }
    return setLoading({...loading, main: false});
  };

  const onPrepareData = () => {
    let tmpDataResources = masterState.get('bkReSource'),
      tmpDataUsers = masterState.get('users');
    if (tmpDataResources.length > 0 && tmpDataUsers.length > 0) {
      setDataResources(tmpDataResources);
      tmpDataUsers = groupBy(tmpDataUsers, 'groupName');
      tmpDataUsers = Object.keys(tmpDataUsers).map((key) => {
        return {label: key, values: tmpDataUsers[key]};
      });
      setDataParticipants(tmpDataUsers);

      if (isDetail) {
        return onPrepareDetail(tmpDataUsers);
      } else {
        let tmpDataBooking = {
          ...dataBooking,
          resource: tmpDataResources.length > 0
              ? tmpDataResources[0].resourceID
              : '',
          statusID: bookingParam.statusID,
          statusName: bookingParam.statusName,
        };
        if (isFilterResourceParam) {
          tmpDataBooking.resource = isFilterResourceParam;
        }
        setDataBooking(tmpDataBooking);
        return setLoading({...loading, main: false, startFetchLogin: false});
      }
    } else {
      let params = {
        listType: 'BKIcon, BKColor, BKResource, Users',
        RefreshToken: refreshToken,
        Lang: language,
      };
      return dispatch(Actions.fetchMasterData(params, navigation));
    }
  };

  const onSubmitAdd = () => {
    setLoading({...loading, submitAdd: true});
    onSendRequest(TYPE.ADD);
  };

  const onSubmitUpdate = () => {
    setLoading({...loading, submitAdd: true});
    onSendRequest(TYPE.UPDATE);
  };

  const onSubmitRemove = () => {
    setLoading({...loading, submitRemove: true});
    let params = fromJS({
      BookID: isDetail ? dataBooking.id : -1,
    });
    dispatch(Actions.fetchRemoveBooking(params, navigation));
  };

  const onSendRequest = typeSubmit => {
    /** Set data to submit */
    let tmpCallback = formRef.current?.onCallbackValue();
    /** Set participants */
    let tmpParti = [], item = null;
    if (selectedParticipants.length > 0) {
      for (item of selectedParticipants) {
        tmpParti.push(dataParticipants[item.section]['values'][item.row]['empID']);
      }
      tmpParti = tmpParti.join();
    } else {
      tmpParti = '';
    }

    /** Prepare data before submit*/
    let params = {
      BookID: typeSubmit === TYPE.UPDATE ? dataBooking.id : 0,
      ResourceID: tmpCallback.valuesAll[0].values[tmpCallback.valuesAll[0].value]['resourceID'],
      Purpose: tmpCallback.valuesAll[1].value.trim(),
      Remarks: tmpCallback.valuesAll[2].value.trim(),
      IsOneTimeBooking: dataBooking.oneTime,
      StartDate: moment(tmpCallback.valuesAll[3].value.date).format(DEFAULT_FORMAT_DATE_3),
      StartTime: Number((DATA_TIME_BOOKING[tmpCallback.valuesAll[3].value.time])['value'].replace(':', '')),
      EndDate: moment(tmpCallback.valuesAll[4].value.date).format(DEFAULT_FORMAT_DATE_3),
      EndTime: Number((DATA_TIME_BOOKING[tmpCallback.valuesAll[4].value.time])['value'].replace(':', '')),
      ListParticipant: tmpParti,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchAddBooking(params, navigation));
  };

  const onError = helper => {
    setLoading({...loading, submitAdd: false});
    if (typeof helper === 'object' && helper.message) {
      return showMessage({
        message: t('common:app_name'),
        description: helper.message,
        type: 'danger',
        icon: 'danger',
      });
    } else {
      return showMessage({
        message: t('common:app_name'),
        description: helper,
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(AST_LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      let i,
        tmpDataLogin = {
          tokenInfo: {},
          lstMenu: {},
        };
      for (i = 0; i < FieldsAuth.length; i++) {
        if (i === 0) {
          tmpDataLogin[FieldsAuth[i].key] = dataLogin[FieldsAuth[i].key];
        } else {
          tmpDataLogin.tokenInfo[FieldsAuth[i].key] =
            dataLogin[FieldsAuth[i].value];
        }
      }
      return dispatch(Actions.loginSuccess(tmpDataLogin));
    } else {
      return onGoToSignIn();
    }
  };

  const onFetchBookingDetail = bookingID => {
    let params = fromJS({
      BookID: bookingID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchBookingDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onCheckDeeplink = () => {
    if (typeof bookingParam === 'object' || bookingParam === -1) {
      dispatch(Actions.resetAllBooking());
      return onPrepareData();
    } else {
      return onFetchBookingDetail(bookingParam);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      return onCheckDeeplink();
    } else {
      setLoading({...loading, startFetchLogin: true});
      return onCheckLocalLogin();
    }
  }, []);

  useEffect(() => {
    if (loading.startFetchLogin) {
      if (!authState.get('submitting')) {
        if (authState.get('successLogin')) {
          return onCheckDeeplink();
        }
        if (authState.get('errorLogin')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetchLogin,
    authState.get('submitting'),
    authState.get('successLogin'),
    authState.get('errorLogin'),
  ]);

  useEffect(() => {
    if (loading.startFetch) {
      if (!bookingState.get('submittingDetail')) {
        if (bookingState.get('successDetail')) {
          return onPrepareData();
        }

        if (bookingState.get('errorDetail')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetch,
    bookingState.get('submittingDetail'),
    bookingState.get('successDetail'),
    bookingState.get('errorDetail'),
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!bookingState.get('submittingAdd')) {
        if (bookingState.get('successAdd')) {
          setLoading({...loading, submitAdd: false});
          let msg = 'success:send_request_booking';
          if (isDetail) {
            msg = 'success:update_request_booking';
          }
          showMessage({
            message: t('common:app_name'),
            description: t(msg),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (bookingState.get('errorAdd')) {
          onError(bookingState.get('errorHelperAdd'));
        }
      }
    }
  }, [
    loading.submitAdd,
    bookingState.get('submittingAdd'),
    bookingState.get('successAdd'),
    bookingState.get('errorAdd'),
  ]);

  useEffect(() => {
    if (loading.submitRemove) {
      if (!bookingState.get('submittingRemove')) {
        if (bookingState.get('successRemove')) {
          setLoading({...loading, submitRemove: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:send_remove_booking'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (bookingState.get('errorRemove')) {
          onError(bookingState.get('errorHelperRemove'));
        }
      }
    }
  }, [
    loading.submitRemove,
    bookingState.get('submittingRemove'),
    bookingState.get('successRemove'),
    bookingState.get('errorRemove'),
  ]);

  /************
   ** RENDER **
   ************/
  let title = '';
  if (isDetail && dataBooking.isUpdated) {
    title = t('add_booking:title_update') + ` #${dataBooking.id}`;
  } else if (!isDetail) {
    title = 'add_booking:title_add';
  } else {
    title = t('add_booking:title') +
    ` #${
      typeof bookingParam === 'object'
        ? bookingParam.bookID
        : bookingParam
    }`;
  }
  let groupDisplayValues = [];
  if (selectedParticipants.length > 0) {
    groupDisplayValues = selectedParticipants.map(index => {
      const groupTitle = dataParticipants[index.section];
      return groupTitle.values[index.row]['empName'];
    });
  }
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={<CTopNavigation title={title} back />}>
      <KeyboardAwareScrollView contentContainerStyle={cStyles.p10}>
        {!loading.main && (
          <Card disabled
            header={propsH =>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, propsH.style]}>
                <View style={dataBooking ? styles.con_left : {}}>
                  <Text category="s1">{t('add_booking:info_booking')}</Text>
                </View>
                {isDetail && dataBooking && (
                  <View style={styles.con_right}>
                    <CStatus
                      type="booking"
                      value={dataBooking.statusID}
                      label={dataBooking.statusName}
                    />
                  </View>
                )}
              </View>
            }>
            <CForm
              ref={formRef}
              loading={
                loading.main ||
                loading.submitAdd ||
                loading.submitRemove
              }
              inputs={[
                {
                  id: INPUT_NAME.RESOURCE,
                  type: 'select',
                  label: 'add_booking:resource',
                  holder: 'add_booking:resource',
                  value: dataBooking.resource,
                  values: dataResources,
                  keyToCompare: 'resourceID',
                  keyToShow: 'resourceName',
                  disabled:
                    loading.main ||
                    (isDetail && !dataBooking.isUpdated) ||
                    isFilterResourceParam,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
                {
                  id: INPUT_NAME.NAME_BOOKING,
                  type: 'text',
                  label: 'add_booking:label',
                  holder: 'add_booking:holder_label',
                  value: dataBooking.label,
                  disabled: loading.main || (isDetail && !dataBooking.isUpdated),
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
                {
                  id: INPUT_NAME.NOTE_BOOKING,
                  type: 'text',
                  label: 'add_booking:note',
                  holder: 'add_booking:holder_note',
                  value: dataBooking.note,
                  disabled: loading.main || (isDetail && !dataBooking.isUpdated),
                  required: false,
                  multiline: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
                {
                  id: INPUT_NAME.FROM_DATE_TIME,
                  type: 'datePicker',
                  label: 'add_booking:from_date_time',
                  holder: 'add_booking:from_date_time',
                  timeLabel: 'add_booking:date_time',
                  min: moment(),
                  value: dataBooking.fromDate,
                  values: DATA_TIME_BOOKING,
                  timeValue: dataBooking.fromTime,
                  keyToCompare: 'value',
                  keyToShow: "label",
                  disabled: loading.main || (isDetail && !dataBooking.isUpdated),
                  chooseTime: true,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
                {
                  id: INPUT_NAME.TO_DATE_TIME,
                  type: 'datePicker',
                  label: 'add_booking:to_date_time',
                  holder: 'add_booking:to_date_time',
                  timeLabel: 'add_booking:date_time',
                  min: moment(),
                  value: dataBooking.toDate,
                  values: DATA_TIME_BOOKING,
                  timeValue: dataBooking.toTime,
                  keyToCompare: 'value',
                  keyToShow: "label",
                  disabled: loading.main || (isDetail && !dataBooking.isUpdated),
                  chooseTime: true,
                  required: true,
                  password: false,
                  email: false,
                  phone: false,
                  number: false,
                  next: true,
                  return: 'next',
                },
              ]}
              customAddingForm={
                <Select
                  style={cStyles.mt24}
                  multiSelect
                  disabled={
                    loading.main ||
                    loading.submitAdd ||
                    loading.submitRemove
                  }
                  label={t('add_booking:holder_participants')}
                  placeholder={t('add_booking:no_participants')}
                  value={groupDisplayValues.join(', ')}
                  selectedIndex={selectedParticipants}
                  onSelect={index => !isDetail ? setSelectedParticipants(index) : null}>
                  {dataParticipants.map((itemG, indexG) => {
                    return (
                      <SelectGroup key={itemG.label + '_' + indexG}
                        title={`${t('add_booking:group')} ${itemG.label}`}
                        disabled={isDetail}>
                        {itemG.values.map((itemI, indexI) => {
                          return (
                            <SelectItem key={itemI.userName + '_' + indexI}
                              title={propsT => (
                                <View style={[propsT.style, cStyles.row, cStyles.itemsCenter]}>
                                  {RenderAvatar()}
                                  <Text {...propsT}>{itemI.empName}</Text>
                                </View>
                              )}
                              disabled={isDetail}
                            />
                          );
                        })}
                      </SelectGroup>
                    );
                  })}
                </Select>
              }
              disabledButton={
                loading.main ||
                loading.submitAdd ||
                loading.submitRemove
              }
              statusButton2={'danger'}
              labelButton={(isDetail && dataBooking.isUpdated)
                ? 'add_booking:update_booking'
                : route.params?.type === TYPE.ADD
                  ? 'common:send'
                  : undefined}
              labelButton2={(isDetail && dataBooking.isUpdated)
                ? 'add_booking:remove_booking'
                : undefined}
              onSubmit={(isDetail && dataBooking.isUpdated)
                ? onSubmitUpdate
                : onSubmitAdd}
              onSubmit2={(isDetail && dataBooking.isUpdated)
                ? toggleRemove
                : undefined}
            />
          </Card>
        )}
      </KeyboardAwareScrollView>

      <CAlert
        show={showAlertRemove}
        label="add_booking:title_remove_booking"
        message="add_booking:holder_remove_booking"
        cancel
        statusOk='danger'
        textOk='add_booking:remove_booking_now'
        onCancel={toggleRemove}
        onBackdrop={toggleRemove}
        onOk={onSubmitRemove}
      />

      <CLoading show={loading.main || loading.submitAdd || loading.submitRemove} />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.7},
  con_right: {flex: 0.3},
});

export default AddBooking;
