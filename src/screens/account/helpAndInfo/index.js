/**
 ** Name: Help and info page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of HelpAndInfo.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListItem from '../components/ListItem';
import CGroupInfo from '~/components/CGroupInfo';
/** COMMON */
import {colors, cStyles} from '~/utils/style';

/** All init */
const HELP_AND_INFO = [
  {
    id: 'contactUs',
    icon: 'people-outline',
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
    icon: 'shield-checkmark-outline',
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
    icon: 'clipboard-outline',
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
    icon: 'people-circle-outline',
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
    icon: 'star-outline',
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
  const {navigation} = props;

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
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
      }
    />
  );
}

export default React.memo(HelpAndInfo);
