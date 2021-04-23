/**
 ** Name: CDateTimePicker
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CDateTimePicker.js
 **/
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTranslation } from 'react-i18next';
/* COMPONENTS */

/* COMMON */

/* REDUX */


function CDateTimePicker(props) {
  const {
    show,
    value,
    onChangeDate,
  } = props;
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const languageState = useSelector(({ language }) => language.data);

  /** HANDLE FUNC */
  const handleChangePicker = (date) => {
    onChangeDate(date, false);
  };

  const handleClosePicker = () => {
    onChangeDate(null, false);
  };

  /** RENDER */
  return (
    <DateTimePickerModal
      isVisible={show}
      locale={languageState}
      mode={'date'}
      isDarkModeEnabled={colorScheme === 'dark'}
      date={new Date(value)}
      cancelTextIOS={t('common:close')}
      confirmTextIOS={t('common:ok')}
      headerTextIOS={t('common:choose_date')}
      onConfirm={handleChangePicker}
      onCancel={handleClosePicker}
    />
  );
};

export default CDateTimePicker;
