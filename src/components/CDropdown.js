/**
 ** Name: CDropdown
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CDropdown.js
 **/
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
/* COMPONENTS */
import DropDownPicker from '~/libs/DropDownPicker';
// import DropDownPicker from 'react-native-dropdown-picker';
/* COMMON */
import { cStyles, colors } from '~/utils/style';
/* REDUX */

function CDropdown(props) {
  const { t } = useTranslation();
  const {
    data,
    defaultValue,
    holder = '',
    onChangeItem = () => { },
  } = props;

  /** RENDER */
  return (
    <DropDownPicker
      containerStyle={styles.container}
      style={styles.box}
      itemStyle={styles.item}
      globalTextStyle={cStyles.textDefault}
      arrowSize={20}
      items={data}
      defaultValue={defaultValue}
      placeholder={t(holder)}
      placeholderStyle={[cStyles.textMeta, { fontSize: cStyles.textDefault.fontSize }]}
      onChangeItem={onChangeItem}
      {...props}
    />
  );
};

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
  item: {
    justifyContent: 'flex-start',
  },
});

export default CDropdown;
