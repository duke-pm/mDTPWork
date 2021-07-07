/**
 ** Name: ListItem
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
import {alert, fS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';

function ListItem(props) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {
    key,
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
      console.log('[LOG] === onSignOut ===> ');
      onSignOut();
    }
  };

  /**************
   ** RENDER **
   **************/
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
          cStyles.py12,
        ]}>
        <View style={[cStyles.center, styles.con_left]}>
          {data.icon && !data.iconFaceID && (
            <Icon name={data.icon} size={fS(23)} color={customColors.text} />
          )}
          {dataToggle && dataToggle.activeBiometric && data.iconFaceID && (
            <Image
              style={{height: fS(23), width: fS(23)}}
              source={Assets.iconFaceID}
              resizeMode={'contain'}
            />
          )}
        </View>

        <View
          style={[
            cStyles.row,
            cStyles.justifyBetween,
            cStyles.itemsCenter,
            cStyles.pr16,
            styles.con_right,
          ]}>
          <View style={{flex: 0.9}}>
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
                name={'chevron-forward-outline'}
                size={fS(18)}
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
  con_left: {flex: 0.18},
  con_right: {flex: 0.82},
  img_flag: {height: 20, width: 20},
});

export default ListItem;
