/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CGroupFilter from '~/components/CGroupFilter';
import CDateTimePicker from '~/components/CDateTimePicker';
import CIconButton from '~/components/CIconButton';
import CText from '~/components/CText';
/* COMMON */
import {Commons, Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const PROPS_ICON = {size: moderateScale(21)};
const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};
const TYPES_ASSETS = [
  {
    value: Commons.APPROVED_TYPE.ASSETS.value,
    label: 'list_request_assets_handling:title_add',
  },
  {
    value: Commons.APPROVED_TYPE.DAMAGED.value,
    label: 'list_request_assets_handling:title_damaged',
  },
  {
    value: Commons.APPROVED_TYPE.LOST.value,
    label: 'list_request_assets_handling:title_lost',
  },
];
const STATUS_REQUEST = [
  {
    value: Commons.STATUS_REQUEST.WAIT.value,
    label: 'approved_assets:status_wait',
  },
  {
    value: Commons.STATUS_REQUEST.APPROVED.value,
    label: 'approved_assets:status_approved_done',
  },
  {
    value: Commons.STATUS_REQUEST.REJECT.value,
    label: 'approved_assets:status_reject',
  },
];

function Filter(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {isResolve = false, onFilter = () => {}, onClose = () => {}} = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');

  /** Use State */
  const [showPickerDate, setShowPickerDate] = useState({
    status: false,
    active: null,
  });
  const [data, setData] = useState({
    fromDate: props.data.fromDate,
    toDate: props.data.toDate,
    status: [1, 2, 3, 4],
    type: [1, 2, 3],
    resolveRequest: isResolve,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeType = typesChoose => setData({...data, type: typesChoose});

  const handleDateInput = iName =>
    setShowPickerDate({active: iName, status: true});

  const handleChangeStatus = statusChoose => {
    let tmp = statusChoose;
    let index = tmp.indexOf(2);
    if (index !== -1) {
      tmp.push(3);
    }
    return setData({...data, status: tmp});
  };

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== '' ? moment(data.fromDate, formatDate).valueOf() : null;
    let tmpToDate =
      data.toDate !== '' ? moment(data.toDate, formatDate).valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return onErrorValidation('error:from_date_larger_than_to_date');
    } else if (!isResolve && data.status.length === 0) {
      return onErrorValidation('error:status_not_found');
    } else if (isResolve && data.type.length === 0) {
      return onErrorValidation('error:type_not_found');
    } else {
      return onFilter(
        data.fromDate,
        data.toDate,
        data.status.join(),
        data.type.join(),
        data.resolveRequest,
      );
    }
  };

  const onErrorValidation = messageKey => {
    return showMessage({
      message: t('common:app_name'),
      description: t(messageKey),
      type: 'warning',
      icon: 'warning',
    });
  };

  /**********
   ** FUNC **
   **********/
  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate({...showPickerDate, status: showPicker});
    if (newDate && showPickerDate.active) {
      return setData({
        ...data,
        [showPickerDate.active]: moment(newDate).format(formatDate),
      });
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (props.data) {
      let tmp = {
        ...data,
        fromDate: props.data.fromDate,
        toDate: props.data.toDate,
        type: JSON.parse('[' + props.data.type + ']'),
      };
      if (props.data.status) {
        tmp.status = JSON.parse('[' + props.data.status + ']');
      }
      setData(tmp);
    }
  }, [props.data]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.pb20}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <CIconButton
          style={styles.icon}
          iconProps={PROPS_ICON}
          iconName={Icons.close}
          iconColor={customColors.red}
          onPress={onClose}
        />
        <CText styles={'textSubheadline'} label={'common:filter'} />
        <CIconButton
          style={styles.icon}
          iconProps={PROPS_ICON}
          iconName={Icons.doubleCheck}
          iconColor={customColors.primary}
          onPress={handleFilter}
        />
      </View>
      {/** Show is visible */}
      <>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.mt20,
          ]}>
          <View style={styles.text_date}>
            <CLabel
              style={[cStyles.pt6, cStyles.textLeft]}
              bold
              label={'approved_assets:from_date'}
            />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.input_date]}
            name={INPUT_NAME.FROM_DATE}
            hasRemove
            dateTimePicker
            value={
              data.fromDate === ''
                ? ''
                : moment(data.fromDate).format(formatDateView)
            }
            iconLast={Icons.calendar}
            iconLastColor={customColors.icon}
            onPressIconLast={handleDateInput}
            onPressRemoveValue={() => setData({...data, fromDate: ''})}
          />
        </View>

        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <View style={styles.text_date}>
            <CLabel
              style={[cStyles.pt6, cStyles.textLeft]}
              bold
              label={'approved_assets:to_date'}
            />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.input_date]}
            name={INPUT_NAME.TO_DATE}
            hasRemove
            dateTimePicker
            value={
              data.toDate === ''
                ? ''
                : moment(data.toDate).format(formatDateView)
            }
            iconLast={Icons.calendar}
            iconLastColor={customColors.icon}
            onPressIconLast={handleDateInput}
            onPressRemoveValue={() => setData({...data, toDate: ''})}
          />
        </View>

        {isResolve && (
          <CGroupFilter
            label={'common:type'}
            items={TYPES_ASSETS}
            itemsChoose={data.type}
            primaryColor={customColors.yellow2}
            onChange={handleChangeType}
          />
        )}

        {!isResolve && (
          <CGroupFilter
            label={'common:status'}
            items={STATUS_REQUEST}
            itemsChoose={data.status}
            primaryColor={customColors.yellow2}
            onChange={handleChangeStatus}
          />
        )}
      </>

      {/** Date Picker */}
      <CDateTimePicker
        show={showPickerDate.status}
        value={
          data[showPickerDate.active] === ''
            ? moment().format(formatDate)
            : data[showPickerDate.active]
        }
        onChangeDate={onChangeDateRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text_date: {flex: 0.3},
  input_date: {flex: 0.7},
  icon: {height: moderateScale(45), width: moderateScale(45)},
});

Filter.propTypes = {
  isResolve: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Filter;
