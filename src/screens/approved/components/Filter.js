/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CButton from '~/components/CButton';
import CGroupFilter from '~/components/CGroupFilter';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import Icons from '~/config/Icons';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};
const TYPES_ASSETS = [
  {
    value: 1,
    label: 'list_request_assets_handling:title_add',
  },
  {
    value: 2,
    label: 'list_request_assets_handling:title_damaged',
  },
  {
    value: 3,
    label: 'list_request_assets_handling:title_lost',
  },
];
const STATUS_REQUEST = [
  {
    value: 1,
    label: 'approved_assets:status_wait',
  },
  {
    value: 2,
    label: 'approved_assets:status_approved_done',
  },
  {
    value: 4,
    label: 'approved_assets:status_reject',
  },
];

function Filter(props) {
  const {t} = useTranslation();
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
  const handleDateInput = inputName => {
    setShowPickerDate({
      active: inputName,
      status: true,
    });
  };

  const handleChangeType = typesChoose => {
    setData({...data, type: typesChoose});
  };

  const handleChangeStatus = statusChoose => {
    let tmp = statusChoose;
    let index = tmp.indexOf(2);
    if (index !== -1) {
      tmp.push(3);
    }
    setData({...data, status: tmp});
  };

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== '' ? moment(data.fromDate, formatDate).valueOf() : null;
    let tmpToDate =
      data.toDate !== '' ? moment(data.toDate, formatDate).valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return showMessage({
        message: t('common:app_name'),
        description: t('error:from_date_larger_than_to_date'),
        type: 'warning',
        icon: 'warning',
      });
    } else if (!isResolve && data.status.length === 0) {
      return showMessage({
        message: t('common:app_name'),
        description: t('error:status_not_found'),
        type: 'warning',
        icon: 'warning',
      });
    } else if (isResolve && data.type.length === 0) {
      return showMessage({
        message: t('common:app_name'),
        description: t('error:type_not_found'),
        type: 'warning',
        icon: 'warning',
      });
    } else {
      onFilter(
        data.fromDate,
        data.toDate,
        data.status.join(),
        data.type.join(),
        data.resolveRequest,
      );
    }
  };

  /**********
   ** FUNC **
   **********/
  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate({...showPickerDate, status: showPicker});
    if (newDate && showPickerDate.active) {
      setData({
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
    <View style={cStyles.pb16}>
      {/** Show is visible */}
      <>
        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <View style={styles.text_date}>
            <CLabel
              style={[cStyles.pt6, cStyles.textLeft]}
              bold
              label={'approved_assets:from_date'}
            />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.input_date]}
            style={styles.con_input_date}
            hasRemove
            dateTimePicker
            value={
              data.fromDate === ''
                ? ''
                : moment(data.fromDate).format(formatDateView)
            }
            valueColor={colors.TEXT_BASE}
            iconLast={Icons.calendar}
            iconLastColor={colors.ICON_BASE}
            onPressIconLast={() => handleDateInput(INPUT_NAME.FROM_DATE)}
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
            style={styles.con_input_date}
            hasRemove
            dateTimePicker
            value={
              data.toDate === ''
                ? ''
                : moment(data.toDate).format(formatDateView)
            }
            valueColor={colors.TEXT_BASE}
            iconLast={Icons.calendar}
            iconLastColor={colors.ICON_BASE}
            onPressIconLast={() => handleDateInput(INPUT_NAME.TO_DATE)}
            onPressRemoveValue={() => setData({...data, toDate: ''})}
          />
        </View>

        {isResolve && (
          <CGroupFilter
            row={true}
            label={'common:type'}
            items={TYPES_ASSETS}
            itemsChoose={data.type}
            onChange={handleChangeType}
          />
        )}

        {!isResolve && (
          <CGroupFilter
            row={true}
            label={'common:status'}
            items={STATUS_REQUEST}
            itemsChoose={data.status}
            onChange={handleChangeStatus}
          />
        )}

        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyCenter,
            cStyles.pt32,
          ]}>
          <CButton
            style={styles.button}
            variant={'outlined'}
            icon={Icons.close}
            label={'common:close'}
            onPress={onClose}
          />
          <CButton
            style={styles.button}
            label={'common:apply'}
            icon={Icons.filter}
            onPress={handleFilter}
          />
        </View>
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
  button: {width: moderateScale(110), marginHorizontal: moderateScale(10)},
});

export default Filter;
