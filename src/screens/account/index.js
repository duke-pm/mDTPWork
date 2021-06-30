/**
 ** Name: Account
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Text, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import ListItem from './components/ListItem';
import SocialItem from './components/SocialItem';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';
import {alert, clearSecretInfo, resetRoute, sW} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
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
        nextRoute: 'NotReady',
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
      {
        id: 'changePassword',
        icon: 'edit',
        label: 'account:change_password',
        value: null,
        nextRoute: 'ChangePassword',
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
        id: 'signout',
        icon: 'log-out',
        label: 'common:sign_out',
        value: null,
        nextRoute: null,
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
    ],
  },
};

function Account(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [needUpdate, setNeedUpdate] = useState({
    status: false,
    linkUpdate: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
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

  const handleUpdate = () => {
    Linking.openURL(needUpdate.linkUpdate);
  };

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

  /*****************
   ** RENDER **
   *****************/
  return (
    <CContainer
      loading={loading}
      title={'account:title'}
      header
      content={
        <CContent scroll contentStyle={cStyles.p16}>
          <View style={cStyles.flex1}>
            <View
              style={[
                cStyles.rounded2,
                cStyles.py16,
                {backgroundColor: isDark ? customColors.card : colors.WHITE},
              ]}>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.px16]}>
                <CAvatar
                  isEdit={true}
                  size={'large'}
                  label={authState.getIn(['login', 'fullName'])}
                />

                <View style={cStyles.mx16}>
                  <CText
                    styles={'H6'}
                    customLabel={authState.getIn(['login', 'fullName'])}
                  />
                  <CText
                    styles={'textMeta pt5'}
                    customLabel={authState.getIn(['login', 'jobTitle'])}
                  />
                </View>
              </View>

              {/** INFORMATION */}
              <View style={[cStyles.fullWidth, cStyles.mt16]}>
                <View
                  style={[
                    cStyles.borderTop,
                    isDark && cStyles.borderTopDark,
                    cStyles.fullWidth,
                  ]}
                />
                <CText
                  styles={'textMeta pt16 pl16'}
                  label={ACCOUNT.INFORMATION.label}
                />
                {ACCOUNT.INFORMATION.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    data={item}
                    customColors={customColors}
                  />
                ))}
              </View>

              {/** SETTINGS */}
              <View style={[cStyles.fullWidth, cStyles.pt16]}>
                <CText styles={'textMeta pl16'} label={ACCOUNT.SETTINGS.label} />
                {ACCOUNT.SETTINGS.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    data={item}
                    customColors={customColors}
                    onSignOut={handleSignOut}
                  />
                ))}
              </View>
            </View>

            {/** SOCIALS */}
            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View>
                <View style={[cStyles.itemsStart, cStyles.pt16]}>
                  <Text style={[cStyles.textMeta, {color: customColors.text}]}>
                    &#169; 2021 DTP-Education
                  </Text>
                </View>

                <View style={[cStyles.itemsStart, cStyles.mt10]}>
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    {Configs.socialsNetwork.map((item, index) => (
                      <SocialItem
                        key={item.id}
                        index={index}
                        data={item}
                        customColors={customColors}
                        isDark={isDark}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={[cStyles.pt16, cStyles.itemsEnd]}>
                <Text
                  style={[
                    cStyles.textMeta,
                    cStyles.mt5,
                    {color: customColors.text},
                  ]}>
                  {`v${VersionCheck.getCurrentVersion()}`}
                </Text>
                {needUpdate.status && (
                  <CButton
                    style={[cStyles.mt10, styles.btn_update]}
                    variant={'outlined'}
                    icon={'download'}
                    onPress={handleUpdate}
                  />
                )}
              </View>
            </View>
          </View>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  btn_update: {height: 35},
});

export default Account;
