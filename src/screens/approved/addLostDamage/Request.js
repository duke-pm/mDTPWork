/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Add new request lost damage
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of RequestLostDamage.js
 **/
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  // Linking,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import ActionSheet from 'react-native-actions-sheet';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CDropdown from '~/components/CDropdown';
import CCard from '~/components/CCard';
import CButton from '~/components/CButton';
// import CUploadImage from '~/components/CUploadImage';
import RejectModal from '../components/RejectModal';
import RequestProcess from '../components/RequestProcess';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, alert, scalePx} from '~/utils/helper';
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

function AddRequest(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  let assetsRef = useRef();
  let reasonRef = useRef();

  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const approvedState = useSelector(({approved}) => approved);
  const authState = useSelector(({auth}) => auth);

  const [loading, setLoading] = useState({
    main: true,
    submitAdd: false,
    submitApproved: false,
    submitReject: false,
  });
  const [showPickerDate, setShowPickerDate] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isDetail, setIsDetail] = useState(
    props.route.params?.data ? true : false,
  );
  const [process, setProcess] = useState([]);
  const [form, setForm] = useState({
    dateRequest: moment().format(commonState.get('formatDate')),
    reason: '',
    typeUpdate: Commons.APPROVED_TYPE.DAMAGED.code, // 2: Damage or 3: Lost
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
  const handleDateInput = () => setShowPickerDate(true);

  const handleReject = () => setShowReject(true);

  const handleChooseTypeAssets = type => {
    if (type !== form.typeUpdate) {
      setForm({...form, typeUpdate: type});
    }
  };

  const handleCombobox = (data, field, nextField) => {
    if (field === INPUT_NAME.ASSETID) {
      setForm({
        ...form,
        assetID: data[Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value],
      });
      if (error.assets.status) {
        setError({
          ...error,
          assets: {status: false, helper: ''},
        });
      }
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const handleChangeText = (value, nameInput) => {
    if (nameInput === INPUT_NAME.REASON) {
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
    }
  };

  const handleApproved = () => {
    alert(
      t,
      form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.code
        ? 'add_approved_lost_damaged:message_confirm_approved_damage'
        : 'add_approved_lost_damaged:message_confirm_approved_lost',
      onApproved,
    );
  };

  const handleShowProcess = () => actionSheetProcessRef.current?.show();

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
  const onCloseReject = () => setShowReject(false);

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
        form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.code
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

  const onOpenCombobox = inputName => {
    switch (inputName) {
      case INPUT_NAME.ASSETID:
        Keyboard.dismiss();
        break;
    }
  };

  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate(showPicker);
    if (newDate) {
      setForm({
        ...form,
        dateRequest: moment(newDate).format(commonState.get('formatDate')),
      });
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
        : Commons.APPROVED_TYPE.DAMAGED.code,
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

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.main) {
      if (isDetail) {
        onPrepareDetail();
      } else {
        setLoading({...loading, main: false});
      }
    }
  }, [loading.main, masterState.get('department')]);

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
              contentContainerStyle={[cStyles.p16, cStyles.justifyEnd]}
              keyboardShouldPersistTaps={'handled'}>
              {/** Date request */}
              <View>
                <CText
                  styles={'textTitle'}
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
                  iconLast={'calendar'}
                  iconLastColor={colors.GRAY_700}
                  onPressIconLast={handleDateInput}
                />
              </View>

              {/** Assets */}
              {!isDetail && (
                <View style={[cStyles.pt16, IS_IOS && {zIndex: 10}]}>
                  <CText
                    styles={'textTitle'}
                    label={'add_approved_lost_damaged:assets'}
                  />
                  <CDropdown
                    loading={loading.main}
                    controller={instance => (assetsRef.current = instance)}
                    data={masterState.get('assetByUser')}
                    disabled={loading.main || isDetail}
                    searchable={true}
                    searchablePlaceholder={t(
                      'add_approved_lost_damaged:search_assets',
                    )}
                    error={error.assets.status}
                    errorHelper={error.assets.helper}
                    holder={'add_approved_lost_damaged:holder_assets'}
                    schema={{
                      label: Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.label,
                      value: Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.value,
                      icon: Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.icon,
                      hidden: Commons.SCHEMA_DROPDOWN.ASSETS_OF_USER.hidden,
                    }}
                    defaultValue={form.assetID}
                    onChangeItem={value =>
                      handleCombobox(value, INPUT_NAME.ASSETID, reasonRef)
                    }
                    onOpen={() => onOpenCombobox(INPUT_NAME.ASSETID)}
                  />
                </View>
              )}

              {/** Reason */}
              <View style={cStyles.pt16}>
                <CText
                  styles={'textTitle'}
                  label={'add_approved_lost_damaged:reason'}
                />
                <CInput
                  name={INPUT_NAME.REASON}
                  styleFocus={styles.input_focus}
                  inputRef={ref => (reasonRef = ref)}
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
              <View style={cStyles.pt16}>
                <CText
                  styles={'textTitle'}
                  label={'add_approved_lost_damaged:type_update'}
                />
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt10]}>
                  <TouchableOpacity
                    style={{flex: 0.4}}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseTypeAssets(2)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={
                          form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.code
                            ? 'check-circle'
                            : 'circle'
                        }
                        size={scalePx(3)}
                        color={
                          form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.code
                            ? colors.SECONDARY
                            : customColors.text
                        }
                      />
                      <CText
                        styles={'pl10'}
                        label={'add_approved_lost_damaged:damage_assets'}
                      />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{flex: 0.6}}
                    disabled={loading.main || loading.submitAdd || isDetail}
                    onPress={() => handleChooseTypeAssets(3)}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Icon
                        name={
                          form.typeUpdate === Commons.APPROVED_TYPE.LOST.code
                            ? 'check-circle'
                            : 'circle'
                        }
                        size={scalePx(3)}
                        color={
                          form.typeUpdate === Commons.APPROVED_TYPE.LOST.code
                            ? colors.SECONDARY
                            : customColors.text
                        }
                      />
                      <CText
                        styles={'pl10'}
                        label={'add_approved_lost_damaged:lost_assets'}
                      />
                    </View>
                  </TouchableOpacity>
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
                  label={'add_approved_lost_damaged:info_asset'}
                  customColors={customColors}
                  darkMode={isDark}
                  cardHeader={
                    <CText
                      styles={'textTitle'}
                      customLabel={props.route.params?.data?.assetName}
                    />
                  }
                  cardContent={
                    <View>
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
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyBetween,
                        ]}>
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
                    </View>
                  }
                />
              )}
              <View style={cStyles.flex1} />
            </ScrollView>
          </KeyboardAvoidingView>

          {isDetail && (
            <ActionSheet
              ref={actionSheetProcessRef}
              headerAlwaysVisible={true}
              elevation={2}
              indicatorColor={customColors.text}
              containerStyle={{backgroundColor: customColors.background}}
              gestureEnabled={true}
              defaultOverlayOpacity={isDark ? 0.8 : 0.5}>
              <RequestProcess
                data={process}
                customColors={customColors}
                isDark={isDark}
              />
            </ActionSheet>
          )}

          {/** MODAL */}
          <CDateTimePicker
            show={showPickerDate}
            value={form.dateRequest}
            onChangeDate={onChangeDateRequest}
          />

          <RejectModal
            loading={loading.submitReject}
            showReject={showReject}
            description={
              form.typeUpdate === Commons.APPROVED_TYPE.DAMAGED.code
                ? 'add_approved_lost_damaged:message_confirm_reject_damage'
                : 'add_approved_lost_damaged:message_confirm_reject_lost'
            }
            onReject={onReject}
            onCloseReject={onCloseReject}
          />
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
        ) : form.isAllowApproved ? (
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
              color={colors.RED}
              disabled={loading.main}
              icon={'x-circle'}
              label={'add_approved_lost_damaged:reject'}
              onPress={handleReject}
            />
            <CButton
              style={styles.button_reject}
              block
              color={colors.GREEN}
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
  con_time_process: {backgroundColor: colors.SECONDARY, flex: 0.3},
  button_preview: {width: 150},
});

export default AddRequest;
