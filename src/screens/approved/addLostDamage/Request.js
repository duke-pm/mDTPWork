/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Add new request lost damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import React, {createRef, useEffect, useState, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  View,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CCard from '~/components/CCard';
import CButton from '~/components/CButton';
import CActionSheet from '~/components/CActionSheet';
import CAlert from '~/components/CAlert';
import CLabel from '~/components/CLabel';
import CGroupInfo from '~/components/CGroupInfo';
import CActivityIndicator from '~/components/CActivityIndicator';
import CIcon from '~/components/CIcon';
import CTouchable from '~/components/CTouchable';
import RejectModal from '../components/RejectModal';
import CheckOption from '../components/CheckOption';
import Process from '../components/Process';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {
  IS_ANDROID,
  checkEmpty,
  moderateScale,
  verticalScale,
} from '~/utils/helper';
import {THEME_DARK, DEFAULT_FORMAT_DATE_4} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  ASSETID: 'assetID',
  REASON: 'reason',
  TYPE_UPDATE: 'typeUpdate',
  FILE: 'file',
};

/** All refs use in this screen */
const actionSheetAssetsRef = createRef();
let damageRef = createRef();
let lostRef = createRef();

const dataType = [
  {
    ref: damageRef,
    value: Commons.APPROVED_TYPE.DAMAGED.value,
    label: 'add_approved_lost_damaged:damage_assets',
  },
  {
    ref: lostRef,
    value: Commons.APPROVED_TYPE.LOST.value,
    label: 'add_approved_lost_damaged:lost_assets',
  },
];

const RowSelect = (
  t,
  loading,
  disabled,
  error,
  isDark,
  customColors,
  data,
  activeIndex,
  keyToShow,
  keyToCompare,
  onPress,
) => {
  let find = null;
  if (data) {
    find = data.find(f => f[keyToCompare] === activeIndex);
  }
  return (
    <>
      <CTouchable
        containerStyle={cStyles.mt6}
        disabled={disabled}
        onPress={onPress}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px10,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            error && {borderColor: customColors.red},
            disabled && {backgroundColor: customColors.cardDisable},
            styles.row_select,
          ]}>
          {!loading ? (
            <CText
              customLabel={
                find
                  ? find[keyToShow]
                  : t('add_approved_lost_damaged:holder_no_asset')
              }
            />
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
      {error && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
          <CIcon name={Icons.alert} size={'smaller'} color={'red'} />
          <CText
            customStyles={[
              cStyles.textCaption1,
              cStyles.fontRegular,
              cStyles.pl6,
              {color: customColors.red},
            ]}
            label={'error:assets_not_empty'}
          />
        </View>
      )}
    </>
  );
};

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState({
    main: false,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetail] = useState(route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
  const [assets, setAssets] = useState(0);
  const [findAssets, setFindAssets] = useState('');
  const [dataAssets, setDataAssets] = useState([]);
  const [form, setForm] = useState({
    dateRequest: moment().format(formatDate),
    reason: '',
    typeUpdate: Commons.APPROVED_TYPE.DAMAGED.value, // 2: Damage or 3: Lost
    assetID: '',
    file: null,
    fileBase64: '',
    id: '',
    personRequestId: '',
    name: '',
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
    status: 1,
    isAllowApproved: false,
  });
  const [error, setError] = useState({
    assets: {
      status: false,
      helper: '',
    },
    reason: {
      status: false,
      helper: '',
    },
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReject = () => setShowReject(!showReject);

  const handleApproved = () => setShowConfirm(!showConfirm);

  const handleChangeText = (value, nameInput) => {
    setForm({...form, reason: value});
    if (error.reason.status) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({
        ...error,
        reason: {
          status: false,
          helper: '',
        },
      });
    }
  };

  const handleChangeAssets = () => {
    let asset = null;
    if (findAssets === '') {
      let tmp = masterState.get('assetByUser');
      if (tmp.length > 0) {
        asset = tmp[assets];
      }
    } else {
      if (dataAssets.length > 0) {
        asset = dataAssets[assets];
      }
    }
    if (asset) {
      setForm({
        ...form,
        assetID: asset[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value],
      });
    }
    actionSheetAssetsRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = () => {
    let type = route.params?.type;
    if (type) {
      setForm({...form, typeUpdate: type});
    }

    let params = {
      EmpCode: authState.getIn(['login', 'empCode']),
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchAssetByUser(params));
    setLoading({...loading, main: true});
  };

  const onValidate = () => {
    let tmpError = error,
      status = true;
    if (form.assetID === '') {
      tmpError.assets.status = true;
      tmpError.assets.helper = 'error:assets_not_empty';
      status = false;
    }
    if (form.reason === '') {
      tmpError.reason.status = true;
      tmpError.reason.helper = 'error:reason_not_empty';
      status = false;
    }

    return {
      status,
      data: tmpError,
    };
  };

  const onSendRequest = () => {
    setLoading({...loading, submitAdd: true});
    let isValid = onValidate();
    if (isValid.status) {
      /** prepare assets */
      let formData = new FormData();
      formData.append('EmpCode', authState.getIn(['login', 'empCode']));
      formData.append('DeptCode', authState.getIn(['login', 'deptCode']));
      formData.append('RegionCode', authState.getIn(['login', 'regionCode']));
      formData.append('JobTitle', authState.getIn(['login', 'jobTitle']));
      formData.append('RequestDate', form.dateRequest);
      formData.append('Reasons', form.reason);
      formData.append(
        'TypeUpdate',
        form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
          ? 'Damage'
          : 'Lost',
      );
      formData.append('AssetID', form.assetID);
      formData.append('Lang', language);
      if (form.file) {
        formData.append('FileUpload', {
          uri: form.file.path,
          type: form.file.type,
          name: form.file.name,
        });
      }

      let params = {
        RefreshToken: refreshToken,
        Lang: language,
      };
      dispatch(Actions.fetchAddRequestLostDamage(params, formData, navigation));
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError(isValid.data);
      setLoading({...loading, submitAdd: false});
    }
  };

  const onPrepareDetail = () => {
    let tmp = {
      id: isDetail ? route.params?.data?.requestID : '',
      personRequestId: isDetail ? route.params?.data?.personRequestID : '',
      name: isDetail ? route.params?.data?.personRequest : '',
      dateRequest: isDetail
        ? moment(route.params?.data?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : moment().format(formatDate),
      department: isDetail ? route.params?.data?.deptCode : '',
      region: isDetail ? route.params?.data?.regionCode : '',
      assetID: isDetail ? route.params?.data?.assetID : '',
      reason: isDetail ? route.params?.data?.reason : '',
      typeUpdate: isDetail
        ? route.params?.data?.requestTypeID
        : Commons.APPROVED_TYPE.DAMAGED.value,
      status: isDetail ? route.params?.data?.statusID : 1,
      isAllowApproved: isDetail ? route.params?.data?.isAllowApproved : false,
      file: isDetail ? route.params?.data?.attachFiles : null,
    };
    if (route.params?.dataProcess) {
      let arrayProcess = route.params?.dataProcess;
      if (arrayProcess.length > 0) {
        setProcess(arrayProcess);
      }
    }
    setForm(tmp);
    setLoading({...loading, main: false});
  };

  const onApproved = () => {
    setLoading({...loading, submitApproved: true});
    let params = {
      RequestID: form.id,
      RequestTypeID: form.typeUpdate,
      PersonRequestID: form.personRequestId,
      Status: true,
      Reason: '',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchApprovedRequest(params, navigation));
  };

  const onReject = reason => {
    setLoading({...loading, submitReject: true});
    let params = {
      RequestID: form.id,
      RequestTypeID: form.typeUpdate,
      PersonRequestID: form.personRequestId,
      Status: false,
      Reason: reason,
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchRejectRequest(params, navigation));
  };

  const onSearchFilter = text => {
    if (text) {
      const newData = dataAssets.filter(function (item) {
        const itemData = item[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label]
          ? item[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label].toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataAssets(newData);
      setFindAssets(text);
      if (newData.length > 0) {
        setAssets(0);
      }
    } else {
      let tmp = masterState.get('assetByUser');
      setDataAssets(tmp);
      setFindAssets(text);
      if (tmp.length > 0) {
        setAssets(0);
      }
    }
  };

  const onChangeAssets = index => {
    setAssets(index);
  };

  const onCallbackType = newVal => {
    setForm({...form, typeUpdate: newVal});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    dispatch(Actions.resetStatusMasterData());
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (!masterState.get('submitting')) {
        if (masterState.get('success')) {
          if (isDetail) {
            onPrepareDetail();
          } else {
            setDataAssets(masterState.get('assetByUser'));
            let data = masterState.get('assetByUser');
            if (data && data.length > 0) {
              setForm({
                ...form,
                assetID: data[0][Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value],
              });
            }
            setLoading({...loading, main: false});
          }
        }
      }
    }
  }, [
    loading.main,
    masterState.get('assetByUser'),
    masterState.get('submitting'),
  ]);

  useEffect(() => {
    if (loading.submitAdd) {
      if (!approvedState.get('submittingAdd')) {
        if (approvedState.get('successAddRequest')) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('success:send_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorAddRequest')) {
          setLoading({...loading, submitAdd: false});
          showMessage({
            message: t('error:add_request_lost_damage'),
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitAdd,
    approvedState.get('submittingAdd'),
    approvedState.get('successAddRequest'),
    approvedState.get('errorAddRequest'),
  ]);

  useEffect(() => {
    if (loading.submitApproved) {
      if (!approvedState.get('submittingApproved')) {
        if (approvedState.get('successApprovedRequest')) {
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:approved_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorApprovedRequest')) {
          setLoading({...loading, submitApproved: false});
          showMessage({
            message: t('common:app_name'),
            description: t('error:approved_request_lost_damage'),
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitApproved,
    approvedState.get('submittingApproved'),
    approvedState.get('successApprovedRequest'),
    approvedState.get('errorApprovedRequest'),
  ]);

  useEffect(() => {
    if (loading.submitReject) {
      if (!approvedState.get('submittingReject')) {
        setShowReject(false);
        if (approvedState.get('successRejectRequest')) {
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t('common:app_name'),
            description: t('success:reject_request'),
            type: 'success',
            icon: 'success',
          });
          navigation.goBack();
          if (route.params.onRefresh) {
            route.params.onRefresh();
          }
        }

        if (approvedState.get('errorRejectRequest')) {
          setLoading({...loading, submitReject: false});
          showMessage({
            message: t('common:app_name'),
            description: t('error:reject_request_lost_damage'),
            type: 'danger',
            icon: 'danger',
          });
        }
      }
    }
  }, [
    loading.submitReject,
    approvedState.get('submittingReject'),
    approvedState.get('successRejectRequest'),
    approvedState.get('errorRejectRequest'),
  ]);

  useLayoutEffect(() => {
    let title = '';
    if (!isDetail) {
      if (form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value) {
        title = t('add_approved_lost_damaged:title_damage');
      } else {
        title = t('add_approved_lost_damaged:title_lost');
      }
    } else {
      if (form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value) {
        title =
          t('add_approved_lost_damaged:detail_damage') +
          ' #' +
          route.params?.data?.requestID;
      } else {
        title =
          t('add_approved_lost_damaged:detail_lost') +
          ' #' +
          route.params?.data?.requestID;
      }
    }

    navigation.setOptions({title});
  }, [navigation, isDetail, form.typeUpdate]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  return (
    <CContainer
      loading={
        loading.main ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      content={
        <KeyboardAwareScrollView>
          {/** Process of request */}
          {isDetail && (
            <Process
              data={process}
              isDark={isDark}
              customColors={customColors}
              statusColor={route.params.currentProcess.statusColor}
              statusName={route.params.data.statusName}
              statusIcon={route.params.currentProcess.statusIcon}
              statusID={route.params.data.statusID}
            />
          )}

          {/** Date request */}
          <CGroupInfo
            style={cStyles.pt16}
            label={'add_approved_lost_damaged:info_other'}
            content={
              <CInput
                name={INPUT_NAME.DATE_REQUEST}
                label={'add_approved_lost_damaged:date_request'}
                disabled
                dateTimePicker
                value={moment(form.dateRequest).format(formatDateView)}
                valueColor={colors.BLACK}
              />
            }
          />

          <CGroupInfo
            label={'add_approved_lost_damaged:info_assets'}
            content={
              <>
                {/** Assets */}
                {!isDetail && (
                  <View>
                    <CLabel bold label={'add_approved_lost_damaged:assets'} />
                    {RowSelect(
                      t,
                      loading.main,
                      loading.main || loading.submitAdd || isDetail,
                      error.assets.status,
                      isDark,
                      customColors,
                      masterState.get('assetByUser'),
                      form.assetID,
                      Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label,
                      Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value,
                      () => actionSheetAssetsRef.current?.show(),
                    )}
                  </View>
                )}

                {/** Reason */}
                <View style={!isDetail ? cStyles.pt16 : undefined}>
                  <CInput
                    name={INPUT_NAME.REASON}
                    label={'add_approved_lost_damaged:reason'}
                    style={[cStyles.itemsStart, styles.input_multiline]}
                    styleFocus={styles.input_focus}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    holder={'add_approved_lost_damaged:holder_reason'}
                    value={form.reason}
                    returnKey={'done'}
                    multiline={true}
                    error={error.reason.status}
                    errorHelper={error.reason.helper}
                    onChangeInput={Keyboard.dismiss}
                    onChangeValue={handleChangeText}
                  />
                </View>

                {/** Type update */}
                <View
                  style={
                    isDetail
                      ? [cStyles.row, cStyles.itemsCenter, cStyles.mt16]
                      : cStyles.mt16
                  }>
                  <CLabel
                    bold
                    style={cStyles.pr16}
                    label={'add_approved_lost_damaged:type_update'}
                  />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail}
                    customColors={customColors}
                    value={form.typeUpdate}
                    values={dataType}
                    onCallback={onCallbackType}
                  />
                </View>
              </>
            }
          />

          {/** Assets for detail */}
          {isDetail && (
            <View style={[cStyles.itemsCenter, cStyles.pb16]}>
              <CCard
                containerStyle={[cStyles.rounded2, styles.box]}
                customLabel={route.params?.data?.assetName}
                content={
                  <>
                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                      ]}>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.justifyStart,
                          styles.left,
                        ]}>
                        <CLabel
                          label={
                            'add_approved_lost_damaged:purchase_date_asset'
                          }
                        />
                        <CLabel
                          customLabel={moment(
                            route.params?.data?.purchaseDate,
                            DEFAULT_FORMAT_DATE_4,
                          ).format(formatDateView)}
                        />
                      </View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.justifyStart,
                          styles.right,
                        ]}>
                        <CLabel
                          label={'add_approved_lost_damaged:type_asset'}
                        />
                        <CLabel
                          customLabel={route.params?.data?.assetTypeName}
                        />
                      </View>
                    </View>

                    <View
                      style={[
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                        cStyles.mt5,
                      ]}>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.justifyStart,
                          styles.left,
                        ]}>
                        <CLabel
                          label={'add_approved_lost_damaged:price_asset'}
                        />
                        <CLabel
                          customLabel={checkEmpty(
                            route.params?.data?.originalPrice,
                            null,
                            true,
                          )}
                        />
                      </View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.justifyStart,
                          styles.right,
                        ]}>
                        <CLabel
                          label={'add_approved_lost_damaged:status_asset'}
                        />
                        <CLabel
                          customLabel={route.params?.data?.assetStatusName}
                        />
                      </View>
                    </View>

                    <View
                      style={[cStyles.row, cStyles.justifyStart, cStyles.mt5]}>
                      <CLabel
                        label={'add_approved_lost_damaged:detail_asset'}
                      />
                      <CLabel
                        customLabel={checkEmpty(
                          route.params?.data?.descr,
                          t('common:empty_info'),
                        )}
                      />
                    </View>
                  </>
                }
              />
            </View>
          )}

          {/** MODAL */}
          {!isDetail && (
            <CActionSheet
              actionRef={actionSheetAssetsRef}
              headerChoose
              onConfirm={handleChangeAssets}>
              <View style={cStyles.px16}>
                {dataAssets.length > 0 && (
                  <CInput
                    containerStyle={cStyles.mb10}
                    styleFocus={styles.input_focus}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    holder={'add_approved_lost_damaged:search_assets'}
                    value={findAssets}
                    keyboard={'default'}
                    returnKey={'done'}
                    onChangeValue={onSearchFilter}
                  />
                )}
                {dataAssets.length > 0 ? (
                  <Picker
                    style={styles.con_action}
                    itemStyle={{
                      fontSize: moderateScale(21),
                      color: customColors.text,
                    }}
                    selectedValue={assets}
                    onValueChange={onChangeAssets}>
                    {dataAssets.map((value, i) => (
                      <Picker.Item
                        label={
                          value[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label]
                        }
                        value={i}
                        key={value}
                      />
                    ))}
                  </Picker>
                ) : (
                  <View style={[cStyles.center, styles.content_picker]}>
                    <CLabel
                      label={'add_approved_lost_damaged:holder_empty_assets'}
                    />
                  </View>
                )}
              </View>
            </CActionSheet>
          )}

          {isShowApprovedReject && (
            <RejectModal
              loading={loading.submitReject}
              showReject={showReject}
              description={
                form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
                  ? 'add_approved_lost_damaged:message_confirm_reject_damage'
                  : 'add_approved_lost_damaged:message_confirm_reject_lost'
              }
              onReject={onReject}
              onCloseReject={handleReject}
            />
          )}

          {isShowApprovedReject && (
            <CAlert
              loading={loading.submitApproved}
              show={showConfirm}
              content={
                form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value
                  ? 'add_approved_lost_damaged:message_confirm_approved_damage'
                  : 'add_approved_lost_damaged:message_confirm_approved_lost'
              }
              onClose={handleApproved}
              onOK={onApproved}
            />
          )}
        </KeyboardAwareScrollView>
      }
      footer={
        !isDetail ? (
          <View style={[cStyles.px16, cStyles.pb8]}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
              icon={Icons.send}
              label={'add_approved_lost_damaged:send'}
              onPress={onSendRequest}
            />
          </View>
        ) : isShowApprovedReject ? (
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEvenly,
              cStyles.px16,
            ]}>
            <CButton
              style={styles.button_approved}
              block
              color={customColors.red}
              disabled={loading.main}
              icon={Icons.close}
              label={'add_approved_lost_damaged:reject'}
              onPress={handleReject}
            />
            <CButton
              style={styles.button_reject}
              block
              color={customColors.green}
              disabled={loading.main}
              icon={Icons.check}
              label={'add_approved_lost_damaged:approved'}
              onPress={handleApproved}
            />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  button_approved: {width: moderateScale(150)},
  button_reject: {width: moderateScale(150)},
  left: {flex: 0.5},
  right: {flex: 0.5},
  con_action: {width: '100%', height: verticalScale(180)},
  content_picker: {height: '40%'},
  box: {width: moderateScale(350)},
  row_select: {
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
  },
  input_multiline: {height: verticalScale(100)},
});

export default AddRequest;
