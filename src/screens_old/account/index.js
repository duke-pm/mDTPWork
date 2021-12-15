/**
 ** Name: Account page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import CGroupInfo from '~/components/CGroupInfo';
import ListItem from './components/ListItem';
import SocialItem from './components/SocialItem';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {LOGIN, THEME_DARK} from '~/config/constants';
import {
  alert,
  IS_ANDROID,
  IS_IOS,
  removeSecretInfo,
  resetRoute,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** all init */
const ACCOUNT = {
  INFORMATION: {
    id: 'information',
    label: 'account:information',
    childrens: [
      {
        id: 'myAccount',
        icon: 'person',
        iconColor: colors.BLUE,
        label: 'account:my_account',
        value: null,
        nextRoute: 'MyAccount',
        isPhone: false,
        isSignOut: false,
        isRate: false,
        isURL: false,
      },
      {
        id: 'changePassword',
        icon: 'lock-open',
        iconColor: colors.PURPLE,
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
        icon: IS_IOS ? 'cog' : 'settings',
        iconColor: colors.GRAY_500,
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
        icon: 'information-circle',
        iconColor: colors.ORANGE,
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
        icon: 'call',
        iconColor: colors.TEAL,
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
        iconColor: colors.RED,
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

const Information = React.memo(({isTablet = false, authState = {}}) => {
  return (
    <CGroupInfo
      contentStyle={[
        cStyles.mb0,
        cStyles.px10,
        isTablet ? cStyles.mx10 : cStyles.mx16,
      ]}
      content={
        <View
          style={
            isTablet
              ? [cStyles.itemsCenter]
              : [cStyles.row, cStyles.itemsCenter]
          }>
          <CAvatar
            isEdit={false}
            size={'large'}
            label={authState.getIn(['login', 'fullName'])}
          />

          <View
            style={
              isTablet ? [cStyles.itemsCenter, cStyles.mt16] : cStyles.mx16
            }>
            <CText
              customStyles={[
                cStyles.textHeadline,
                isTablet && cStyles.textCenter,
              ]}
              customLabel={authState.getIn(['login', 'fullName'])}
            />
            <CText
              customStyles={[
                cStyles.textCaption1,
                cStyles.mt6,
                isTablet && cStyles.textCenter,
              ]}
              customLabel={authState.getIn(['login', 'jobTitle'])}
            />
          </View>
        </View>
      }
    />
  );
});

const Socials = React.memo(({isDark = false, isTablet = false}) => {
  return (
    <CGroupInfo
      contentStyle={[
        cStyles.mb10,
        cStyles.px10,
        isTablet ? cStyles.mx10 : cStyles.mx16,
      ]}
      content={
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          {Configs.socialsNetwork.map((item, index) => (
            <SocialItem
              key={item.id}
              index={index}
              data={item}
              isDark={isDark}
            />
          ))}
        </View>
      }
    />
  );
});

function Account(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSignOut = () => alert(t, 'common:warning_sign_out', handleOk);

  const handleOk = async () => {
    setLoading(true);
    await removeSecretInfo(LOGIN);
    dispatch(Actions.logout());
    setLoading(false);
    resetRoute(props.navigation, Routes.AUTHENTICATION.SIGN_IN.name);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let checkTablet = DeviceInfo.isTablet();
    setIsTablet(checkTablet);
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      safeArea={{top: true, bottom: false}}
      hasShapes
      content={
        <CContent showsVerticalScrollIndicator={false}>
          <View
            style={
              isTablet
                ? [cStyles.row, cStyles.itemsStart, cStyles.justifyCenter]
                : []
            }>
            <View style={isTablet ? styles.left : {}}>
              {isTablet && (
                <Information isTablet={isTablet} authState={authState} />
              )}
              {isTablet && <Socials isDark={isDark} isTablet={isTablet} />}
            </View>

            <View style={isTablet ? styles.right : cStyles.flex1}>
              {!isTablet && (
                <Information isTablet={isTablet} authState={authState} />
              )}

              {/** INFORMATION */}
              <CGroupInfo
                contentStyle={[
                  isTablet ? cStyles.mx10 : cStyles.mx16,
                  isTablet ? cStyles.mb10 : cStyles.mb0,
                  cStyles.px10,
                ]}
                // label={ACCOUNT.INFORMATION.label}
                content={ACCOUNT.INFORMATION.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    translate={t}
                    navigation={navigation}
                    customColors={customColors}
                    lastIndex={ACCOUNT.INFORMATION.childrens.length - 1}
                    data={item}
                  />
                ))}
              />

              {/** SETTINGS */}
              <CGroupInfo
                contentStyle={[
                  isTablet ? cStyles.mx10 : cStyles.mx16,
                  isTablet ? cStyles.mb10 : cStyles.mb0,
                  cStyles.px10,
                ]}
                // label={ACCOUNT.SETTINGS.label}
                content={ACCOUNT.SETTINGS.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    translate={t}
                    navigation={navigation}
                    customColors={customColors}
                    lastIndex={ACCOUNT.SETTINGS.childrens.length - 1}
                    data={item}
                    onSignOut={handleSignOut}
                  />
                ))}
              />

              {/** SOCIALS */}
              {!isTablet && <Socials isDark={isDark} isTablet={isTablet} />}
            </View>
          </View>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  left: {flex: 0.4},
  right: {flex: 0.6},
});

export default Account;
