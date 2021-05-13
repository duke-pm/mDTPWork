/**
 ** Name: CDropdown
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CDropdown.js
 **/
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
/* COMPONENTS */
import DropDownPicker from '~/libs/DropDownPicker';
import CText from '~/components/CText';
/* COMMON */
import {cStyles, colors} from '~/utils/style';
/* REDUX */

function CDropdown(props) {
  const {t} = useTranslation();
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
          props.error && styles.error_box,
          disabled && styles.disabled,
        ]}
        placeholderStyle={[
          cStyles.textMeta,
          {fontSize: cStyles.textDefault.fontSize},
        ]}
        itemStyle={styles.item}
        globalTextStyle={cStyles.textDefault}
        arrowSize={20}
        items={props.data}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder={t(holder)}
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
});

export default CDropdown;
