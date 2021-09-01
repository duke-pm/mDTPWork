/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Detail request lost damage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import {fromJS} from 'immutable';
import React, {createRef, useEffect, useState, useLayoutEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Picker from '@gregfrench/react-native-wheel-picker';
import {
  StyleSheet,
  View,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CCard from '~/components/CCard';
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
import FooterFormRequest from '../components/FooterFormRequest';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import FieldsAuth from '~/config/fieldsAuth';
import {Commons, Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK, DEFAULT_FORMAT_DATE_4, LOGIN} from '~/config/constants';
import {
  getSecretInfo,
  IS_ANDROID,
  checkEmpty,
  moderateScale,
  verticalScale,
  resetRoute,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RowSelect = (
  t = () => null,
  loading = false,
  disabled = false,
  error = false,
  isDark = false,
  customColors = {},
  data = [],
  activeIndex = -1,
  keyToShow = '',
  keyToCompare = '',
  onPress = () => null,
) => {
  let findRow = null;
  if (data && data.length > 0) {
    findRow = data.find(f => f[keyToCompare] === activeIndex);
  }
  return (
    <>
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
            cStyles.rounded1,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            error && {borderColor: customColors.red},
            disabled && {backgroundColor: customColors.cardDisable},
            styles.row_select,
          ]}>
          {!loading ? (
            <CText
              customLabel={
                findRow
                  ? findRow[keyToShow]
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
              cStyles.pl6,
              cStyles.textCaption1,
              cStyles.fontRegular,
              {color: customColors.red},
            ]}
            label={'error:assets_not_empty'}
          />
        </View>
      )}
    </>
  );
};

/** All refs*/
const asAssetsRef = createRef();
let damageRef = createRef();
let lostRef = createRef();

/** All init value */
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
const INPUT_NAME = {
  DATE_REQUEST: 'dateRequest',
  ASSETID: 'assetID',
  REASON: 'reason',
  TYPE_UPDATE: 'typeUpdate',
  FILE: 'file',
};

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation, route} = props;
  let requestParam = route.params?.data || -1;
  if (requestParam === -1) {
    requestParam = route.params?.requestID || -1;
  }

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
    startFetch: false,
    startFetchLogin: false,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showReject, setShowReject] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetail] = useState(route.params?.data ? true : false);
  const [requestDetail, setRequestDetail] = useState(null); // NOTE: just use for deep linking
  const [currentProcess, setCurrentProcess] = useState(null); // NOTE: just use for deep linking
  const [assets, setAssets] = useState(0);
  const [findAssets, setFindAssets] = useState('');
  const [dataAssets, setDataAssets] = useState([]);
  const [process, setProcess] = useState([]);
  const [form, setForm] = useState({
    dateRequest: Configs.toDay.format(formatDate),
    reason: '',
    typeUpdate: Commons.APPROVED_TYPE.DAMAGED.value, // 2: Damage, 3: Lost
    assetID: '',
    file: null,
    fileBase64: '',
    id: '',
    personRequestId: '',
    name: '',
    status: 1,
    isAllowApproved: false,
    department: authState.getIn(['login', 'deptCode']),
    region: authState.getIn(['login', 'regionCode']),
  });
  const [error, setError] = useState({
    assets: {status: false, helper: ''},
    reason: {status: false, helper: ''},
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
      setError({...error, reason: {status: false, helper: ''}});
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
    asAssetsRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onChangeAssets = index => setAssets(index);

  const onCallbackType = newVal => setForm({...form, typeUpdate: newVal});

  const onGoToSignIn = () =>
    resetRoute(navigation, Routes.AUTHENTICATION.SIGN_IN.name);

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

    return {status, data: tmpError};
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

      let params = {RefreshToken: refreshToken, Lang: language};
      dispatch(Actions.fetchAddRequestLostDamage(params, formData, navigation));
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError(isValid.data);
      setLoading({...loading, submitAdd: false});
    }
  };

  const onPrepareDetail = (dataRequest, dataProcess) => {
    let tmp = {
      id: dataRequest ? dataRequest?.requestID : '',
      personRequestId: dataRequest ? dataRequest?.personRequestID : '',
      name: dataRequest ? dataRequest?.personRequest : '',
      dateRequest: dataRequest
        ? moment(dataRequest?.requestDate, DEFAULT_FORMAT_DATE_4).format(
            formatDate,
          )
        : Configs.toDay.format(formatDate),
      department: dataRequest ? dataRequest?.deptCode : '',
      region: dataRequest ? dataRequest?.regionCode : '',
      assetID: dataRequest ? dataRequest?.assetID : '',
      reason: dataRequest ? dataRequest?.reason : '',
      typeUpdate: dataRequest
        ? dataRequest?.requestTypeID
        : Commons.APPROVED_TYPE.DAMAGED.value,
      status: dataRequest ? dataRequest?.statusID : 1,
      isAllowApproved: dataRequest ? dataRequest?.isAllowApproved : false,
      file: dataRequest ? dataRequest?.attachFiles : null,
    };
    if (dataProcess && dataProcess.length > 0) {
      setProcess(dataProcess);
    }
    setForm(tmp);
    setLoading({
      ...loading,
      main: false,
      startFetchLogin: false,
      startFetch: false,
    });
  };

  const onApproved = () => {
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
    setLoading({...loading, submitApproved: true});
  };

  const onReject = reason => {
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
    setLoading({...loading, submitReject: true});
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

  const onCheckLocalLogin = async () => {
    /** Check Data Login */
    let dataLogin = await getSecretInfo(LOGIN);
    if (dataLogin) {
      console.log('[LOG] === SignIn Local === ', dataLogin);
      let i,
        tmpDataLogin = {tokenInfo: {}, lstMenu: {}};
      for (i = 0; i < FieldsAuth.length; i++) {
        if (i === 0) {
          tmpDataLogin[FieldsAuth[i].key] = dataLogin[FieldsAuth[i].key];
        } else {
          tmpDataLogin.tokenInfo[FieldsAuth[i].key] =
            dataLogin[FieldsAuth[i].value];
        }
      }
      dispatch(Actions.loginSuccess(tmpDataLogin));
    } else {
      onGoToSignIn();
    }
  };

  const onFetchRequestDetail = requestID => {
    let params = fromJS({
      RequestID: requestID,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchRequestDetail(params, navigation));
    return setLoading({...loading, startFetch: true});
  };

  const onCheckDeeplink = () => {
    if (typeof requestParam === 'object' || requestParam === -1) {
      onPrepareData();
    } else {
      onFetchRequestDetail(requestParam);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    dispatch(Actions.resetStatusMasterData());
    let isLogin = authState.get('successLogin');
    if (isLogin) {
      onCheckDeeplink();
    } else {
      setLoading({...loading, startFetchLogin: true});
      onCheckLocalLogin();
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
      if (!approvedState.get('submittingRequestDetail')) {
        if (approvedState.get('successRequestDetail')) {
          return onPrepareData();
        }

        if (approvedState.get('errorRequestDetail')) {
          return onGoToSignIn();
        }
      }
    }
  }, [
    loading.startFetch,
    approvedState.get('submittingRequestDetail'),
    approvedState.get('successRequestDetail'),
    approvedState.get('errorRequestDetail'),
  ]);

  useEffect(() => {
    if (loading.main) {
      if (!masterState.get('submitting')) {
        if (masterState.get('success')) {
          if (approvedState.get('requestDetail')) {
            let statusIcon = Icons.request;
            let statusColor = 'orange';
            let tmp = approvedState.get('requestDetail');
            if (tmp.statusID === Commons.STATUS_REQUEST.APPROVED.value) {
              statusIcon = Icons.requestApproved_1;
              statusColor = 'blue';
            } else if (tmp.statusID === Commons.STATUS_REQUEST.REJECT.value) {
              statusIcon = Icons.requestRejected;
              statusColor = 'red';
            } else if (tmp.statusID === Commons.STATUS_REQUEST.DONE.value) {
              statusIcon = Icons.requestApproved_2;
              statusColor = 'green';
            }
            setCurrentProcess({statusIcon, statusColor});
            setRequestDetail(tmp);
            onPrepareDetail(
              approvedState.get('requestDetail'),
              approvedState.get('requestProcessDetail'),
            );
          } else {
            if (isDetail) {
              onPrepareDetail(route.params?.data, route.params?.dataProcess);
            } else {
              setDataAssets(masterState.get('assetByUser'));
              let data = masterState.get('assetByUser');
              if (data && data.length > 0) {
                setForm({
                  ...form,
                  assetID:
                    data[0][Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value],
                });
              }
              setLoading({...loading, main: false, startFetchLogin: false});
            }
          }
        }
      }
    }
  }, [
    loading.main,
    masterState.get('assetByUser'),
    masterState.get('submitting'),
    approvedState.get('requestDetail'),
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
    if (!isDetail && !requestDetail) {
      title = t('add_approved_lost_damaged:title');
    } else {
      let tmpID =
        isDetail && !requestDetail
          ? route.params?.data?.requestID
          : requestParam;
      if (form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.value) {
        title = t('add_approved_lost_damaged:detail_damage') + ' #' + tmpID;
      } else {
        title = t('add_approved_lost_damaged:detail_lost') + ' #' + tmpID;
      }
    }

    navigation.setOptions({title});
  }, [navigation, isDetail, form.typeUpdate, requestDetail]);

  /************
   ** RENDER **
   ************/
  const isShowApprovedReject =
    isDetail && form.isAllowApproved && route.params?.permissionWrite;
  return (
    <CContainer
      loading={
        loading.main ||
        loading.startFetch ||
        loading.startFetchLogin ||
        loading.submitAdd ||
        loading.submitApproved ||
        loading.submitReject
      }
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_APPROVED}
      primaryColorShapesDark={colors.BG_HEADER_APPROVED_DARK}
      content={
        <KeyboardAwareScrollView>
          {/** Process of request */}
          {isDetail && !currentProcess && (
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

          {!isDetail &&
            currentProcess &&
            typeof requestParam !== 'object' &&
            requestParam !== -1 && (
              <Process
                data={process}
                isDark={isDark}
                customColors={customColors}
                statusColor={currentProcess.statusColor}
                statusName={requestDetail.statusName}
                statusIcon={currentProcess.statusIcon}
                statusID={requestDetail.statusID}
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
                value={moment(form.dateRequest).format(formatDateView)}
                disabled
                dateTimePicker
              />
            }
          />

          {/** Info assets */}
          <CGroupInfo
            label={'add_approved_lost_damaged:info_assets'}
            content={
              <>
                {/** Assets */}
                {!isDetail && !requestDetail && (
                  <View>
                    <CLabel bold label={'add_approved_lost_damaged:assets'} />
                    {RowSelect(
                      t,
                      loading.main,
                      loading.main ||
                        loading.submitAdd ||
                        isDetail ||
                        requestDetail,
                      error.assets.status,
                      isDark,
                      customColors,
                      masterState.get('assetByUser'),
                      form.assetID,
                      Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label,
                      Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value,
                      () => asAssetsRef.current?.show(),
                    )}
                  </View>
                )}

                {/** Reason */}
                <CInput
                  containerStyle={
                    !isDetail && !requestDetail ? cStyles.mt16 : undefined
                  }
                  style={[cStyles.itemsStart, styles.input_multiline]}
                  styleFocus={styles.input_focus}
                  name={INPUT_NAME.REASON}
                  label={'add_approved_lost_damaged:reason'}
                  holder={'add_approved_lost_damaged:holder_reason'}
                  value={form.reason}
                  returnKey={'done'}
                  multiline
                  error={error.reason.status}
                  errorHelper={error.reason.helper}
                  disabled={
                    loading.main ||
                    loading.submitAdd ||
                    isDetail ||
                    requestDetail
                  }
                  onChangeInput={Keyboard.dismiss}
                  onChangeValue={handleChangeText}
                />

                {/** Type update */}
                <View
                  style={
                    isDetail || requestDetail
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
                    isDetail={isDetail || requestDetail}
                    customColors={customColors}
                    primaryColor={customColors.yellow}
                    value={form.typeUpdate}
                    values={dataType}
                    onCallback={onCallbackType}
                  />
                </View>
              </>
            }
          />

          {/** Assets for detail */}
          {(isDetail || requestDetail) && (
            <View style={[cStyles.itemsCenter, cStyles.pb16]}>
              <CCard
                containerStyle={[cStyles.rounded2, styles.box]}
                customLabel={
                  isDetail
                    ? route.params?.data?.assetName
                    : requestDetail.assetName
                }
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
                            isDetail
                              ? route.params?.data?.purchaseDate
                              : requestDetail.purchaseDate,
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
                          customLabel={
                            isDetail
                              ? route.params?.data?.assetTypeName
                              : requestDetail.assetTypeName
                          }
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
                            isDetail
                              ? route.params?.data?.originalPrice
                              : requestDetail.originalPrice,
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
                          customLabel={
                            isDetail
                              ? route.params?.data?.assetStatusName
                              : requestDetail.assetStatusName
                          }
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
                          isDetail
                            ? route.params?.data?.descr
                            : requestDetail.descr,
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
          {!isDetail && !requestDetail && (
            <CActionSheet
              headerChoose
              actionRef={asAssetsRef}
              onConfirm={handleChangeAssets}>
              <View style={cStyles.px16}>
                {dataAssets.length > 0 && (
                  <CInput
                    containerStyle={cStyles.mb10}
                    styleFocus={styles.input_focus}
                    holder={'add_approved_lost_damaged:search_assets'}
                    value={findAssets}
                    returnKey={'search'}
                    disabled={loading.main || loading.submitAdd}
                    onChangeValue={onSearchFilter}
                  />
                )}
                {dataAssets.length > 0 ? (
                  <Picker
                    style={styles.action}
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
        <FooterFormRequest
          loading={loading.main || loading.submitAdd}
          customColors={customColors}
          isDetail={isDetail || requestDetail}
          isApprovedReject={isShowApprovedReject}
          onAdd={onSendRequest}
          onReject={handleReject}
          onApproved={handleApproved}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  left: {flex: 0.5},
  right: {flex: 0.5},
  action: {width: '100%', height: verticalScale(180)},
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
