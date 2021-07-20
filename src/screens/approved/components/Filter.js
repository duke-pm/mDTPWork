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
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CButton from '~/components/CButton';
import CGroupFilter from '~/components/CGroupFilter';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import Icons from '~/config/icons';
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
  const {customColors} = useTheme();
  const {isResolve = false, onFilter = () => {}, onClose = () => {}} = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');

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
        type: 'danger',
        icon: 'danger',
      });
    } else if (data.status.length === 0) {
      return showMessage({
        message: t('common:app_name'),
        description: t('error:status_not_found'),
        type: 'danger',
        icon: 'danger',
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
        [showPickerDate.active]: moment(newDate).format(
          commonState.get('formatDate'),
        ),
      });
      setShowPickerDate({...showPickerDate, status: showPicker});
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
    <View
      style={[
        cStyles.rounded2,
        cStyles.mt10,
        {backgroundColor: customColors.card},
      ]}>
      {/** Show is visible */}
      <View>
        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <View style={styles.text_date}>
            <CText
              styles={'pt6 textLeft'}
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
                : moment(data.fromDate).format(
                    commonState.get('formatDateView'),
                  )
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
            <CText styles={'pt6 textLeft'} label={'approved_assets:to_date'} />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.input_date]}
            style={styles.con_input_date}
            hasRemove
            dateTimePicker
            value={
              data.toDate === ''
                ? ''
                : moment(data.toDate).format(commonState.get('formatDateView'))
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
            label={'common:type'}
            items={TYPES_ASSETS}
            itemsChoose={data.type}
            onChange={handleChangeType}
          />
        )}

        {!isResolve && (
          <CGroupFilter
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
            cStyles.mt10,
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
      </View>

      {/** Date Picker */}
      <CDateTimePicker
        show={showPickerDate.status}
        value={
          data[showPickerDate.active] === ''
            ? moment().format(commonState.get('formatDate'))
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
