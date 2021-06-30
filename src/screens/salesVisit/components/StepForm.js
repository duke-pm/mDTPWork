/**
 ** Name: Form step by step
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of StepForm.js
 **/
import React, {useRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import ContactInformation from './ContactInformation';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import CList from '~/components/CList';
import CCard from '~/components/CCard';
/* REDUX */

function StepForm(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {items = []} = props;

  let animItem = useRef(new Animated.Value(0)).current;

  const [position, setPosition] = useState(0);

  const onChangePosition = newPosition => {
    setPosition(newPosition);
  };

  const onCallbackContactInfor = () => {

  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animItem, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animItem, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [position]);

  const animScale = animItem.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });
  return (
    <View style={[cStyles.flex1, cStyles.p16]}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mx16]}>
        {items.map((item, index) => {
          let isActive = position > index;
          let isActive2 = position === index;
          return (
            <View
              style={[
                index !== items.length - 1 && cStyles.flex1,
                cStyles.row,
                cStyles.itemsCenter,
              ]}>
              <TouchableOpacity onPress={() => onChangePosition(index)}>
                <Animated.View
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
                    isActive2 && {transform: [{scale: animScale}]},
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
                </Animated.View>
              </TouchableOpacity>

              {index !== items.length - 1 && (
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.mx5,
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    isDark && cStyles.borderAllDark,
                    styles.seprator,
                    isActive && {borderColor: customColors.primary},
                  ]}
                />
              )}
            </View>
          );
        })}

        <CList
          pagingEnabled={true}
          horizontal={true}
          data={items}
          item={({item, index}) => {
            if (index === 0) {
              return (
                <ContactInformation
                  data={item}
                  onCallback={onCallbackContactInfor}
                />
              );
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {height: 35, width: 35},
  seprator: {borderRadius: 1},
});

export default StepForm;
