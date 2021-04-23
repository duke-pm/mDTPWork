/**
 ** Name: CInput
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CInput.js
 **/
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
/* COMPONENTS */
/* COMMON */
import Configs from '~/config';
import { colors, cStyles } from '~/utils/style';
import { RFPercentage } from '~/utils/helper';
import CText from './CText';

function CInput(props) {
  const { t } = useTranslation();

  const {
    id = '',
    containerStyle = {},
    style = {},
    styleFocus = {},

    disabled = false,

    icon = null,
    iconColor = colors.BLACK,
    iconLast = null,
    iconLastColor = colors.BLACK,

    holder = '',
    holderColor = colors.GRAY_500,
    valueColor = colors.BLACK,
    textAlign = 'left',
    keyboard = 'default',
    returnKey = 'next',

    password = false,
    autoFocus = false,
    dateTimePicker = false,

    onChangeInput = null,
    onPressIconLast = null,
  } = props;

  const [form, setForm] = useState({
    value: props.value,
    focus: null,
  });

  /** HANDLE FUNC */
  const handleSubmitEditing = () => {
    if (onChangeInput) onChangeInput();
  }

  const handleChangeInput = (value) => {
    setForm({
      ...form,
      value,
    });
  };

  const handleFocusInput = (nameInput) => {
    setForm({
      ...form,
      focus: nameInput,
    });
  };

  /** RENDER */
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[
      cStyles.row,
      cStyles.itemsCenter,
      cStyles.rounded1,
      cStyles.mt12,
      styles.con_input,
      form.focus === id && [styles.input_focus, styleFocus],
      containerStyle,
      style,
    ]}>
      {icon &&
        <View style={[
          cStyles.borderRight,
          cStyles.center,
          styles.con_input_icon
        ]}>
          <Icon
            name={icon}
            color={iconColor}
            size={RFPercentage(3)}
          />
        </View>
      }

      <View style={[cStyles.flex1, cStyles.px12]}>
        {dateTimePicker &&
          <View style={[cStyles.textDefault, styles.input]}>
            <CText customLabel={props.value} />
          </View>
        }

        {!dateTimePicker &&
          <TextInput
            ref={props.inputRef}
            style={[
              cStyles.textDefault,
              styles.input,
            ]}
            editable={!disabled}
            placeholder={t(holder)}
            placeholderTextColor={holderColor}
            selectionColor={valueColor}
            value={form.value}
            autoCompleteType={'off'}
            autoFocus={autoFocus}
            autoCapitalize
            autoCorrect={false}
            secureTextEntry={password}
            enablesReturnKeyAutomatically={true}
            blurOnSubmit={true}
            selectTextOnFocus={true}
            textAlign={textAlign}
            clearButtonMode={'while-editing'}
            keyboardAppearance={isDarkMode ? 'dark' : 'light'}
            keyboardType={keyboard}
            returnKeyType={returnKey}
            onFocus={() => handleFocusInput(id)}
            onBlur={() => handleFocusInput(null)}
            onChangeText={handleChangeInput}
            onSubmitEditing={handleSubmitEditing}
            {...props}
          />
        }
      </View>

      {iconLast &&
        <TouchableOpacity
          style={[
            cStyles.center,
            cStyles.roundedTopRight1,
            cStyles.roundedBottomRight1,
            styles.con_input_icon,
            { backgroundColor: colors.GRAY_300 },
          ]}
          onPress={onPressIconLast}
        >
          <Icon
            name={iconLast}
            color={iconLastColor}
            size={RFPercentage(3)}
          />
        </TouchableOpacity>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  con_input: {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
});

export default CInput;
