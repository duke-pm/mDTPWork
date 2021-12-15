/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: AddBooking
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AddBooking.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  View,
  ScrollView,
  UIManager,
  LayoutAnimation,
  Text,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CGroupInfo from '~/components/CGroupInfo';
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
// import CCheckbox from '~/components/CCheckbox';
import CTouchable from '~/components/CTouchable';
import CActionSheet from '~/components/CActionSheet';
import CDateTimePicker from '~/components/CDateTimePicker';
import CAlert from '~/components/CAlert';
import CInvitedDetails from '~/components/CInvitedDetails';
import RowSelect from '../components/RowSelect';
import RowSelectTags from '../components/RowSelectTags';
/* COMMON */
import Routes from '~/navigation/Routes';
import FieldsAuth from '~/config/fieldsAuth';
import {Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {
  THEME_DARK,
  DATA_TIME_BOOKING,
  DEFAULT_FORMAT_DATE_3,
  LOGIN,
} from '~/config/constants';
import {
  alert,
  getSecretInfo,
  IS_ANDROID,
  moderateScale,
  resetRoute,
  SCREEN_WIDTH,
  verticalScale,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All ref */
const asResourceRef = createRef();
const asFromTimeRef = createRef();
const asToTimeRef = createRef();
const asParticipantRef = createRef();
let noteRef = createRef();

/** All init */
const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  NAME_BOOKING: 'label',
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
const TXT_AS_SIZE = moderateScale(18);
const MINIMUM_DATE = new Date(
  moment().year(),
  moment().month(),
  moment().date(),
);

function AddBooking(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;
  let bookingParam = route.params?.data || -1;
  if (bookingParam === -1) {
    bookingParam = route.params?.bookingID || -1;
  }
  let isFilterResourceParam = route.params?.isFilterByResource || false;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const bookingState = useSelector(({booking}) => booking);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
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
  const [participantInfo, setParticipantInfo] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState({
    status: false,
    active: null,
  });
  const [warning, setWarning] = useState({
    resource: {status: false, helper: ''},
    label: {status: false, helper: ''},
    fromDate: {status: false, helper: ''},
    fromTime: {status: false, helper: ''},
  });
  const [isDetail] = useState(
    route.params?.data || bookingParam !== -1 ? true : false,
  );
  const [participantChoose, setParticipantChoose] = useState(null);
  const [dataBooking, setDataBooking] = useState({
    id: '',
    label: '',
    resource: '',
    note: '',
    participants: [],
    fromDate: moment().format(formatDate),
    toDate: moment().format(formatDate),
    fromTime: DATA_TIME_BOOKING[0],
    toTime: DATA_TIME_BOOKING[1],
    status: true,
    isUpdated: false,
    oneTime: false,
  });
  const [dataResources, setDataResources] = useState([]);
  const [findResource, setFindResource] = useState('');
  const [resource, setResource] = useState(0);
  const [dataFromTime, setDataFromTime] = useState([]);
  const [fromTime, setFromTime] = useState(0);
  const [dataToTime, setDataToTime] = useState([]);
  const [toTime, setToTime] = useState(0);
  const [dataParticipants, setDataParticipants] = useState([]);
  const [findParticipant, setFindParticipant] = useState('');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleResource = () => asResourceRef.current?.show();

  const handleFromTime = () => asFromTimeRef.current?.show();

  const handleToTime = () => asToTimeRef.current?.show();

  const handleParticipants = () => asParticipantRef.current?.show();

  const handleDateInput = iName =>
    setShowPickerDate({active: iName, status: true});

  const handleChangeInput = inputRef => {
    if (inputRef) {
      inputRef.focus();
    }
  };

  const handleChangeText = (value, nameInput) => {
    setDataBooking({...dataBooking, [nameInput]: value});
  };

  const handleConfirmRemove = () => {
    alert(t, 'add_booking:holder_remove_booking', onSubmitRemove);
  };

  // const handleOneTime = () => {
  //   setDataBooking({...dataBooking, oneTime: !dataBooking.oneTime});
  // };

  const handleChangeResource = () => {
    let tmpResource = null;
    if (findResource === '') {
      tmpResource = dataResources[resource];
    } else {
      if (dataResources.length > 0) {
        tmpResource = dataResources[resource];
      }
    }
    if (tmpResource) {
      setDataBooking({
        ...dataBooking,
        resource: tmpResource.resourceID,
      });
    }
    asResourceRef.current?.hide();
  };

  const handleChangeFromTime = () => {
    setDataBooking({
      ...dataBooking,
      fromTime: DATA_TIME_BOOKING[fromTime],
    });
    asFromTimeRef.current?.hide();
  };

  const handleChangeToTime = () => {
    setDataBooking({
      ...dataBooking,
      toTime: DATA_TIME_BOOKING[toTime],
    });
    asToTimeRef.current?.hide();
  };

  const handleChangeParticipant = indexEmp => {
    let newParticipants = [...dataBooking.participants];
    let findUserOnActive = dataBooking.participants.findIndex(
      f => f.empID === dataParticipants[indexEmp].empID,
    );
    if (findUserOnActive !== -1) {
      newParticipants.splice(findUserOnActive, 1);
    } else {
      newParticipants.push(dataParticipants[indexEmp]);
    }
    setDataBooking({...dataBooking, participants: newParticipants});
    // asParticipantRef.current?.hide();
  };

  const handleRemoveParti = id => {
    let tmpDataBooking = {...dataBooking};
    let fParticipant = tmpDataBooking.participants.findIndex(
      f => f.empID === id,
    );
    if (fParticipant !== -1) {
      tmpDataBooking.participants.splice(fParticipant, 1);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDataBooking(tmpDataBooking);
    }
  };

  const handleParticipant = (participant = null, showAlert = false) => {
    setParticipantChoose(participant);
    setParticipantInfo(showAlert);
  };

  /**********
   ** FUNC **
   **********/
  const onChangeResource = index => setResource(index);

  const onChangeFromTime = index => setFromTime(index);

  const onChangeToTime = index => setToTime(index);

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);

  const onPrepareDetail = () => {
    let detail = route.params?.data;
    if (!detail) {
      detail = bookingState.get('bookingDetail');
    }
    if (detail) {
      /** Find participants */
      if (detail.lstUserJoined.length > 0) {
        let i;
        for (i = 0; i < detail.lstUserJoined.length; i++) {
          detail.lstUserJoined[i].empID = detail.lstUserJoined[i].userID;
          detail.lstUserJoined[i].empName = detail.lstUserJoined[i].fullName;
        }
      }

      /** Find idx resource */
      let tmpDataResources = masterState.get('bkReSource');
      let idxResource = tmpDataResources.findIndex(
        f => f.resourceID === detail.resourceID,
      );
      if (idxResource !== -1) {
        setResource(idxResource);
      }

      /** Find time start, end */
      let idxTime = DATA_TIME_BOOKING.findIndex(f => f === detail.strStartTime);
      if (idxTime !== -1) {
        setFromTime(idxTime);
      }
      idxTime = DATA_TIME_BOOKING.findIndex(f => f === detail.strEndTime);
      if (idxTime !== -1) {
        setToTime(idxTime);
      }

      let tmpParamsDetail = {
        id: detail.bookID,
        label: detail.purpose,
        resource: detail.resourceID,
        note: detail.remarks,
        participants: detail.lstUserJoined,
        oneTime: detail.isOneTimeBooking,
        fromDate: detail.startDate.split('T')[0],
        toDate: detail.endDate.split('T')[0],
        fromTime: detail.strStartTime,
        toTime: detail.strEndTime,
        status: true,
        isUpdated: detail.isUpdated,
      };
      setDataBooking(tmpParamsDetail);
    }
    return setLoading({...loading, main: false});
  };

  const onPrepareData = () => {
    let tmpDataResources = masterState.get('bkReSource');
    if (tmpDataResources.length > 0) {
      setDataResources(tmpDataResources);
      setDataFromTime(DATA_TIME_BOOKING);
      setDataToTime(DATA_TIME_BOOKING);
      setDataParticipants(masterState.get('users'));
      if (isDetail) {
        return onPrepareDetail();
      } else {
        let tmpDataBooking = {
          ...dataBooking,
          resource:
            tmpDataResources.length > 0 ? tmpDataResources[0].resourceID : '',
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
    let isValid = onValidate();
    if (!isValid) {
      return setLoading({...loading, submitAdd: false});
    }
    onSendRequest(TYPE.ADD);
  };

  const onSubmitUpdate = () => {
    setLoading({...loading, submitAdd: true});
    let isValid = onValidate();
    if (!isValid) {
      return setLoading({...loading, submitAdd: false});
    }
    onSendRequest(TYPE.UPDATE);
  };

  const onSearchResources = text => {
    if (text) {
      const newData = dataResources.filter(function (item) {
        const itemData = item.resourceName
          ? item.resourceName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataResources(newData);
      setFindResource(text);
      if (newData.length > 0) {
        setResource(0);
      }
    } else {
      setDataResources(masterState.get('bkReSource'));
      setFindResource(text);
      setResource(0);
    }
  };

  const onSearchParticipant = text => {
    if (text) {
      const newData = dataParticipants.filter(function (item) {
        const itemData = item.empName
          ? item.empName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataParticipants(newData);
      setFindParticipant(text);
    } else {
      setDataParticipants(masterState.get('users'));
      setFindParticipant(text);
    }
  };

  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate({...showPickerDate, status: showPicker});
    if (newDate && showPickerDate.active) {
      return setDataBooking({
        ...dataBooking,
        [showPickerDate.active]: moment(newDate).format(formatDate),
      });
    }
  };

  const onValidate = () => {
    let tmpWarning = {
      resource: {status: false, helper: ''},
      label: {status: false, helper: ''},
      fromDate: {status: false, helper: ''},
      fromTime: {status: false, helper: ''},
    };
    if (dataBooking.resource === '') {
      tmpWarning.resource = {
        status: true,
        helper: 'add_booking:warning_resource_empty',
      };
    }
    if (dataBooking.label === '') {
      tmpWarning.label = {
        status: true,
        helper: 'add_booking:warning_label_empty',
      };
    }
    let tmpStartDate = moment(dataBooking.fromDate, formatDate);
    let tmpEndDate = moment(dataBooking.toDate, formatDate);
    if (tmpStartDate.isAfter(tmpEndDate, 'date')) {
      tmpWarning.fromDate = {
        status: true,
        helper: 'add_booking:warning_start_date_bigger',
      };
    }
    if (
      tmpStartDate.isSame(tmpEndDate, 'date') &&
      dataBooking.fromTime === dataBooking.toTime
    ) {
      tmpWarning.fromTime = {
        status: true,
        helper: 'add_booking:warning_least_time',
      };
    }
    if (
      tmpStartDate.isSame(tmpEndDate, 'date') &&
      dataBooking.fromTime > dataBooking.toTime
    ) {
      tmpWarning.fromTime = {
        status: true,
        helper: 'add_booking:warning_start_time_bigger',
      };
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setWarning(tmpWarning);
    if (
      tmpWarning.resource.status ||
      tmpWarning.label.status ||
      tmpWarning.fromDate.status ||
      tmpWarning.fromTime.status
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onSendRequest = typeSubmit => {
    let tmpParti = [];
    if (dataBooking.participants.length > 0) {
      tmpParti = dataBooking.participants.map(i => i.empID);
    }

    /** prepare data */
    let params = {
      BookID: typeSubmit === TYPE.UPDATE ? dataBooking.id : 0,
      ResourceID: dataBooking.resource,
      Purpose: dataBooking.label,
      Remarks: dataBooking.note,
      IsOneTimeBooking: dataBooking.oneTime,
      StartDate: moment(dataBooking.fromDate).format(DEFAULT_FORMAT_DATE_3),
      StartTime: Number(dataBooking.fromTime.replace(':', '')),
      EndDate: moment(dataBooking.toDate).format(DEFAULT_FORMAT_DATE_3),
      EndTime: Number(dataBooking.toTime.replace(':', '')),
      ListParticipant: tmpParti.join(),
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

  const onSubmitRemove = () => {
    setLoading({...loading, submitRemove: true});
    let params = fromJS({
      BookID: isDetail ? dataBooking.id : -1,
    });
    return dispatch(Actions.fetchRemoveBooking(params, navigation));
  };

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(LOGIN);
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

  // useEffect(() => {
  //   if (loading.main) {
  //     if (!masterState.get('submitting')) {
  //       return onPrepareData();
  //     }
  //   }
  // }, [loading.main, masterState.get('submitting')]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        isDetail && dataBooking.isUpdated
          ? t('add_booking:title_update') + ` #${dataBooking.id}`
          : !isDetail
          ? t('add_booking:title_add')
          : t('add_booking:title') +
            ` #${
              typeof bookingParam === 'object'
                ? bookingParam.bookID
                : bookingParam
            }`,
    });
  }, [navigation, isDetail, dataBooking.isUpdated]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main || loading.submitAdd || loading.submitRemove}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_BOOKING}
      primaryColorShapesDark={colors.BG_HEADER_BOOKING_DARK}
      content={
        <KeyboardAwareScrollView>
          {/** Info booking */}
          <CGroupInfo
            style={cStyles.pt16}
            label={'add_booking:info_booking'}
            content={
              <>
                {/** Resources */}
                <View>
                  <CLabel bold label={'add_booking:resource'} />
                  <RowSelect
                    loading={loading.main}
                    disabled={
                      loading.main ||
                      (isDetail && !dataBooking.isUpdated) ||
                      isFilterResourceParam
                    }
                    isDark={isDark}
                    customColors={customColors}
                    data={dataResources}
                    error={warning.resource.status}
                    errorHelper={warning.resource.helper}
                    activeIndex={dataBooking.resource}
                    keyToShow={'resourceName'}
                    keyToCompare={'resourceID'}
                    onPress={handleResource}
                  />
                </View>

                {/** Purpose */}
                <CInput
                  containerStyle={cStyles.mt16}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.NAME_BOOKING}
                  label={'add_booking:label'}
                  holder={'add_booking:holder_label'}
                  value={dataBooking.label}
                  disabled={
                    loading.main || (isDetail && !dataBooking.isUpdated)
                  }
                  error={warning.label.status}
                  errorHelper={warning.label.helper}
                  onChangeInput={() => handleChangeInput(noteRef)}
                  onChangeValue={handleChangeText}
                />

                {/** Notes */}
                <CInput
                  inputRef={ref => (noteRef = ref)}
                  containerStyle={cStyles.mt16}
                  style={[
                    cStyles.flex1,
                    cStyles.itemsStart,
                    cStyles.fullHeight,
                    styles.input_multiline,
                  ]}
                  styleInput={cStyles.py3}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.NOTE_BOOKING}
                  label={'add_booking:note'}
                  caption={'common:optional'}
                  holder={'add_booking:holder_note'}
                  returnKey={'default'}
                  blurOnSubmit={false}
                  multiline
                  value={dataBooking.note}
                  disabled={
                    loading.main || (isDetail && !dataBooking.isUpdated)
                  }
                  onChangeValue={handleChangeText}
                />
              </>
            }
          />

          {/** Other info booking */}
          <CGroupInfo
            style={cStyles.pt16}
            label={'add_booking:other_info'}
            content={
              <>
                {/** Book one time */}
                {/* <CCheckbox
                  containerStyle={cStyles.pt0}
                  textStyle={[cStyles.textBody, {color: customColors.text}]}
                  customColor={
                    dataBooking.oneTime ? customColors.green : customColors.icon
                  }
                  labelRight={'add_booking:one_time'}
                  disabled={
                    loading.main || (isDetail && !dataBooking.isUpdated)
                  }
                  value={dataBooking.oneTime}
                  onChange={handleOneTime}
                /> */}

                {/** From date time */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsEnd,
                    cStyles.justifyBetween,
                    cStyles.mt4,
                  ]}>
                  <CInput
                    containerStyle={[cStyles.mr5, styles.left]}
                    name={INPUT_NAME.FROM_DATE_TIME}
                    label={'add_booking:from_date_time'}
                    value={moment(dataBooking.fromDate).format(formatDateView)}
                    dateTimePicker
                    disabled={
                      loading.main || (isDetail && !dataBooking.isUpdated)
                    }
                    error={warning.fromDate.status}
                    iconLast={Icons.calendar}
                    iconLastColor={customColors.icon}
                    onPressIconLast={handleDateInput}
                  />
                  <View style={[cStyles.ml5, styles.right]}>
                    <RowSelect
                      loading={loading.main}
                      disabled={
                        loading.main || (isDetail && !dataBooking.isUpdated)
                      }
                      isDark={isDark}
                      customColors={customColors}
                      data={DATA_TIME_BOOKING}
                      error={warning.fromTime.status}
                      activeIndex={dataBooking.fromTime}
                      keyToShow={null}
                      keyToCompare={null}
                      onPress={handleFromTime}
                    />
                  </View>
                </View>
                {(warning.fromTime.status || warning.fromDate.status) && (
                  <>
                    {warning.fromDate.status && (
                      <View
                        style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                        <CIcon
                          name={Icons.alert}
                          color={'red'}
                          size={'smaller'}
                        />
                        <CText
                          styles={'textCaption1 colorRed pl6'}
                          label={warning.fromDate.helper}
                        />
                      </View>
                    )}
                    {warning.fromTime.status && (
                      <View
                        style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                        <CIcon
                          name={Icons.alert}
                          color={'red'}
                          size={'smaller'}
                        />
                        <CText
                          styles={'textCaption1 colorRed pl6'}
                          label={warning.fromTime.helper}
                        />
                      </View>
                    )}
                  </>
                )}

                {/** To date time */}
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.row,
                    cStyles.itemsEnd,
                    cStyles.justifyBetween,
                    cStyles.mt16,
                  ]}>
                  <CInput
                    containerStyle={[cStyles.mr5, styles.left]}
                    name={INPUT_NAME.TO_DATE_TIME}
                    label={'add_booking:to_date_time'}
                    value={moment(dataBooking.toDate).format(formatDateView)}
                    dateTimePicker
                    disabled={
                      loading.main || (isDetail && !dataBooking.isUpdated)
                    }
                    iconLast={Icons.calendar}
                    iconLastColor={customColors.icon}
                    onPressIconLast={handleDateInput}
                  />
                  <View style={[cStyles.ml5, styles.right]}>
                    <RowSelect
                      loading={loading.main}
                      disabled={
                        loading.main || (isDetail && !dataBooking.isUpdated)
                      }
                      isDark={isDark}
                      customColors={customColors}
                      data={DATA_TIME_BOOKING}
                      activeIndex={dataBooking.toTime}
                      keyToShow={null}
                      keyToCompare={null}
                      onPress={handleToTime}
                    />
                  </View>
                </View>

                {/** Participants */}
                <View style={cStyles.mt16}>
                  <CLabel bold label={'add_booking:participants'} />
                  <RowSelectTags
                    loading={loading.main}
                    disabled={
                      loading.main || (isDetail && !dataBooking.isUpdated)
                    }
                    isDark={isDark}
                    dataActive={dataBooking.participants}
                    onPressItem={isDetail ? handleParticipant : undefined}
                    onPressRemove={handleRemoveParti}
                    onPress={handleParticipants}
                  />
                </View>
              </>
            }
          />

          {((isDetail && dataBooking.isUpdated) || !isDetail) && (
            <CActionSheet
              headerChoose
              actionRef={asResourceRef}
              headerChooseTitle={'bookings:choose_resource'}
              onConfirm={handleChangeResource}>
              <View style={cStyles.px16}>
                <CInput
                  containerStyle={cStyles.my10}
                  styleFocus={styles.input_focus}
                  holder={'add_booking:holder_find_resource'}
                  returnKey={'search'}
                  icon={Icons.search}
                  value={findResource}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  onChangeValue={onSearchResources}
                />
                <Picker
                  style={[
                    styles.action,
                    cStyles.fullWidth,
                    cStyles.justifyCenter,
                  ]}
                  itemStyle={{
                    fontSize: TXT_AS_SIZE,
                    color: customColors.text,
                  }}
                  selectedValue={resource}
                  onValueChange={onChangeResource}>
                  {dataResources.length > 0 ? (
                    dataResources.map((value, i) => (
                      <Picker.Item
                        label={value.resourceName}
                        value={i}
                        key={value.resourceID}
                      />
                    ))
                  ) : (
                    <View style={[cStyles.center, styles.content_picker]}>
                      <CText
                        styles={'textCaption1'}
                        label={'add_booking:holder_empty_resource'}
                      />
                    </View>
                  )}
                </Picker>
              </View>
            </CActionSheet>
          )}

          {((isDetail && dataBooking.isUpdated) || !isDetail) && (
            <CActionSheet
              headerChoose
              headerChooseTitle={'add_booking:choose_from_time'}
              actionRef={asFromTimeRef}
              onConfirm={handleChangeFromTime}>
              <View style={cStyles.px16}>
                <Picker
                  style={[
                    styles.action,
                    cStyles.fullWidth,
                    cStyles.justifyCenter,
                  ]}
                  itemStyle={{
                    fontSize: TXT_AS_SIZE,
                    color: customColors.text,
                  }}
                  selectedValue={fromTime}
                  onValueChange={onChangeFromTime}>
                  {dataFromTime.length > 0 &&
                    dataFromTime.map((value, i) => (
                      <Picker.Item label={value} value={i} key={value} />
                    ))}
                </Picker>
              </View>
            </CActionSheet>
          )}

          {((isDetail && dataBooking.isUpdated) || !isDetail) && (
            <CActionSheet
              headerChoose
              headerChooseTitle={'add_booking:choose_to_time'}
              actionRef={asToTimeRef}
              onConfirm={handleChangeToTime}>
              <View style={cStyles.px16}>
                <Picker
                  style={[
                    styles.action,
                    cStyles.fullWidth,
                    cStyles.justifyCenter,
                  ]}
                  itemStyle={{
                    fontSize: TXT_AS_SIZE,
                    color: customColors.text,
                  }}
                  selectedValue={toTime}
                  onValueChange={onChangeToTime}>
                  {dataToTime.length > 0 &&
                    dataToTime.map((value, i) => (
                      <Picker.Item label={value} value={i} key={value} />
                    ))}
                </Picker>
              </View>
            </CActionSheet>
          )}

          {((isDetail && dataBooking.isUpdated) || !isDetail) && (
            <CActionSheet
              headerChoose
              headerChooseTitle={'add_booking:holder_participants'}
              actionRef={asParticipantRef}
              onConfirm={() => asParticipantRef.current?.hide()}>
              <View style={cStyles.px16}>
                <CInput
                  containerStyle={cStyles.my10}
                  styleFocus={styles.input_focus}
                  holder={'add_booking:holder_find_participant'}
                  returnKey={'search'}
                  icon={Icons.search}
                  value={findParticipant}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  onChangeValue={onSearchParticipant}
                />

                <View style={[cStyles.pb36, styles.con_parti_select]}>
                  <ScrollView style={cStyles.flex1}>
                    {dataParticipants.length > 0 &&
                      dataParticipants.map((value, i) => {
                        let find = dataBooking.participants.find(
                          f => f.empID === value.empID,
                        );
                        return (
                          <CTouchable
                            key={value.empID}
                            onPress={() => handleChangeParticipant(i)}>
                            <View
                              style={[
                                cStyles.row,
                                cStyles.itemsCenter,
                                cStyles.justifyBetween,
                                cStyles.px10,
                                styles.row_parti_select,
                              ]}>
                              <Text>
                                <Text
                                  style={[
                                    cStyles.textBody,
                                    {color: customColors.text},
                                  ]}>
                                  {value.empName}
                                </Text>
                                <Text
                                  style={[
                                    cStyles.textCaption1,
                                    {color: customColors.text},
                                  ]}>{` {${value.userName}}`}</Text>
                              </Text>
                              {find && (
                                <CIcon
                                  name={Icons.check}
                                  size={'smaller'}
                                  color={'blue'}
                                />
                              )}
                            </View>
                          </CTouchable>
                        );
                      })}
                  </ScrollView>
                </View>
              </View>
            </CActionSheet>
          )}

          {/** Date Picker */}
          <CDateTimePicker
            show={showPickerDate.status}
            minimumDate={MINIMUM_DATE}
            value={
              dataBooking[showPickerDate.active] === ''
                ? moment().format(formatDate)
                : dataBooking[showPickerDate.active]
            }
            onChangeDate={onChangeDateRequest}
          />

          {/** Participant Info */}
          <CAlert
            loading={participantChoose === null}
            show={participantInfo}
            contentStyle={cStyles.mt0}
            title={''}
            customContent={<CInvitedDetails participant={participantChoose} />}
            onClose={handleParticipant}
          />
        </KeyboardAwareScrollView>
      }
      footer={
        isDetail && dataBooking.isUpdated ? (
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEvenly,
              cStyles.px16,
            ]}>
            <CButton
              style={styles.button}
              block
              disabled={loading.main || loading.submitAdd}
              color={customColors.red}
              icon={Icons.remove}
              label={'add_booking:remove_booking'}
              onPress={handleConfirmRemove}
            />
            <CButton
              style={styles.button}
              block
              disabled={loading.main || loading.submitAdd}
              color={customColors.green}
              icon={Icons.save}
              label={'add_booking:update_booking'}
              onPress={onSubmitUpdate}
            />
          </View>
        ) : !isDetail ? (
          <View style={[cStyles.px16, cStyles.pb5]}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
              icon={Icons.addNew}
              label={'add_booking:create_booking'}
              onPress={onSubmitAdd}
            />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  left: {flex: 0.6},
  right: {flex: 0.4},
  action: {height: verticalScale(180)},
  content_picker: {height: '40%'},
  button: {width: moderateScale(150)},
  con_parti_select: {height: SCREEN_WIDTH},
  row_parti_select: {height: moderateScale(40)},
  input_multiline: {minHeight: verticalScale(100)},
});

export default AddBooking;
