/**
 ** Name: CCheckbox
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CCheckbox.js
 **/
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import { colors, cStyles } from '~/utils/style';
import { scalePx } from '~/utils/helper';

function CCheckbox(props) {
  const { t } = useTranslation();
  const {
    containerStyle,
    style,
    label,
    labelStyle,
    disabled,
    value,
    onCheckColor = colors.SECONDARY,
    onTintColor = colors.SECONDARY,
    tintColors = { true: colors.SECONDARY, false: colors.PRIMARY },
    onChange,
  } = props;

  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyStart,
        cStyles.py16,
        containerStyle
      ]}>
      <CheckBox
        style={[styles.checkbox, style]}
        disabled={disabled}
        value={value}
        boxType={'square'}
        tintColors={tintColors}
        onCheckColor={onCheckColor}
        onTintColor={onTintColor}
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
    height: scalePx(3),
    width: scalePx(3),
  }
});

export default CCheckbox;
