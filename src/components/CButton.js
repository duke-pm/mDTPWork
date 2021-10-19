/**
 ** Name: CButton
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CButton.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Platform} from 'react-native';
/** COMPONENTS */
import CText from './CText';
import CTouchable from './CTouchable';
import CIcon from './CIcon';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {verticalScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CButton(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    touchStyle = {},
    style = {},
    textStyle = {},
    loading = false,
    fullWidth = false,
    block = false,
    disabled = false,
    variant = 'contained',
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
          isDark && styles.con_dark,
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
            cStyles.textCallout,
            cStyles.textBold,
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
  con_dark: {backgroundColor: colors.BACKGROUND_BTN_DARK},
  con_variant_text: {backgroundColor: colors.TRANSPARENT},
  textDisabled: Platform.select({
    ios: {color: '#cdcdcd'},
    android: {color: '#a1a1a1'},
  }),
});

CButton.propTypes = {
  touchStyle: PropTypes.object,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['contained', 'text']),
  label: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(CButton);
