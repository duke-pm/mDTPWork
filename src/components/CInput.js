/**
 ** Name: CInput
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CInput.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID, IS_IOS} from '~/utils/helper';
import {THEME_DARK, THEME_LIGHT} from '~/config/constants';

function CInput(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();

  const {
    containerStyle = {},
    style = {},
    styleFocus = {},
    styleInput = {},

    disabled = false,

    icon = null,
    iconColor = customColors.icon,
    iconLast = null,
    iconLastStyle = {},

    holder = '',
    holderColor = colors.TEXT_META,
    textAlign = 'left',
    keyboard = 'default',
    returnKey = 'next',

    password = false,
    autoFocus = false,
    dateTimePicker = false,
    hasRemove = false,

    onChangeInput = null,
    onChangeValue = null,
    onPressIconLast = null,
    onPressRemoveValue = null,
  } = props;

  /** Use state */
  const [focus, setFocus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSubmitEditing = () => {
    if (onChangeInput) {
      onChangeInput();
    }
  };

  const handleChangeValue = value => {
    if (onChangeValue) {
      onChangeValue(value, props.name);
    }
  };

  const handleFocusInput = () => {
    setFocus(props.name);
  };

  const handleIconLast = () => {
    if (onPressIconLast) {
      onPressIconLast();
    }
  };

  const handleRemoveValue = () => {
    if (onPressRemoveValue) {
      onPressRemoveValue();
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**************
   ** RENDER **
   **************/
  const Component = disabled ? View : TouchableOpacity;
  return (
    <View style={[cStyles.fullWidth, containerStyle]}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.rounded1,
          cStyles.mt6,
          cStyles.borderAll,
          isDark && cStyles.borderAllDark,
          styles.con_input,
          disabled && {backgroundColor: customColors.cardDisable},
          props.error && {borderColor: customColors.red},
          !disabled && isDark && {backgroundColor: colors.TRANSPARENT},
          disabled && isDark && {backgroundColor: customColors.cardDisable},
          style,
          focus === props.name && [styles.input_focus, styleFocus],
        ]}>
        {icon && (
          <View
            style={[
              cStyles.borderRight,
              isDark && cStyles.borderRightDark,
              cStyles.center,
              styles.con_input_icon,
            ]}>
            <Icon name={icon} color={iconColor} size={fS(20)} />
          </View>
        )}

        <View style={[cStyles.flex1, cStyles.px12]}>
          {dateTimePicker && (
            <View
              style={[
                cStyles.fullWidth,
                isDark && {backgroundColor: colors.TRANSPARENT},
              ]}>
              <CText customLabel={props.value} />
            </View>
          )}

          {!dateTimePicker && (
            <TextInput
              ref={props.inputRef}
              style={[
                cStyles.textDefault,
                {color: customColors.text},
                IS_IOS && cStyles.mb8,
                cStyles.flex1,
                styleInput,
              ]}
              editable={!disabled}
              placeholder={t(holder)}
              placeholderTextColor={holderColor}
              selectionColor={customColors.text}
              value={props.value}
              autoCompleteType={'off'}
              autoFocus={autoFocus}
              autoCapitalize
              autoCorrect={false}
              secureTextEntry={password && !showPassword}
              enablesReturnKeyAutomatically={true}
              blurOnSubmit={true}
              selectTextOnFocus={true}
              textAlign={textAlign}
              removeClippedSubviews={IS_ANDROID}
              keyboardAppearance={isDark ? THEME_DARK : THEME_LIGHT}
              keyboardType={keyboard}
              returnKeyType={returnKey}
              onFocus={handleFocusInput}
              onBlur={() => setFocus(null)}
              onChangeText={handleChangeValue}
              onSubmitEditing={handleSubmitEditing}
              {...props}
            />
          )}
        </View>

        {hasRemove && props.value !== '' && (
          <Component
            style={[cStyles.center, styles.con_input_icon]}
            onPress={handleRemoveValue}>
            <Icon name={'close-circle'} color={customColors.red} size={fS(20)} />
          </Component>
        )}

        {iconLast && (
          <Component
            style={[
              cStyles.center,
              cStyles.roundedTopRight1,
              cStyles.roundedBottomRight1,
              {backgroundColor: customColors.cardDisable},
              styles.con_input_icon,
              iconLastStyle,
            ]}
            // disabled={props.value === ''}
            onPress={handleIconLast}>
            <Icon name={iconLast} color={customColors.icon} size={fS(20)} />
          </Component>
        )}

        {password && (
          <Component
            style={[
              cStyles.center,
              cStyles.roundedTopRight1,
              cStyles.roundedBottomRight1,
              styles.con_input_icon,
              iconLastStyle,
            ]}
            onPress={handleShowPassword}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              color={colors.GRAY_500}
              size={fS(20)}
            />
          </Component>
        )}
      </View>
      {props.error && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
          <Icon name={'alert-circle'} color={customColors.red} size={fS(14)} />
          <CText
            customStyles={[
              cStyles.textMeta,
              cStyles.fontRegular,
              cStyles.pl6,
              {color: customColors.red},
            ]}
            label={t(props.errorHelper)}
            customLabel={props.errorHelperCustom}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  con_input: {
    height: 50,
    width: '100%',
    backgroundColor: colors.WHITE,
  },
  con_input_icon: {
    width: 50,
    height: 48.5,
  },
  input: {
    width: '100%',
    color: colors.WHITE,
  },
  input_focus: {
    borderColor: colors.GRAY_100,
    borderWidth: 0.5,
  },
  input_icon: {
    width: 50,
    height: 50,
  },
});

export default CInput;
