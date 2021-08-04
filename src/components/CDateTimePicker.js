/**
 ** Name: CDateTimePicker
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CDateTimePicker.js
 **/
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
/** COMMON */
import {THEME_DARK} from '~/config/constants';

function CDateTimePicker(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {show, value, mode = 'date', onChangeDate} = props;

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

export default CDateTimePicker;
