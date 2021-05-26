/**
 ** Name: CDropdown
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CDropdown.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import DropDownPicker from '~/libs/DropDownPicker';
import CText from '~/components/CText';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {scalePx} from '~/utils/helper';

function CDropdown(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';
  const {
    defaultValue,
    holder = '',
    disabled = false,
    onChangeItem = () => {},
  } = props;

  /** RENDER */
  if (props.loading) {
    return (
      <View
        style={[
          cStyles.flex1,
          cStyles.flexCenter,
          cStyles.mt6,
          styles.container,
        ]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <DropDownPicker
        containerStyle={[cStyles.flex1, cStyles.mt6, styles.container]}
        style={[
          styles.box,
          {backgroundColor: customColors.combobox},
          props.error && {borderColor: customColors.red},
          disabled && styles.disabled,
          isDark && disabled && styles.disabled_dark,
        ]}
        visibaleStyleDark={{backgroundColor: customColors.card}}
        placeholderStyle={[
          cStyles.textMeta,
          {fontSize: cStyles.textDefault.fontSize},
        ]}
        itemStyle={cStyles.justifyStart}
        globalTextStyle={[
          cStyles.textDefault,
          isDark && {color: customColors.text},
        ]}
        arrowStyle={{color: customColors.text}}
        isDark={isDark}
        items={props.data}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder={t(holder)}
        customArrowUp={(size, color) => (
          <Icon
            name={'chevron-up'}
            size={scalePx(3)}
            color={customColors.text}
          />
        )}
        customArrowDown={(size, color) => (
          <Icon
            name={'chevron-down'}
            size={scalePx(3)}
            color={customColors.text}
          />
        )}
        onChangeItem={onChangeItem}
        {...props}
      />

      {props.error && (
        <CText styles={'textMeta colorRed mt6'} label={t(props.errorHelper)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {height: 50},
  box: {
    borderColor: colors.GRAY_500,
    borderWidth: 0.5,
    height: 50,
  },
  disabled: {backgroundColor: colors.GRAY_300},
  disabled_dark: {backgroundColor: colors.GRAY_900},
});

export default CDropdown;
