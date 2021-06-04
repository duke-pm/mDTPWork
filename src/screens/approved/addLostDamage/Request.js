/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Add new request lost damage
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import React, {createRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  // Linking,
} from 'react-native';
import Lottie from 'lottie-react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CCard from '~/components/CCard';
import CButton from '~/components/CButton';
import CActionSheet from '~/components/CActionSheet';
import CRowLabel from '~/components/CRowLabel';
import CAlert from '~/components/CAlert';
// import CUploadImage from '~/components/CUploadImage';
import RejectModal from '../components/RejectModal';
import RequestProcess from '../components/RequestProcess';
import CheckOption from '../components/CheckOption';
/* COMMON */
import Animations from '~/utils/asset/Animations';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, alert, scalePx, IS_ANDROID, sH} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
// import API from '~/services/axios';
/* REDUX */
import * as Actions from '~/redux/actions';

const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  ASSETID: 'assetID',
  REASON: 'reason',
  TYPE_UPDATE: 'typeUpdate',
  FILE: 'file',
};

const actionSheetProcessRef = createRef();
const actionSheetAssetsRef = createRef();
let damageRef = createRef();
let lostRef = createRef();

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
  const Touchable = IS_ANDROID ? TouchableNativeFeedback : TouchableOpacity;
  let find = null;
  if (data) {
    find = data.find(f => f[keyToCompare] === activeIndex);
  }
  return (
    <View>
      <Touchable disabled={disabled} onPress={onPress}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px16,
            cStyles.mt6,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            error && {borderColor: customColors.red},
            disabled && {
              backgroundColor: customColors.cardDisable,
            },
            {height: 50},
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
            <Lottie
              style={styles.icon_loading}
              source={Animations.loading}
              autoPlay
              loop
            />
          )}
          {!disabled && (
            <Icon
              name={'chevron-down'}
              size={scalePx(3)}
              color={disabled ? customColors.textDisable : customColors.icon}
            />
          )}
        </View>
      </Touchable>
      {error && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
          <Icon
            name={'alert-circle'}
            color={customColors.red}
            size={scalePx(2)}
          />
          <CText
            customStyles={[
              cStyles.textMeta,
              cStyles.fontRegular,
              cStyles.pl6,
              {color: customColors.red},
            ]}
            label={'error:assets_not_empty'}
          />
        </View>
      )}
    </View>
  );
};

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState({
    main: false,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetail] = useState(props.route.params?.data ? true : false);
  const [process, setProcess] = useState([]);
  const [assets, setAssets] = useState(0);
  const [findAssets, setFindAssets] = useState('');
  const [dataAssets, setDataAssets] = useState([]);
  const [form, setForm] = useState({
    dateRequest: moment().format(commonState.get('formatDate')),
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

  /** HANDLE FUNC */
  const handleReject = () => setShowReject(!showReject);

  const handleApproved = () => setShowConfirm(!showConfirm);

  const handleShowProcess = () => actionSheetProcessRef.current?.show();

  const handleChangeText = (value, nameInput) => {
    setForm({...form, reason: value});
    if (error.reason.status) {
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

  // const handlePreview = () => {
  //   Linking.canOpenURL(
  //     API.defaults.baseURL.substring(0, API.defaults.baseURL.length - 3) + form.file
  //   ).then(supported => {
  //     if (supported) {
  //       Linking.openURL(API.defaults.baseURL.substring(0, API.defaults.baseURL.length - 3) + form.file);
  //     } else {
  //       showMessage({
  //         message: t('error:cannot_open_file_upload'),
  //         type: 'danger',
  //         icon: 'danger',
  //       });
  //     }
  //   });
  // };

  /** FUNC */
  const onPrepareData = () => {
    let type = props.route.params?.type;
    if (type) {
      setForm({...form, typeUpdate: type});
    }

    let params = {
      EmpCode: authState.getIn(['login', 'empCode']),
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
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
      formData.append('Lang', commonState.get('language'));
      if (form.file) {
        formData.append('FileUpload', {
          uri: form.file.path,
          type: form.file.type,
          name: form.file.name,
        });
      }

      let params = {
        RefreshToken: authState.getIn(['login', 'refreshToken']),
        Lang: commonState.get('language'),
      };
      dispatch(
        Actions.fetchAddRequestLostDamage(params, formData, props.navigation),
      );
    } else {
      setError(isValid.data);
      setLoading({...loading, submitAdd: false});
    }
  };

  const onPrepareDetail = () => {
    let tmp = {
      id: isDetail ? props.route.params?.data?.requestID : '',
      personRequestId: isDetail
        ? props.route.params?.data?.personRequestID
        : '',
      name: isDetail ? props.route.params?.data?.personRequest : '',
      dateRequest: isDetail
        ? moment(
            props.route.params?.data?.requestDate,
            'YYYY-MM-DDTHH:mm:ss',
          ).format(commonState.get('formatDate'))
        : moment().format(commonState.get('formatDate')),
      department: isDetail ? props.route.params?.data?.deptCode : '',
      region: isDetail ? props.route.params?.data?.regionCode : '',
      assetID: isDetail ? props.route.params?.data?.assetID : '',
      reason: isDetail ? props.route.params?.data?.reason : '',
      typeUpdate: isDetail
        ? props.route.params?.data?.requestTypeID
        : Commons.APPROVED_TYPE.DAMAGED.value,
      status: isDetail ? props.route.params?.data?.statusID : 1,
      isAllowApproved: isDetail
        ? props.route.params?.data?.isAllowApproved
        : false,
      file: isDetail ? props.route.params?.data?.attachFiles : null,
    };
    if (props.route.params?.dataProcess) {
      let arrayProcess = props.route.params?.dataProcess;
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
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchApprovedRequest(params, props.navigation));
  };

  const onReject = reason => {
    setLoading({...loading, submitReject: true});
    let params = {
      RequestID: form.id,
      RequestTypeID: form.typeUpdate,
      PersonRequestID: form.personRequestId,
      Status: false,
      Reason: reason,
      RefreshToken: authState.getIn(['login', 'refreshToken']),
      Lang: commonState.get('language'),
    };
    dispatch(Actions.fetchRejectRequest(params, props.navigation));
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

  /** LIFE CYCLE */
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
            console.log('[LOG] === useEffect ===> ', data);
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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
          props.navigation.goBack();
          if (props.route.params.onRefresh) {
            props.route.params.onRefresh();
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

  /** RENDER */
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && props.route.params?.permissionWrite;
  return (
    <CContainer
      loading={
        loading.main ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      header
      hasBack
      iconBack={'x'}
      title={'add_approved_lost_damaged:' + (isDetail ? 'detail' : 'title')}
      headerRight={
        isDetail ? (
          <TouchableOpacity
            style={cStyles.itemsEnd}
            onPress={handleShowProcess}>
            <Icon
              style={cStyles.p16}
              name={'info'}
              color={'white'}
              size={scalePx(3)}
            />
          </TouchableOpacity>
        ) : null
      }
      content={
        <CContent>
          <KeyboardAvoidingView
            style={cStyles.flex1}
            behavior={IS_IOS ? 'padding' : 'height'}
            keyboardVerticalOffset={120}>
            <ScrollView
              style={cStyles.flex1}
              contentContainerStyle={cStyles.justifyEnd}
              keyboardShouldPersistTaps={'handled'}>
              <CRowLabel label={t('add_approved_lost_damaged:info_other')} />
              <View
                style={[
                  cStyles.p16,
                  cStyles.borderTop,
                  cStyles.borderBottom,
                  isDark && cStyles.borderTopDark,
                  isDark && cStyles.borderBottomDark,
                  {backgroundColor: customColors.group},
                ]}>
                {/** Date request */}
                <View>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_lost_damaged:date_request'}
                  />
                  <CInput
                    name={INPUT_NAME.DATE_REQUEST}
                    disabled={true}
                    dateTimePicker={true}
                    value={moment(form.dateRequest).format(
                      commonState.get('formatDateView'),
                    )}
                    valueColor={colors.BLACK}
                  />
                </View>
              </View>

              <CRowLabel label={t('add_approved_lost_damaged:info_assets')} />
              <View
                style={[
                  cStyles.p16,
                  cStyles.borderTop,
                  cStyles.borderBottom,
                  isDark && cStyles.borderTopDark,
                  isDark && cStyles.borderBottomDark,
                  {backgroundColor: customColors.group},
                ]}>
                {/** Assets */}
                {!isDetail && (
                  <View>
                    <CText
                      styles={'textMeta fontMedium'}
                      label={'add_approved_lost_damaged:assets'}
                    />

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
                <View style={!isDetail ? cStyles.pt16 : {}}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_lost_damaged:reason'}
                  />
                  <CInput
                    name={INPUT_NAME.REASON}
                    styleFocus={styles.input_focus}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    holder={'add_approved_lost_damaged:holder_reason'}
                    value={form.reason}
                    valueColor={colors.BLACK}
                    keyboard={'default'}
                    returnKey={'done'}
                    multiline
                    textAlignVertical={'top'}
                    error={error.reason.status}
                    errorHelper={error.reason.helper}
                    onChangeInput={Keyboard.dismiss}
                    onChangeValue={handleChangeText}
                  />
                </View>

                {/** Type update */}
                <View style={cStyles.py16}>
                  <CText
                    styles={'textMeta fontMedium'}
                    label={'add_approved_lost_damaged:type_update'}
                  />
                  <CheckOption
                    loading={loading.main || loading.submitAdd}
                    isDetail={isDetail}
                    customColors={customColors}
                    value={form.typeUpdate}
                    values={[
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
                    ]}
                    onCallback={onCallbackType}
                  />
                </View>
              </View>

              {/** File upload */}
              {/* {!isDetail &&
                <CUploadImage
                  loading={loading.submitAdd}
                  file={{
                    data: form.file,
                    data64: form.fileBase64
                  }}
                  onChange={(data) => setForm({ ...form, ...data })}
                />
              } */}

              {/** File for detail */}
              {/* {isDetail && form.file &&
                <View style={[
                  cStyles.pt16,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween
                ]}>
                  <CText styles={'textTitle'} label={'add_approved_lost_damaged:file_upload'} />
                  <CButton
                    style={styles.button_preview}
                    label={'common:preview'}
                    icon={'eye'}
                    onPress={handlePreview}
                  />
                </View>
              } */}

              {/** Assets for detail */}
              {isDetail && (
                <CCard
                  containerStyle={[cStyles.mx16, cStyles.mb32]}
                  customLabel={props.route.params?.data?.assetName}
                  customColors={customColors}
                  isDark={isDark}
                  cardContent={
                    <View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyBetween,
                        ]}>
                        <View style={[cStyles.row, cStyles.justifyStart]}>
                          <CText
                            styles={'textMeta'}
                            label={
                              'add_approved_lost_damaged:purchase_date_asset'
                            }
                          />
                          <CText
                            styles={'textMeta fontBold'}
                            customLabel={moment(
                              props.route.params?.data?.purchaseDate,
                              'YYYY-MM-DDTHH:mm:ss',
                            ).format(commonState.get('formatDateView'))}
                          />
                        </View>
                        <View style={[cStyles.row, cStyles.justifyStart]}>
                          <CText
                            styles={'textMeta'}
                            label={'add_approved_lost_damaged:type_asset'}
                          />
                          <CText
                            styles={'textMeta fontBold'}
                            customLabel={
                              props.route.params?.data?.assetTypeName
                            }
                          />
                        </View>
                      </View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyBetween,
                        ]}>
                        <View style={[cStyles.row, cStyles.justifyStart]}>
                          <CText
                            styles={'textMeta'}
                            label={'add_approved_lost_damaged:price_asset'}
                          />
                          <CText
                            styles={'textMeta fontBold'}
                            customLabel={Number(
                              props.route.params?.data?.originalPrice,
                            ).format()}
                          />
                        </View>
                        <View style={[cStyles.row, cStyles.justifyStart]}>
                          <CText
                            styles={'textMeta'}
                            label={'add_approved_lost_damaged:status_asset'}
                          />
                          <CText
                            styles={'textMeta fontBold'}
                            customLabel={
                              props.route.params?.data?.assetStatusName
                            }
                          />
                        </View>
                      </View>
                      <View style={[cStyles.row, cStyles.justifyStart]}>
                        <CText
                          styles={'textMeta'}
                          label={'add_approved_lost_damaged:detail_asset'}
                        />
                        <CText
                          styles={'textMeta fontBold'}
                          customLabel={
                            props.route.params?.data?.descr !== ''
                              ? props.route.params?.data?.descr
                              : t('common:empty_info')
                          }
                        />
                      </View>
                    </View>
                  }
                />
              )}
              <View style={cStyles.flex1} />
            </ScrollView>
          </KeyboardAvoidingView>

          {isDetail && (
            <CActionSheet actionRef={actionSheetProcessRef}>
              <RequestProcess
                data={process}
                customColors={customColors}
                isDark={isDark}
              />
            </CActionSheet>
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
                    itemStyle={[styles.txt_picker, {color: customColors.text}]}
                    selectedValue={assets}
                    onValueChange={onChangeAssets}>
                    {dataAssets.map((value, i) => (
                      <Picker.Item
                        label={
                          value[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label]
                        }
                        value={i}
                        key={i}
                      />
                    ))}
                  </Picker>
                ) : (
                  <View style={[cStyles.center, styles.content_picker]}>
                    <CText
                      styles={'textMeta'}
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
              loading={loading.submitReject}
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
        </CContent>
      }
      footer={
        !isDetail ? (
          <View style={cStyles.px16}>
            <CButton
              block
              disabled={loading.main || loading.submitAdd}
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
              icon={'x-circle'}
              label={'add_approved_lost_damaged:reject'}
              onPress={handleReject}
            />
            <CButton
              style={styles.button_reject}
              block
              color={customColors.green}
              disabled={loading.main}
              icon={'check-circle'}
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
  input_focus: {
    borderColor: colors.SECONDARY,
  },
  button_approved: {width: cStyles.deviceWidth / 2.5},
  button_reject: {width: cStyles.deviceWidth / 2.5},
  button_preview: {width: 150},
  con_action: {width: '100%', height: sH('30%')},
  icon_loading: {width: 50, height: 50},
  content_picker: {height: '40%'},
  txt_picker: {fontSize: scalePx(3)},
});

export default AddRequest;
