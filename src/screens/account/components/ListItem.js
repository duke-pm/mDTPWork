/**
 ** Name: List Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
/* COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import {Assets} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';
import {alert, moderateScale} from '~/utils/helper';

function ListItem(props) {
  const {
    key = '',
    index = 0,
    lastIndex = 0,
    translate = null,
    customColors = {},
    navigation = null,
    data = null,
    dataActiveLang = null,
    dataToggle = null,
    onSignOut = () => null,
    onToggle = () => null,
  } = props;
  const IS_SIGN_OUT = data.id === 'signout';

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => {
    if (data.isPhone) {
      Linking.openURL(`tel:${data.value}`);
    } else if (data.nextRoute) {
      if (data.nextRoute !== 'NotReady') {
        navigation &&
          navigation.navigate(data.nextRoute, {
            data: data.data || null,
            isChooseDarkMode: data.isChooseDarkMode || false,
          });
      } else {
        alert(translate, 'common:holder_warning_option_prepare', () => null);
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
    } else if (IS_SIGN_OUT) {
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
    IS_SIGN_OUT;
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
              <CIcon
                name={data.icon}
                size={'large'}
                customColor={data.iconColor ? colors.WHITE : customColors.text}
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
              customStyles={IS_SIGN_OUT ? {color: customColors.red} : {}}
              label={data.label}
            />
            {data.description && (
              <CText
                customStyles={cStyles.textCaption1}
                label={data.description}
              />
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
              <CIcon
                name={Icons.next}
                size={'small'}
                customColor={colors.GRAY_500}
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

ListItem.propTypes = {
  key: PropTypes.string,
  index: PropTypes.number,
  lastIndex: PropTypes.number,
  data: PropTypes.object,
  dataActiveLang: PropTypes.object,
  dataToggle: PropTypes.object,
  customColors: PropTypes.object,
  navigation: PropTypes.object,
  translate: PropTypes.func,
  onSignOut: PropTypes.func,
  onToggle: PropTypes.func,
};

export default ListItem;
