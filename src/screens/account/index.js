/**
 ** Name: Account
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import ListItem from './components/ListItem';
import SocialItem from './components/SocialItem';
/* COMMON */
import Routes from '~/navigation/Routes';
import {alert, clearSecretInfo, resetRoute} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import Assets from '~/utils/asset/Assets';
/* REDUX */
import * as Actions from '~/redux/actions';

const ACCOUNT = {
  INFORMATION: {
    id: 'information',
    label: 'account:information',
    childrens: [
      {
        id: 'myAccount',
        icon: 'user',
        label: 'account:my_account',
        value: null,
        nextRoute: 'MyAccount',
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
    ],
  },
  SETTINGS: {
    id: 'settings',
    label: 'account:settings',
    childrens: [
      {
        id: 'settingsApp',
        icon: 'settings',
        label: 'account:app_settings',
        value: null,
        nextRoute: 'Settings',
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
      {
        id: 'helpAndInfo',
        icon: 'help-circle',
        label: 'account:help_and_info',
        value: null,
        nextRoute: 'HelpAndInfo',
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
      {
        id: 'hotline',
        icon: 'phone-call',
        label: 'account:hotline',
        value: '1800 6242',
        nextRoute: null,
        isPhone: true,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
      {
        id: 'signOut',
        icon: 'log-out',
        label: 'account:sign_out',
        value: null,
        nextRoute: null,
        isPhone: false,
        isSignOut: true,
        isRate: false,
        isURL: false,
      },
    ],
  },
  SOCIALS: [
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Assets.imgFacebook,
      url: 'https://www.facebook.com/daitruongphat.education',
    },
    {
      id: 'youtube',
      label: 'Youtube',
      icon: Assets.imgYoutube,
      url: 'https://www.youtube.com/channel/UCPirvav1R6BC2WQoEyBy0PQ',
    },
  ],
};

function Account(props) {
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    alert(t, 'common:warning_sign_out', handleOk);
  };

  const handleOk = async () => {
    setLoading(true);
    await clearSecretInfo();
    dispatch(Actions.logout());
    setLoading(false);
    resetRoute(props.navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  return (
    <CContainer
      header
      loading={loading}
      title={'account:title'}
      content={
        <CContent>
          <ScrollView
            style={cStyles.flex1}
            contentContainerStyle={cStyles.px16}
            showsVerticalScrollIndicator={false}>
            <View style={[cStyles.flexCenter, cStyles.py16, styles.con_avatar]}>
              <CAvatar
                isEdit={true}
                size={'large'}
                source={
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
                }
              />
            </View>

            {/** INFORMATION */}
            <View style={cStyles.pt16}>
              <CText
                styles={'textTitle colorTextMeta'}
                label={ACCOUNT.INFORMATION.label}
              />
              {ACCOUNT.INFORMATION.childrens.map((item, index) => (
                <ListItem
                  index={index}
                  data={item}
                  dataLength={ACCOUNT.INFORMATION.childrens.length}
                />
              ))}
            </View>

            {/** SETTINGS */}
            <View style={cStyles.pt16}>
              <CText
                styles={'textTitle colorTextMeta'}
                label={ACCOUNT.SETTINGS.label}
              />
              {ACCOUNT.SETTINGS.childrens.map((item, index) => (
                <ListItem
                  index={index}
                  data={item}
                  dataLength={ACCOUNT.SETTINGS.childrens.length}
                  onPressSignOut={handleSignOut}
                />
              ))}
            </View>

            {/** SOCIALS */}
            <View style={cStyles.pt16}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                {ACCOUNT.SOCIALS.map((item, index) => (
                  <SocialItem index={index} data={item} />
                ))}
              </View>
            </View>

            <Text style={[[cStyles.textMeta, cStyles.pt16]]}>
              &#169; 2021 DTP-Education
            </Text>
          </ScrollView>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_avatar: {
    flex: 0.2,
  },
  con_left: {flex: 0.6},
  con_right: {flex: 0.4},
  line_bottom: {
    borderBottomColor: colors.BORDER_COLOR,
    borderBottomWidth: 1.5,
  },
  con_social: {height: 40, width: 40},
  social: {height: 20, width: 20},
});

export default Account;
