/**
 ** Name: ListItem
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import React from 'react';
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
import {scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function ListItem(props) {
  const navigation = useNavigation();
  const {
    showLineBottom = true,
    index,
    data,
    dataActive,
    dataLength,
    customColors,
    onPressSignOut,
  } = props;

  /** HANDLE FUNC */
  const handleItem = () => {
    if (data.isPhone) {
      Linking.openURL(`tel:${data.value}`);
    } else if (data.nextRoute) {
      navigation.navigate(data.nextRoute);
    } else if (data.isSignOut) {
      onPressSignOut();
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

  return (
    <Component key={data.id} onPress={handleItem}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.py16,
          index !== dataLength - 1 && showLineBottom && styles.line_bottom,
        ]}>
        <View style={[cStyles.row, cStyles.itemsCenter, styles.con_left]}>
          {data.icon && (
            <Icon
              name={data.icon}
              size={scalePx(3)}
              color={customColors.text}
            />
          )}
          <CText styles={'' + (data.icon && 'pl16')} label={data.label} />
        </View>

        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyEnd,
            styles.con_right,
          ]}>
          {data.value && data.isPhone && (
            <CText styles={'colorTextMeta'} label={data.value} />
          )}
          {data.isChooseLang && (
            <View
              style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
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
            data.isRate ||
            data.isSignOut) && (
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
    </Component>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.6},
  con_right: {flex: 0.4},
  line_bottom: {
    borderBottomColor: colors.BORDER_COLOR,
    borderBottomWidth: 0.3,
  },
  img_flag: {height: 20, width: 20},
});

export default ListItem;
