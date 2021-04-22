/**
 ** Name: CDropdown
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CDropdown.js
 **/
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
/* COMPONENTS */

/* COMMON */
import { cStyles, colors } from '~/utils/style';
/* REDUX */


function CDropdown(props) {
  const {
    data,
    defaultValue,
    zIndex,
    onChangeItem,
  } = props;
  const { t } = useTranslation();

  /** RENDER */
  return (
    <DropDownPicker
      containerStyle={styles.container}
      style={styles.box}
      itemStyle={styles.item}
      globalTextStyle={cStyles.textDefault}
      dropDownStyle={styles.dropdown}
      arrowSize={20}
      zIndex={zIndex}
      zIndexInverse={5000}
      items={data}
      defaultValue={defaultValue}
      placeholder={t('add_approved:holder_department')}
      placeholderStyle={[cStyles.textMeta, { fontSize: cStyles.textDefault.fontSize }]}
      onChangeItem={onChangeItem}
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
  },
  item: {
    justifyContent: 'flex-start',
  },
  dropdown: {
    backgroundColor: colors.WHITE,
  }
});

export default CDropdown;
