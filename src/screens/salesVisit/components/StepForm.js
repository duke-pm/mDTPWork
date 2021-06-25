/**
 ** Name: Form step by step
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of StepForm.js
 **/
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import CLabel from '~/components/CLabel';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {scalePx} from '~/utils/helper';
/* REDUX */

function StepForm(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {items = []} = props;

  const animItem = useRef(new Animated.Value(0)).current;

  const [position, setPosition] = useState(0);

  const onChangePosition = newPosition => {
    setPosition(newPosition);
    // Animated.timing(animItem, {
    //   toValue: animItem
    // })
  };

  return (
    <View style={[cStyles.flex1, cStyles.p16]}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mx16]}>
        {items.map((item, index) => {
          let isActive = position > index;
          let isActive2 = position === index;
          return (
            <TouchableOpacity
              style={[
                index !== items.length - 1 && cStyles.flex1,
                cStyles.row,
                cStyles.itemsCenter,
              ]}
              onPress={() => onChangePosition(index)}>
              <View
                style={[
                  cStyles.center,
                  cStyles.rounded5,
                  cStyles.borderAll,
                  isDark && cStyles.borderAllDark,
                  styles.item,
                  {
                    borderColor: customColors.primary,
                    backgroundColor:
                      isActive || isActive2
                        ? customColors.primary
                        : colors.TRANSPARENT,
                  },
                ]}>
                {item.number && (
                  <CLabel
                    customStyles={{
                      color:
                        isActive || isActive2
                          ? colors.WHITE
                          : customColors.primary,
                    }}
                    customLabel={index + 1}
                  />
                )}
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={17}
                    color={
                      isActive || isActive2
                        ? colors.WHITE
                        : customColors.primary
                    }
                  />
                )}
              </View>

              {index !== items.length - 1 && (
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.mx5,
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    isDark && cStyles.borderAllDark,
                    styles.seprator,
                    isActive && {backgroundColor: customColors.primary},
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {height: 35, width: 35},
  seprator: {borderRadius: 1},
});

export default StepForm;
