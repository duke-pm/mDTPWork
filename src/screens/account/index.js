/**
 ** Name: Account
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import ListItem from './components/ListItem';
import SocialItem from './components/SocialItem';
/* COMMON */
import Routes from '~/navigation/Routes';
import {alert, clearSecretInfo, resetRoute, sW} from '~/utils/helper';
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
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

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
            <View
              style={[
                cStyles.center,
                cStyles.rounded2,
                cStyles.p16,
                cStyles.mt60,
                !isDark && cStyles.shadowListItem,
                {
                  backgroundColor: isDark ? customColors.card : colors.WHITE,
                },
              ]}>
              <View
                style={[cStyles.flexCenter, cStyles.abs, {top: -sW('12%')}]}>
                <CAvatar
                  isEdit={true}
                  size={'large'}
                  customColors={customColors}
                  source={Assets.iconUserDefault}
                />

                <CText
                  styles={'textTitle pt16'}
                  customLabel={authState.getIn(['login', 'fullName'])}
                />
                <CText
                  styles={'textMeta pt2'}
                  customLabel={authState.getIn(['login', 'jobTitle'])}
                />
              </View>

              {/** INFORMATION */}
              <View style={[cStyles.fullWidth, {paddingTop: sW('30%')}]}>
                <View style={[cStyles.borderTop, cStyles.fullWidth]} />
                <CText
                  styles={'textMeta pt16'}
                  label={ACCOUNT.INFORMATION.label}
                />
                {ACCOUNT.INFORMATION.childrens.map((item, index) => (
                  <ListItem
                    showLineBottom={false}
                    index={index}
                    data={item}
                    dataLength={ACCOUNT.INFORMATION.childrens.length}
                    customColors={customColors}
                  />
                ))}
              </View>

              {/** SETTINGS */}
              <View style={[cStyles.fullWidth, cStyles.pt16]}>
                <CText styles={'textMeta'} label={ACCOUNT.SETTINGS.label} />
                {ACCOUNT.SETTINGS.childrens.map((item, index) => (
                  <ListItem
                    showLineBottom={false}
                    index={index}
                    data={item}
                    dataLength={ACCOUNT.SETTINGS.childrens.length}
                    customColors={customColors}
                    onPressSignOut={handleSignOut}
                  />
                ))}
              </View>
            </View>
            {/** SOCIALS */}
            <View style={[cStyles.fullWidth, cStyles.itemsStart, cStyles.pt16]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                {ACCOUNT.SOCIALS.map((item, index) => (
                  <SocialItem
                    index={index}
                    data={item}
                    customColors={customColors}
                    isDark={isDark}
                  />
                ))}
              </View>
            </View>

            <View style={cStyles.itemsStart}>
              <Text
                style={[
                  cStyles.textMeta,
                  cStyles.py16,
                  {color: customColors.text},
                ]}>
                &#169; 2021 DTP-Education
              </Text>
            </View>
          </ScrollView>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({});

export default Account;
