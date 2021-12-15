/**
 ** Name: CDateTimePicker
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CDateTimePicker.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
/** COMMON */
import {THEME_DARK} from '~/config/constants';

function CDateTimePicker(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    show = false,
    value = moment(),
    mode = 'date',
    onChangeDate = () => null,
  } = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangePicker = date => {
    onChangeDate(date, false);
  };

  const handleClosePicker = () => {
    onChangeDate(null, false);
  };

  /************
   ** RENDER **
   ************/
  return (
    <DateTimePickerModal
      isVisible={show}
      isDarkModeEnabled={isDark}
      locale={language}
      mode={mode}
      date={new Date(value)}
      cancelTextIOS={t('common:close')}
      confirmTextIOS={t('common:ok')}
      headerTextIOS={t('common:choose_date')}
      onConfirm={handleChangePicker}
      onCancel={handleClosePicker}
      {...props}
    />
  );
}

CDateTimePicker.propTypes = {
  show: PropTypes.object,
  value: PropTypes.object,
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  onChangeDate: PropTypes.func,
};

export default CDateTimePicker;
