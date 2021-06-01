/**
 ** Name: Help and info page
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of HelpAndInfo.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListItem from '../account/components/ListItem';
/** COMMON */
import {THEME_DARK} from '~/config/constants';

const HELP_AND_INFO = [
  {
    id: 'contactUs',
    icon: 'user',
    label: 'help_and_info:contact_us',
    value: null,
    nextRoute: 'ContactUs',
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: false,
  },
  {
    id: 'privacyPolicies',
    icon: 'file-text',
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
    icon: 'package',
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
    icon: 'users',
    label: 'help_and_info:about_us',
    value: 'https://www.dtp-education.com/?v=1',
    nextRoute: null,
    isPhone: false,
    isSignOut: false,
    isRate: false,
    isURL: true,
  },
  {
    id: 'rateApp',
    icon: 'smile',
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
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  return (
    <CContainer
      header
      loading={false}
      title={'help_and_info:title'}
      hasBack
      content={
        <CContent>
          {HELP_AND_INFO.map((item, index) => (
            <ListItem
              index={index}
              data={item}
              dataLength={HELP_AND_INFO.length}
              customColors={customColors}
              isDark={isDark}
            />
          ))}
        </CContent>
      }
    />
  );
}

export default HelpAndInfo;
