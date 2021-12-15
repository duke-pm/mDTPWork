/* eslint-disable no-sparse-arrays */
/**
 ** Name: Help and info page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of HelpAndInfo.js
 **/
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, Image, View, Linking, Text} from 'react-native';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListItem from '../components/ListItem';
import CGroupInfo from '~/components/CGroupInfo';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/** COMMON */
import Configs from '~/config';
import {Assets} from '~/utils/asset';
import {Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, sH} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

/** All init */
const HELP_AND_INFO = [
  {
    id: 'contactUs',
    icon: 'people',
    iconColor: colors.BLUE,
    label: 'help_and_info:contact_us',
    value: null,
    nextRoute: 'ContactUs',
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: false,
  },
];
const HELP_AND_INFO_1 = [
  {
    id: 'privacyPolicies',
    icon: 'shield-checkmark',
    iconColor: colors.GREEN,
    label: 'help_and_info:privacy_policies',
    value: 'https://www.dtp-education.com/gioi-thieu/',
    nextRoute: null,
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: true,
  },
  {
    id: 'termAndConditions',
    icon: 'clipboard',
    iconColor: colors.ORANGE,
    label: 'help_and_info:term_conditions',
    value: 'https://www.dtp-education.com/gioi-thieu/tam-nhin-su-menh/',
    nextRoute: null,
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: true,
  },
  {
    id: 'aboutUs',
    icon: 'people-circle',
    iconColor: colors.TEAL,
    label: 'help_and_info:about_us',
    value: 'https://www.dtp-education.com/?v=1',
    nextRoute: null,
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: true,
  },
];
const HELP_AND_INFO_2 = [
  {
    id: 'rateApp',
    icon: 'star',
    iconColor: colors.YELLOW,
    label: 'help_and_info:rate_app',
    value: null,
    nextRoute: null,
    isPhone: false,
    isSignOut: false,
    isRate: true,
    isURL: false,
  },
];

function HelpAndInfo(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation} = props;

  /** Use state */
  const [needUpdate, setNeedUpdate] = useState({
    status: false,
    linkUpdate: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleUpdate = () => Linking.openURL(needUpdate.linkUpdate);

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    VersionCheck.needUpdate().then(async res => {
      if (res && res.isNeeded) {
        setNeedUpdate({
          status: true,
          linkUpdate: res.storeUrl,
        });
      }
    });
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
        <View style={cStyles.flex1}>
          <View
            style={[
              cStyles.itemsCenter,
              styles.con_info_app,
              {
                backgroundColor: isDark
                  ? colors.STATUS_NEW_OPACITY
                  : colors.PRIMARY,
              },
              ,
            ]}>
            <View
              style={[cStyles.center, cStyles.rounded10, styles.con_circle_1]}>
              <View
                style={[
                  cStyles.center,
                  cStyles.rounded10,
                  styles.con_circle_2,
                ]}>
                <View
                  style={[
                    cStyles.center,
                    cStyles.rounded10,
                    styles.con_circle_logo,
                  ]}>
                  <Image
                    style={styles.logo}
                    source={Assets.imgLogoSimple}
                    resizeMode={'contain'}
                  />
                </View>
              </View>
            </View>

            <View style={cStyles.mt10}>
              <Text style={[cStyles.textBody, cStyles.colorWhite]}>
                Copyright &#169; {`${Configs.nameOfApp} ${moment().year()}`}
              </Text>
            </View>

            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
              <CText
                styles={'colorWhite'}
                customLabel={`${t(
                  'help_and_info:version',
                )} ${VersionCheck.getCurrentVersion()}`}
              />
              {needUpdate.status && (
                <CButton
                  style={[cStyles.ml10, cStyles.px6]}
                  textStyle={cStyles.textCaption1}
                  icon={Icons.download}
                  label={'help_and_info:update'}
                  onPress={handleUpdate}
                />
              )}
            </View>
          </View>
          <CContent>
            <CGroupInfo
              contentStyle={[
                cStyles.px10,
                DeviceInfo.isTablet() ? cStyles.mb10 : cStyles.mb0,
              ]}
              content={HELP_AND_INFO.map((item, index) => (
                <ListItem
                  key={item.id}
                  index={index}
                  translate={t}
                  navigation={navigation}
                  lastIndex={HELP_AND_INFO.length - 1}
                  data={item}
                  customColors={customColors}
                />
              ))}
            />

            <CGroupInfo
              contentStyle={[
                cStyles.px10,
                DeviceInfo.isTablet() ? cStyles.mb10 : cStyles.mb0,
              ]}
              content={HELP_AND_INFO_1.map((item, index) => (
                <ListItem
                  key={item.id}
                  index={index}
                  translate={t}
                  navigation={navigation}
                  lastIndex={HELP_AND_INFO_1.length - 1}
                  data={item}
                  customColors={customColors}
                />
              ))}
            />

            <CGroupInfo
              contentStyle={[cStyles.px10, cStyles.mb10]}
              content={HELP_AND_INFO_2.map((item, index) => (
                <ListItem
                  key={item.id}
                  index={index}
                  translate={t}
                  navigation={navigation}
                  lastIndex={HELP_AND_INFO_2.length - 1}
                  data={item}
                  customColors={customColors}
                />
              ))}
            />
          </CContent>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_info_app: {
    height: sH('38%'),
    width: '100%',
    paddingTop: sH('12%'),
  },
  con_circle_1: {
    backgroundColor: colors.BACKGROUND_INFO_APP_1,
    height: moderateScale(100),
    width: moderateScale(100),
  },
  con_circle_2: {
    backgroundColor: colors.BACKGROUND_INFO_APP_2,
    height: moderateScale(80),
    width: moderateScale(80),
  },
  con_circle_logo: {
    backgroundColor: colors.WHITE,
    height: moderateScale(60),
    width: moderateScale(60),
  },
  logo: {height: moderateScale(50), width: moderateScale(50)},
});

export default HelpAndInfo;
