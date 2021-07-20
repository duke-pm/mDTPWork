/**
 ** Name: List Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  Linking,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Rate, {AndroidMarket} from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Configs from '~/config';
import Icons from '~/config/icons';
import {alert, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';

function ListItem(props) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {
    key,
    index,
    lastIndex,
    data,
    dataActiveLang,
    dataToggle,
    customColors,
    onSignOut,
    onToggle,
  } = props;
  const isSignOut = data.id === 'signout';

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => {
    if (data.isPhone) {
      Linking.openURL(`tel:${data.value}`);
    } else if (data.nextRoute) {
      if (data.nextRoute !== 'NotReady') {
        navigation.navigate(data.nextRoute, {
          data: data.data || null,
          isChooseDarkMode: data.isChooseDarkMode || false,
        });
      } else {
        alert(t, 'common:holder_warning_option_prepare', () => null);
      }
    } else if (data.isURL) {
      Linking.openURL(data.value);
    } else if (data.isRate) {
      const options = {
        AppleAppID: Configs.appStoreID,
        GooglePackageName: Configs.googlePlayPackage,
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: false,
        openAppStoreIfInAppFails: true,
      };
      Rate.rate(options, success => {
        if (success) {
          console.log('[LOG] === SUCCESS RATE ===> ', success);
        }
      });
    } else if (data.isChooseLang) {
      data.onPress?.current?.show();
    } else if (isSignOut) {
      onSignOut();
    }
  };

  /************
   ** RENDER **
   ************/
  let isTouch =
    data.nextRoute ||
    data.isSignOut ||
    data.isPhone ||
    data.isURL ||
    data.isChooseLang ||
    data.isRate ||
    isSignOut;
  const Component = isTouch ? TouchableOpacity : View;
  if (dataToggle && !dataToggle.activeBiometric) {
    return null;
  }
  return (
    <Component key={key} onPress={handleItem}>
      <View
        style={[
          cStyles.flex1,
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.pb12,
          lastIndex === index && cStyles.pb0,
        ]}>
        <View style={[cStyles.center, styles.con_left]}>
          <View
            style={[
              cStyles.rounded1,
              cStyles.p6,
              {backgroundColor: data.iconColor || colors.TRANSPARENT},
            ]}>
            {data.icon && !data.iconFaceID && (
              <Icon
                name={data.icon}
                size={moderateScale(21)}
                color={data.iconColor ? colors.WHITE : customColors.text}
              />
            )}
            {dataToggle && dataToggle.activeBiometric && data.iconFaceID && (
              <Image
                style={styles.img_biometric}
                source={Assets.iconFaceIDDark}
                resizeMode={'contain'}
              />
            )}
          </View>
        </View>

        <View
          style={[
            cStyles.row,
            cStyles.justifyBetween,
            cStyles.itemsCenter,
            styles.con_right,
          ]}>
          <View style={[cStyles.ml6, styles.container_label]}>
            <CText
              customStyles={isSignOut ? {color: customColors.red} : {}}
              label={data.label}
            />
            {data.description && (
              <CText customStyles={cStyles.textMeta} label={data.description} />
            )}
          </View>

          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
            {data.value && data.isPhone && <CText label={data.value} />}

            {data.isChooseLang && (
              <View
                style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                <CText
                  styles={'pr6'}
                  label={
                    dataActiveLang ? dataActiveLang.label : data.data[0].label
                  }
                />
                <Image
                  style={styles.img_flag}
                  source={
                    dataActiveLang ? dataActiveLang.icon : data.data[0].icon
                  }
                  resizeMode={'contain'}
                />
              </View>
            )}
            {(data.nextRoute ||
              data.isURL ||
              data.isChooseLang ||
              data.isRate) && (
              <Icon
                name={Icons.next}
                size={moderateScale(18)}
                color={colors.GRAY_500}
              />
            )}
            {data.isToggle && dataToggle && (
              <Switch
                value={dataToggle.valueBiometric}
                onValueChange={onToggle}
              />
            )}
          </View>
        </View>
      </View>
    </Component>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.15},
  con_right: {flex: 0.85},
  container_label: {flex: 0.8},
  img_flag: {height: moderateScale(20), width: moderateScale(20)},
  img_biometric: {height: moderateScale(23), width: moderateScale(23)},
});

export default ListItem;
