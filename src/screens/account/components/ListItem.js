/**
 ** Name: ListItem
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Linking,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Rate, {AndroidMarket} from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Configs from '~/config';
import {alert, scalePx, sW} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function ListItem(props) {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {
    showLineBottom = true,
    key,
    index,
    data,
    dataActive,
    dataLength,
    customColors,
    isDark,
  } = props;

  /** HANDLE FUNC */
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
    }
  };

  /** RENDER */
  let isTouch =
    data.nextRoute ||
    data.isSignOut ||
    data.isPhone ||
    data.isURL ||
    data.isChooseLang ||
    data.isRate;
  const Component = isTouch ? TouchableWithoutFeedback : View;
  const showLine = index !== dataLength - 1 && showLineBottom;
  const showDarkLine = index !== dataLength - 1 && showLineBottom && isDark;

  return (
    <View key={key} style={cStyles.itemsEnd}>
      <Component onPress={handleItem}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.py16,
            cStyles.pl16,
          ]}>
          <View style={[cStyles.center, styles.con_left]}>
            {data.icon && (
              <Icon
                name={data.icon}
                size={scalePx(3)}
                color={customColors.text}
              />
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
            <CText label={data.label} />

            <View
              style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
              {data.value && data.isPhone && (
                <CText styles={'colorTextMeta'} label={data.value} />
              )}
              {data.isChooseLang && (
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyEnd,
                  ]}>
                  <CText
                    styles={'colorTextMeta pr10'}
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
                    size={scalePx(2.5)}
                    color={colors.GRAY_500}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Component>

      <View
        style={[
          cStyles.itemsEnd,
          styles.con_line,
          showLine && cStyles.borderBottom,
          showDarkLine && cStyles.borderBottomDark,
        ]}
      />
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
