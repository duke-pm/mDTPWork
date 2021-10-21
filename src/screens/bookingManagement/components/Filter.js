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
import CText from '~/components/CText';
import CDateTimePicker from '~/components/CDateTimePicker';
import CIconButton from '~/components/CIconButton';
/* COMMON */
import {Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init avriables */
const PROP_ICON = {size: moderateScale(21)};
const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};

function Filter(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {onFilter = () => {}, onClose = () => {}} = props;

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
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleDateInput = iName =>
    setShowPickerDate({active: iName, status: true});

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== '' ? moment(data.fromDate, formatDate).valueOf() : null;
    let tmpToDate =
      data.toDate !== '' ? moment(data.toDate, formatDate).valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return onErrorValidation('error:from_date_larger_than_to_date');
    }
    return onFilter(data.fromDate, data.toDate);
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

  const onErrorValidation = messageKey => {
    return showMessage({
      message: t('common:app_name'),
      description: t(messageKey),
      type: 'warning',
      icon: 'warning',
    });
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (props.data) {
      let tmp = {
        fromDate: props.data.fromDate,
        toDate: props.data.toDate,
      };
      setData(tmp);
    }
  }, [props.data]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.pb40}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <CIconButton
          style={styles.icon}
          iconProps={PROP_ICON}
          iconName={Icons.close}
          iconColor={customColors.red}
          onPress={onClose}
        />
        <CText styles={'textSubheadline'} label={'common:filter'} />
        <CIconButton
          style={styles.icon}
          iconProps={PROP_ICON}
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
          <View style={styles.left}>
            <CLabel
              style={[cStyles.pt6, cStyles.textLeft]}
              bold
              label={'bookings:from_date'}
            />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.right]}
            style={styles.con_input_date}
            name={INPUT_NAME.FROM_DATE}
            hasRemove
            dateTimePicker
            value={
              data.fromDate === ''
                ? data.fromDate
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
          <View style={styles.left}>
            <CLabel
              style={[cStyles.pt6, cStyles.textLeft]}
              bold
              label={'bookings:to_date'}
            />
          </View>
          <CInput
            containerStyle={[cStyles.justifyEnd, styles.right]}
            style={styles.con_input_date}
            name={INPUT_NAME.TO_DATE}
            hasRemove
            dateTimePicker
            value={
              data.toDate === ''
                ? data.toDate
                : moment(data.toDate).format(formatDateView)
            }
            iconLast={Icons.calendar}
            iconLastColor={customColors.icon}
            onPressIconLast={handleDateInput}
            onPressRemoveValue={() => setData({...data, toDate: ''})}
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
  left: {flex: 0.3},
  right: {flex: 0.7},
  icon: {height: moderateScale(45), width: moderateScale(45)},
});

Filter.propTypes = {
  data: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Filter;
