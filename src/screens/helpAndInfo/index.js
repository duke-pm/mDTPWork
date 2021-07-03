/**
 ** Name: Help and info page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of HelpAndInfo.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListItem from '../account/components/ListItem';

const HELP_AND_INFO = [
  {
    id: 'contactUs',
    icon: 'people-outline',
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
    icon: 'shield-checkmark-outline',
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
    icon: 'star-outline',
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

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
        <CContent>
          {HELP_AND_INFO.map((item, index) => (
            <ListItem
              key={item.id}
              index={index}
              data={item}
              customColors={customColors}
            />
          ))}
        </CContent>
      }
    />
  );
}

export default HelpAndInfo;
