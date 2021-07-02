/**
 ** Name: ListItem
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Linking, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Rate, {AndroidMarket} from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Configs from '~/config';
import {alert, fS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function ListItem(props) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {key, data, dataActive, customColors, onSignOut} = props;
  const isSignOut = data.id === 'signout';

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => {
    if (data.isPhone) {
      Linking.openURL(`tel:${data.value}`);
    } else if (data.nextRoute) {
      if (data.nextRoute !== 'NotReady') {
        navigation.navigate(data.nextRoute);
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

  return (
    <View key={key} style={cStyles.itemsEnd}>
      <Component onPress={handleItem}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.py12,
            cStyles.pl16,
          ]}>
          <View style={[cStyles.center, styles.con_left]}>
            {data.icon && (
              <Icon name={data.icon} size={fS(18)} color={customColors.text} />
            )}
          </View>

          <View
            style={[
              cStyles.row,
              cStyles.justifyBetween,
              cStyles.itemsCenter,
              cStyles.ml16,
              cStyles.pr16,
              cStyles.fullHeight,
              styles.con_right,
            ]}>
            <CText
              customStyles={isSignOut ? {color: customColors.red} : {}}
              label={data.label}
            />

            <View
              style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
              {data.value && data.isPhone && <CText label={data.value} />}
              {data.isChooseLang && (
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyEnd,
                  ]}>
                  <CText
                    styles={'pr10'}
                    label={dataActive ? dataActive.label : data.data[0].label}
                  />
                  <Image
                    style={styles.img_flag}
                    source={dataActive ? dataActive.icon : data.data[0].icon}
                    resizeMode={'contain'}
                  />
                </View>
              )}
              {(data.nextRoute ||
                data.isURL ||
                data.isChooseLang ||
                data.isRate) && (
                <View style={cStyles.pl10}>
                  <Icon
                    name={'chevron-right'}
                    size={fS(18)}
                    color={colors.GRAY_500}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Component>
    </View>
  );
}

const styles = StyleSheet.create({
  con_left: {width: '6%'},
  con_right: {width: '89%'},
  con_line: {width: '86%'},
  img_flag: {height: 20, width: 20},
});

export default ListItem;
