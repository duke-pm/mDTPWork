/**
 ** Name: CDropdown
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CDropdown.js
 **/
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import DropDownPicker from '~/libs/DropDownPicker';
import CText from '~/components/CText';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
import {scalePx} from '~/utils/helper';
/* REDUX */

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
      <View style={[cStyles.flexCenter, styles.container]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <DropDownPicker
        containerStyle={styles.container}
        style={[
          styles.box,
          {backgroundColor: customColors.combobox},
          props.error && styles.error_box,
          disabled && styles.disabled,
          isDark && disabled && styles.disabled_dark,
        ]}
        visibaleStyleDark={{backgroundColor: customColors.card}}
        placeholderStyle={[
          cStyles.textMeta,
          {fontSize: cStyles.textDefault.fontSize},
        ]}
        itemStyle={styles.item}
        globalTextStyle={[
          cStyles.textDefault,
          isDark && {color: customColors.text},
        ]}
        arrowStyle={{color: customColors.text}}
        darkmode={isDark}
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
  container: {
    flex: 1,
    height: 50,
    marginTop: 6,
  },
  box: {
    borderColor: colors.GRAY_500,
    borderWidth: 0.5,
    height: 50,
  },
  error_box: {
    borderColor: colors.RED,
  },
  item: {
    justifyContent: 'flex-start',
  },
  disabled: {
    backgroundColor: colors.GRAY_300,
  },
  disabled_dark: {
    backgroundColor: colors.GRAY_900,
  },
});

export default CDropdown;
