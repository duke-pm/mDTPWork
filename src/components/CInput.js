/**
 ** Name: CInput
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CInput.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';

function CInput(props) {
  const {t} = useTranslation();

  const {
    containerStyle = {},
    style = {},
    styleFocus = {},
    styleInput = {},

    disabled = false,

    icon = null,
    iconColor = colors.ICON_BASE,
    iconLast = null,
    iconLastColor = colors.ICON_BASE,
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

  const [focus, setFocus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /** HANDLE FUNC */
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

  /** RENDER */
  const isDarkMode = useColorScheme() === 'dark';
  const Component = disabled ? View : TouchableOpacity;

  return (
    <View style={[{width: '100%'}, containerStyle]}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.rounded1,
          cStyles.mt6,
          styles.con_input,
          disabled && styles.disabled,
          props.error && styles.error,
          style,
          focus === props.name && [styles.input_focus, styleFocus],
        ]}>
        {icon && (
          <View
            style={[
              cStyles.borderRight,
              cStyles.center,
              styles.con_input_icon,
            ]}>
            <Icon name={icon} color={iconColor} size={scalePx(3.5)} />
          </View>
        )}

        <View style={[cStyles.flex1, cStyles.px12]}>
          {dateTimePicker && (
            <View style={[cStyles.textDefault, styles.input]}>
              <CText customLabel={props.value} />
            </View>
          )}

          {!dateTimePicker && (
            <TextInput
              ref={props.inputRef}
              style={[
                cStyles.textDefault,
                {color: props.valueColor},
                IS_IOS && cStyles.mb6,
                styleInput,
              ]}
              editable={!disabled}
              placeholder={t(holder)}
              placeholderTextColor={holderColor}
              selectionColor={props.valueColor}
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
              // clearButtonMode={'while-editing'}
              removeClippedSubviews={IS_ANDROID}
              keyboardAppearance={isDarkMode ? 'dark' : 'light'}
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
            <Icon
              name={'x-circle'}
              color={colors.RED}
              size={scalePx(3)}
            />
          </Component>
        )}

        {iconLast && (
          <Component
            style={[
              cStyles.center,
              cStyles.roundedTopRight1,
              cStyles.roundedBottomRight1,
              {backgroundColor: colors.GRAY_300},
              styles.con_input_icon,
              iconLastStyle,
            ]}
            onPress={handleIconLast}>
            <Icon name={iconLast} color={iconLastColor} size={scalePx(3.5)} />
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
              color={colors.GRAY_600}
              size={scalePx(3.5)}
            />
          </Component>
        )}
      </View>
      {props.error && (
        <CText styles={'textMeta colorRed mt6'} label={t(props.errorHelper)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  con_input: {
    height: 50,
    width: '100%',
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY_500,
    borderWidth: 0.5,
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
  disabled: {
    backgroundColor: colors.GRAY_300,
  },
  error: {
    borderColor: colors.RED,
  },
});

export default CInput;
