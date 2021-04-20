/**
 ** Name: CCheckbox
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CCheckbox.js
 **/
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useTranslation } from 'react-i18next';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import { cStyles } from '~/utils/style';

function CCheckbox(props) {
  const {
    style,
    label,
    labelStyle,
    disabled,
    value,
    tintColors,
    onChange,
  } = props;
  const { t } = useTranslation();

  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.py16,
        style
      ]}>
      <CheckBox
        style={styles.checkbox}
        disabled={disabled}
        value={value}
        boxType={'square'}
        tintColors={tintColors}
        onValueChange={onChange}
      />

      {label &&
        <CText
          styles={labelStyle}
          label={t(label)}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
  }
});

export default CCheckbox;
