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
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from './CText';
import CLabel from './CLabel';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS, moderateScale, verticalScale} from '~/utils/helper';
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
    row = false,

    icon = null,
    iconColor = customColors.icon,
    iconLast = null,
    iconLastStyle = {},

    label = null,
    caption = null,
    holder = '',
    holderColor = colors.TEXT_META,
    selectionColor = null,
    textAlign = 'left',
    keyboard = 'default',
    returnKey = 'next',
    numberOfLines = undefined,

    multiline = false,
    password = false,
    autoFocus = false,
    dateTimePicker = false,
    hasRemove = false,

    onLayout = undefined,
    onContentSizeChange = null,
    onChangeInput = null,
    onChangeValue = null,
    onPressIconLast = null,
    onPressIconFirst = null,
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

  const handleFocusInput = e => {
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
    <View
      style={[
        cStyles.fullWidth,
        row && cStyles.row,
        row && cStyles.itemsCenter,
        row && cStyles.justifyBetween,
        containerStyle,
      ]}
      onLayout={onLayout}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          row && cStyles.mt6,
          row && styles.con_left,
        ]}>
        {label && <CLabel bold label={label} />}
        {caption && <CText styles={'textCaption1'} label={caption} />}
      </View>
      <View style={[row && styles.con_right]}>
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
            <TouchableOpacity onPress={onPressIconFirst}>
              <View
                style={[
                  cStyles.borderRight,
                  cStyles.center,
                  styles.con_input_icon,
                  isDark && cStyles.borderRightDark,
                ]}>
                {typeof icon === 'string' ? (
                  <Icon
                    name={icon}
                    color={iconColor}
                    size={moderateScale(21)}
                  />
                ) : (
                  <Image
                    style={{
                      height: moderateScale(21),
                      width: moderateScale(21),
                    }}
                    source={icon}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}

          <View style={[cStyles.flex1, cStyles.px10]}>
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
                  multiline && cStyles.justifyStart,
                  multiline && cStyles.flex1,
                  multiline && cStyles.textAliVerTop,
                  IS_IOS && cStyles.pb6,
                  cStyles.textBody,
                  {color: customColors.text},
                  styleInput,
                ]}
                editable={!disabled}
                placeholder={t(holder)}
                placeholderTextColor={holderColor}
                selectionColor={selectionColor || customColors.text}
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
                allowFontScaling={false}
                removeClippedSubviews={IS_ANDROID}
                keyboardAppearance={'default'}
                keyboardType={keyboard}
                returnKeyType={returnKey}
                multiline={multiline}
                numberOfLines={numberOfLines}
                onContentSizeChange={onContentSizeChange}
                onFocus={handleFocusInput}
                onBlur={() => setFocus(null)}
                onChangeText={handleChangeValue}
                onSubmitEditing={handleSubmitEditing}
              />
            )}
          </View>

          {hasRemove && props.value !== '' && (
            <Component
              style={[cStyles.center, styles.con_input_icon]}
              onPress={handleRemoveValue}>
              <Icon
                name={Icons.close}
                color={customColors.red}
                size={moderateScale(21)}
              />
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
              onPress={handleIconLast}>
              <Icon
                name={iconLast}
                color={customColors.icon}
                size={moderateScale(21)}
              />
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
                name={showPassword ? Icons.eyeOff : Icons.eye}
                color={colors.GRAY_500}
                size={moderateScale(21)}
              />
            </Component>
          )}
        </View>
        {props.error && (
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
            <Icon
              name={Icons.alert}
              color={customColors.red}
              size={moderateScale(14)}
            />
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.pl6,
                {color: customColors.red},
              ]}
              label={t(props.errorHelper)}
              customLabel={props.errorHelperCustom}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  con_input: {
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
    width: '100%',
    backgroundColor: colors.WHITE,
  },
  con_input_icon: {
    width: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
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
    width: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
  },
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
});

export default CInput;
