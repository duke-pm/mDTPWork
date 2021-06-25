/**
 ** Name: Form step by step
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of StepForm.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import CText from '~/components/CText';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
/* COMPONENTS */

/* COMMON */

/* REDUX */

function StepForm(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {items = []} = props;

  return (
    <View>
      <View style={[cStyles.p16]}>
        {items.map((item, index) => {
          return (
            <View
              style={[
                cStyles.center,
                cStyles.rounded5,
                cStyles.borderAll,
                isDark && cStyles.borderAllDark,
                styles.item,
                {borderColor: customColors.primary},
              ]}>
              {item.number && (
                <CText styles={'textMeta'} customLabel={index + 1} />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {height: 40, width: 40},
});

export default StepForm;
