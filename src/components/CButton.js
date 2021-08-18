/**
 ** Name: CButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Platform} from 'react-native';
/** COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
import CIcon from './CIcon';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {verticalScale} from '~/utils/helper';

function CButton(props) {
  const {t} = useTranslation();
  const {
    touchStyle = {},
    style = {},
    textStyle = {},
    loading = false,
    fullWidth = false,
    block = false,
    disabled = false,
    variant = 'contained', // contained | text
    label = '',
    color = colors.SECONDARY,
    icon = null,
    onPress = () => {},
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <CTouchable
      containerStyle={touchStyle}
      disabled={disabled || loading}
      onPress={onPress}>
      <View
        style={[
          cStyles.row,
          cStyles.center,
          cStyles.rounded1,
          styles.container,
          fullWidth && cStyles.deviceWidth,
          block && cStyles.fullWidth,
          {backgroundColor: color},
          variant === 'text' && styles.con_variant_text,
          style,
        ]}>
        {icon && (
          <CIcon
            name={icon}
            customColor={
              disabled || loading
                ? styles.textDisabled.color
                : variant === 'contained'
                ? colors.WHITE
                : color
            }
            size={'small'}
          />
        )}

        <CText
          customStyles={[
            cStyles.textSubheadline,
            cStyles.textCenter,
            cStyles.m6,
            {color: variant === 'contained' ? colors.WHITE : color},
            (disabled || loading) && styles.textDisabled,
            textStyle,
          ]}
          label={t(label)}
        />
      </View>
    </CTouchable>
  );
}

const styles = StyleSheet.create({
  container: {paddingVertical: verticalScale(1)},
  con_variant_text: {backgroundColor: colors.TRANSPARENT},
  textDisabled: Platform.select({
    ios: {color: '#cdcdcd'},
    android: {color: '#a1a1a1'},
  }),
});

export default CButton;
