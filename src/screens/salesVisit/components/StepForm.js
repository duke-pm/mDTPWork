/**
 ** Name: Form step by step
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of StepForm.js
 **/
import React, {createRef, useRef, useState, useEffect} from 'react';
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
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CList from '~/components/CList';
import CCard from '~/components/CCard';
import ContactInformation from './ContactInformation';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {fS} from '~/utils/helper';
/* REDUX */

function StepForm(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {items = []} = props;

  let animItem = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(items);

  const onChangePosition = newPosition => {
    setIndex(newPosition);
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
  }, [index]);

  const animScale = animItem.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'step1':
        return (
          <ContactInformation
            loading={loading}
            index={index}
            data={route}
            onCallback={onCallbackContactInfor}
          />
        );
      case 'step2':
        return (
          <ContactInformation
            loading={loading}
            index={index}
            data={route}
            onCallback={onCallbackContactInfor}
          />
        );
      case 'step3':
        return (
          <ContactInformation
            loading={loading}
            index={index}
            data={route}
            onCallback={onCallbackContactInfor}
          />
        );
      default:
        return (
          <ContactInformation
            loading={loading}
            index={index}
            data={route}
            onCallback={onCallbackContactInfor}
          />
        );
    }
  };
  const renderTabbar = propsTabbar => {
    return (
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.m16]}>
        {routes.map((item, indexItem) => {
          let isActive = index > indexItem;
          let isActive2 = index === indexItem;
          return (
            <View
              style={[
                indexItem !== items.length - 1 && cStyles.flex1,
                cStyles.row,
                cStyles.itemsCenter,
              ]}>
              <TouchableOpacity onPress={() => onChangePosition(indexItem)}>
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
                      customLabel={indexItem + 1}
                    />
                  )}
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      size={fS(20)}
                      color={
                        isActive || isActive2
                          ? colors.WHITE
                          : customColors.primary
                      }
                    />
                  )}
                </Animated.View>
              </TouchableOpacity>

              {indexItem !== items.length - 1 && (
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
      </View>
    );
  };
  return (
    <TabView
      lazy
      initialLayout={styles.con_tab}
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabbar}
      onIndexChange={setIndex}
    />
  );
}

const styles = StyleSheet.create({
  item: {height: 35, width: 35},
  seprator: {borderRadius: 1},
  con_tab: {width: cStyles.deviceWidth},
});

export default StepForm;
