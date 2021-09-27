/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: AddBooking
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AddBooking.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet, View, UIManager, LayoutAnimation} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CGroupInfo from '~/components/CGroupInfo';
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CAvatar from '~/components/CAvatar';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
import CTouchable from '~/components/CTouchable';
import CActionSheet from '~/components/CActionSheet';
import CDateTimePicker from '~/components/CDateTimePicker';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Configs from '~/config';
import {Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK, DATA_TIME_BOOKING} from '~/config/constants';
import {
  checkEmpty,
  IS_ANDROID,
  moderateScale,
  verticalScale,
} from '~/utils/helper';
import {Booking} from '~/utils/mockup';
/* REDUX */
import * as Actions from '~/redux/actions';
import {showMessage} from 'react-native-flash-message';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RowSelect = React.memo(
  ({
    loading = false,
    disabled = false,
    isDark = false,
    customColors = {},
    data = [],
    activeIndex = -1,
    error = false,
    errorHelper = undefined,
    keyToShow = undefined,
    keyToCompare = undefined,
    onPress = () => null,
  }) => {
    let findRow = null;
    if (data && data.length > 0) {
      if (keyToCompare) {
        findRow = data.find(f => f[keyToCompare] === activeIndex);
      } else {
        findRow = data.find(f => f === activeIndex);
      }
    }
    return (
      <>
        <CTouchable
          containerStyle={[cStyles.mt6]}
          disabled={disabled}
          onPress={onPress}>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.px10,
              cStyles.rounded1,
              cStyles.borderAll,
              isDark && cStyles.borderAllDark,
              disabled && {backgroundColor: customColors.cardDisable},
              error && {borderColor: customColors.red},
              styles.row_select,
            ]}>
            {!loading ? (
              keyToShow ? (
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <View
                    style={[
                      styles.color_resource,
                      {backgroundColor: findRow.colorName},
                    ]}
                  />
                  <CText
                    styles={'pl10'}
                    customLabel={findRow ? checkEmpty(findRow[keyToShow]) : '-'}
                  />
                </View>
              ) : (
                <CText customLabel={findRow ? checkEmpty(findRow) : '-'} />
              )
            ) : (
              <CActivityIndicator />
            )}
            {!disabled && (
              <CIcon
                name={Icons.down}
                size={'medium'}
                customColor={
                  disabled ? customColors.textDisable : customColors.icon
                }
              />
            )}
          </View>
        </CTouchable>
        {error && errorHelper && (
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
            <CIcon name={Icons.alert} size={'smaller'} color={'red'} />
            <CText
              customStyles={[
                cStyles.pl6,
                cStyles.textCaption1,
                cStyles.fontRegular,
                {color: customColors.red},
              ]}
              label={errorHelper}
            />
          </View>
        )}
      </>
    );
  },
);

const RowSelectTags = React.memo(
  ({
    loading = false,
    disabled = false,
    isDark = false,
    customColors = {},
    dataActive = [],
    onPress = () => null,
  }) => {
    return (
      <CTouchable
        containerStyle={cStyles.mt6}
        disabled={disabled}
        onPress={onPress}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px10,
            cStyles.pb10,
            cStyles.borderDashed,
            cStyles.rounded1,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            disabled && {backgroundColor: customColors.cardDisable},
          ]}>
          {!loading ? (
            <View style={[cStyles.flexWrap, cStyles.row]}>
              {dataActive.length > 0 &&
                dataActive.map((item, index) => {
                  return (
                    <View
                      key={item.empID + index}
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.rounded1,
                        cStyles.px6,
                        cStyles.py6,
                        cStyles.mr6,
                        cStyles.mt10,
                        {backgroundColor: colors.STATUS_SCHEDULE_OPACITY},
                      ]}>
                      <CAvatar size={'vsmall'} label={item.empName} />
                      <CText
                        styles={'textCaption1 fontRegular pl6'}
                        customLabel={item.empName}
                      />
                    </View>
                  );
                })}

              {dataActive.length === 0 && (
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.row,
                    cStyles.center,
                    cStyles.pt10,
                  ]}>
                  <CText
                    styles={'textCaption1 fontRegular pl6 colorGreen'}
                    label={'add_booking:no_participants'}
                  />
                </View>
              )}
            </View>
          ) : (
            <CActivityIndicator />
          )}
        </View>
      </CTouchable>
    );
  },
);

/** All ref */
const asResourceRef = createRef();
const asFromTimeRef = createRef();
const asToTimeRef = createRef();
const asParticipantRef = createRef();
let noteRef = createRef();

/** All init */
const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  USER_REQUEST: 'createdUser',
  NAME_BOOKING: 'label',
  NOTE_BOOKING: 'note',
  PARTICIPANT: 'participants',
  FROM_DATE_TIME: 'fromDate',
  TO_DATE_TIME: 'toDate',
  RESOURCE: 'resource',
};
const TXT_AS_SIZE = moderateScale(18);

function AddBooking(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const bookingState = useSelector(({booking}) => booking);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** use states */
  const [loading, setLoading] = useState({
    main: true,
    submitAdd: false,
  });
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
  const [isDetail] = useState(route.params?.data ? true : false);
  const [dataBooking, setDataBooking] = useState({
    id: '',
    createdUser: authState.getIn(['login', 'fullName']),
    label: '',
    resource: '',
    note: '',
    participants: [],
    fromDate: Configs.toDay.format(formatDate),
    toDate: Configs.toDay.format(formatDate),
    fromTime: DATA_TIME_BOOKING[0],
    toTime: DATA_TIME_BOOKING[1],
    status: true,
  });
  const [dataResources, setDataResources] = useState([]);
  const [dataResourceColors, setDataResourceColors] = useState([]);
  const [findResource, setFindResource] = useState('');
  const [resource, setResource] = useState(0);
  const [dataFromTime, setDataFromTime] = useState([]);
  const [fromTime, setFromTime] = useState(0);
  const [dataToTime, setDataToTime] = useState([]);
  const [toTime, setToTime] = useState(0);
  const [dataParticipants, setDataParticipants] = useState([]);
  const [participant, setParticipant] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
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

  const handleChangeResource = () => {
    let tmpResource = null;
    if (findResource === '') {
      tmpResource = Booking.Resources[resource];
    } else {
      if (dataResources.length > 0) {
        tmpResource = dataResources[resource];
      }
    }
    if (tmpResource) {
      setDataBooking({
        ...dataBooking,
        resource: tmpResource.id,
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

  const handleChangeParticipant = () => {
    let chooseUser = dataParticipants[participant],
      newParticipants = [...dataBooking.participants];
    let findUserOnActive = dataBooking.participants.findIndex(
      f => f.empID === chooseUser.empID,
    );
    if (findUserOnActive !== -1) {
      newParticipants.splice(findUserOnActive, 1);
    } else {
      newParticipants.push(chooseUser);
    }
    setDataBooking({...dataBooking, participants: newParticipants});
    asParticipantRef.current?.hide();
  };

  const handleRemoveAllParti = () => {
    setDataBooking({...dataBooking, participants: []});
  };

  /**********
   ** FUNC **
   **********/
  const onChangeResource = index => setResource(index);

  const onChangeFromTime = index => setFromTime(index);

  const onChangeToTime = index => setToTime(index);

  const onChangeParticipant = index => setParticipant(index);

  const onPrepareDetail = () => {
    setLoading({...loading, main: false});
  };

  const onPrepareData = () => {
    if (isDetail) {
      onPrepareDetail();
    } else {
      setDataFromTime(DATA_TIME_BOOKING);
      setDataToTime(DATA_TIME_BOOKING);
      setDataParticipants(masterState.get('users'));
      setDataResourceColors(masterState.get('bkColor'));
      let tmpDataResources = masterState.get('bkReSource');
      setDataResources(tmpDataResources);
      let tmpDataBooking = {
        ...dataBooking,
        resource:
          tmpDataResources.length > 0 ? tmpDataResources[0].resourceID : '',
      };
      setDataBooking(tmpDataBooking);
      setLoading({...loading, main: false});
    }
  };

  const onSubmitAdd = () => {
    setLoading({...loading, submitAdd: true});
    let isValid = onValidate();
    if (!isValid) {
      return setLoading({...loading, submitAdd: false});
    }
    onSendRequest();
  };

  const onSearchResources = text => {
    if (text) {
      const newData = dataResources.filter(function (item) {
        const itemData = item.label
          ? item.label.toUpperCase()
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
      setDataResources(Booking.Resources);
      setFindResource(text);
      setResource(0);
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

  const onSendRequest = () => {
    let tmpParti = [];
    if (dataBooking.participants.length > 0) {
      tmpParti = dataBooking.participants.map(i => i.empID);
    }

    /** prepare data */
    let params = {
      BookID: isDetail ? dataBooking.id : 0,
      ResourceID: dataBooking.resource,
      Purpose: dataBooking.label,
      Remarks: dataBooking.note,
      StartDate: moment(dataBooking.fromDate).format('YYYY/MM/DD'),
      StartTime: Number(dataBooking.fromTime.replace(':', '')),
      EndDate: moment(dataBooking.toDate).format('YYYY/MM/DD'),
      EndTime: Number(dataBooking.toTime.replace(':', '')),
      ListParticipant: tmpParti.join(),
      Lang: language,
      RefreshToken: refreshToken,
    };
    // setLoading({...loading, submitAdd: false});
    // console.log('[LOG] === onSendRequest ===> ', params);
    dispatch(Actions.fetchAddBooking(params, navigation));
  };

  const onErrorAdd = helper => {
    setLoading({...loading, submitAdd: false});
    if (typeof helper === 'object' && helper.message) {
      showMessage({
        message: t('common:app_name'),
        description: helper.message,
        type: 'danger',
        icon: 'danger',
      });
    } else {
      showMessage({
        message: t('common:app_name'),
        description: helper,
        type: 'danger',
        icon: 'danger',
      });
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    dispatch(Actions.resetAllBooking());
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!bookingState.get('submittingAdd')) {
        if (bookingState.get('successAdd')) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:send_request_booking'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (bookingState.get('errorAdd')) {
          onErrorAdd(bookingState.get('errorHelperAdd'));
        }
      }
    }
  }, [
    loading.submitAdd,
    bookingState.get('submittingAdd'),
    bookingState.get('successAdd'),
    bookingState.get('errorAdd'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main || loading.submitAdd}
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
                    disabled={loading.main || loading.submitAdd || isDetail}
                    isDark={isDark}
                    customColors={customColors}
                    data={dataResources}
                    error={warning.resource.status}
                    errorHelper={warning.resource.helper}
                    activeIndex={dataBooking.resource}
                    keyToShow={'resourceName'}
                    keyToCompare={'resourceID'}
                    onPress={() => asResourceRef.current?.show()}
                  />
                </View>

                {/** Label */}
                <CInput
                  containerStyle={cStyles.mt16}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.NAME_BOOKING}
                  label={'add_booking:label'}
                  holder={'add_booking:holder_label'}
                  value={dataBooking.label}
                  disabled={loading.main || loading.submitAdd || isDetail}
                  error={warning.label.status}
                  errorHelper={warning.label.helper}
                  onChangeInput={() => handleChangeInput(noteRef)}
                  onChangeValue={handleChangeText}
                />

                {/** Notes */}
                <CInput
                  inputRef={ref => (noteRef = ref)}
                  containerStyle={cStyles.mt16}
                  style={[cStyles.itemsStart, styles.input_multiline]}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.NOTE_BOOKING}
                  label={'add_booking:note'}
                  caption={'common:optional'}
                  holder={'add_booking:holder_note'}
                  returnKey={'done'}
                  value={dataBooking.note}
                  multiline
                  disabled={loading.main || loading.submitAdd || isDetail}
                  onChangeValue={handleChangeText}
                />

                {/** From date time */}
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsEnd,
                    cStyles.justifyBetween,
                    cStyles.mt16,
                  ]}>
                  <CInput
                    containerStyle={[cStyles.mr5, styles.left]}
                    name={INPUT_NAME.FROM_DATE_TIME}
                    label={'add_booking:from_date_time'}
                    value={moment(dataBooking.fromDate).format(formatDateView)}
                    dateTimePicker
                    error={warning.fromDate.status}
                    iconLast={Icons.calendar}
                    iconLastColor={customColors.icon}
                    onPressIconLast={handleDateInput}
                  />
                  <View style={[cStyles.ml5, styles.right]}>
                    <RowSelect
                      loading={loading.main}
                      disabled={loading.main || loading.submitAdd || isDetail}
                      isDark={isDark}
                      customColors={customColors}
                      data={DATA_TIME_BOOKING}
                      error={warning.fromTime.status}
                      activeIndex={dataBooking.fromTime}
                      keyToShow={null}
                      keyToCompare={null}
                      onPress={() => asFromTimeRef.current?.show()}
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
                    iconLast={Icons.calendar}
                    iconLastColor={customColors.icon}
                    onPressIconLast={handleDateInput}
                  />
                  <View style={[cStyles.ml5, styles.right]}>
                    <RowSelect
                      loading={loading.main}
                      disabled={loading.main || loading.submitAdd || isDetail}
                      isDark={isDark}
                      customColors={customColors}
                      data={DATA_TIME_BOOKING}
                      activeIndex={dataBooking.toTime}
                      keyToShow={null}
                      keyToCompare={null}
                      onPress={() => asToTimeRef.current?.show()}
                    />
                  </View>
                </View>

                {/** Participants */}
                <View style={cStyles.mt16}>
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                    ]}>
                    <CLabel bold label={'add_booking:participants'} />
                    <CText
                      styles={'textCaption1 colorRed'}
                      label={'common:remove_all'}
                      disable={dataBooking.participants.length === 0}
                      onPress={handleRemoveAllParti}
                    />
                  </View>
                  <RowSelectTags
                    loading={loading.main}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    isDark={isDark}
                    customColors={customColors}
                    dataActive={dataBooking.participants}
                    onPress={() => asParticipantRef.current?.show()}
                  />
                </View>
              </>
            }
          />

          {!isDetail && (
            <CActionSheet
              headerChoose
              actionRef={asResourceRef}
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
                  style={[styles.action, cStyles.justifyCenter]}
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

          {!isDetail && (
            <CActionSheet
              headerChoose
              actionRef={asFromTimeRef}
              onConfirm={handleChangeFromTime}>
              <View style={cStyles.px16}>
                <Picker
                  style={[styles.action, cStyles.justifyCenter]}
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

          {!isDetail && (
            <CActionSheet
              headerChoose
              actionRef={asToTimeRef}
              onConfirm={handleChangeToTime}>
              <View style={cStyles.px16}>
                <Picker
                  style={[styles.action, cStyles.justifyCenter]}
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

          {!isDetail && (
            <CActionSheet
              headerChoose
              headerChooseTitle={'add_booking:holder_participants'}
              actionRef={asParticipantRef}
              onConfirm={handleChangeParticipant}>
              <View style={cStyles.px16}>
                <Picker
                  style={[styles.action, cStyles.justifyCenter]}
                  itemStyle={{
                    fontSize: TXT_AS_SIZE,
                    color: customColors.text,
                  }}
                  selectedValue={participant}
                  onValueChange={onChangeParticipant}>
                  {dataParticipants.length > 0 &&
                    dataParticipants.map((value, i) => {
                      let find = dataBooking.participants.find(
                        f => f.empID === value.empID,
                      );
                      return (
                        <Picker.Item
                          label={
                            find
                              ? value.empName + t('add_booking:choosed')
                              : value.empName
                          }
                          value={i}
                          key={value.empID}
                        />
                      );
                    })}
                </Picker>
              </View>
            </CActionSheet>
          )}

          {/** Date Picker */}
          <CDateTimePicker
            show={showPickerDate.status}
            value={
              dataBooking[showPickerDate.active] === ''
                ? Configs.toDay.format(formatDate)
                : dataBooking[showPickerDate.active]
            }
            onChangeDate={onChangeDateRequest}
          />
        </KeyboardAwareScrollView>
      }
      footer={
        <View style={[cStyles.px16, cStyles.pb5]}>
          <CButton
            block
            disabled={loading.main || loading.submitAdd}
            icon={Icons.addNew}
            label={'add_booking:create_booking'}
            onPress={onSubmitAdd}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  left: {flex: 0.6},
  right: {flex: 0.4},
  action: {width: '100%', height: verticalScale(180)},
  content_picker: {height: '40%'},
  row_select: {
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
  },
  color_resource: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: 4,
  },
  input_multiline: {height: verticalScale(100)},
});

export default AddBooking;
