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
import {View, Text, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import CGroupInfo from '~/components/CGroupInfo';
import ListItem from './components/ListItem';
import SocialItem from './components/SocialItem';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {LOGIN, THEME_DARK} from '~/config/constants';
import {alert, IS_IOS, removeSecretInfo, resetRoute} from '~/utils/helper';
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
        icon: 'person-outline',
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
        icon: 'lock-open-outline',
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
        icon: IS_IOS ? 'cog-outline' : 'settings-outline',
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
        icon: 'information-circle-outline',
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
        icon: 'call-outline',
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
        icon: 'log-out-outline',
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

const Information = ({isTablet, authState}) => {
  return (
    <CGroupInfo
      contentStyle={[
        isTablet ? cStyles.mx10 : cStyles.mx16,
        cStyles.mb10,
        cStyles.px10,
      ]}
      content={
        <View
          style={
            isTablet
              ? [cStyles.itemsCenter]
              : [cStyles.row, cStyles.itemsCenter]
          }>
          <CAvatar
            isEdit={true}
            size={'large'}
            label={authState.getIn(['login', 'fullName'])}
          />

          <View
            style={[
              cStyles.mx16,
              isTablet && [cStyles.itemsCenter, cStyles.mt16],
            ]}>
            <CText
              styles={'H6'}
              customLabel={authState.getIn(['login', 'fullName'])}
            />
            <CText
              customStyles={[
                cStyles.textMeta,
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
};

const Socials = ({customColors, isDark, isTablet, needUpdate, onUpdate}) => {
  return (
    <CGroupInfo
      contentStyle={[
        isTablet ? cStyles.mx10 : cStyles.mx16,
        cStyles.mb10,
        cStyles.px10,
      ]}
      content={
        <>
          <View style={[cStyles.itemsStart, cStyles.mt10]}>
            <Text style={[cStyles.textMeta, {color: customColors.text}]}>
              &#169; {Configs.nameOfApp}
            </Text>
          </View>

          <View style={[cStyles.mt6, cStyles.row, cStyles.itemsCenter]}>
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
                style={[cStyles.ml10, cStyles.px6]}
                textStyle={cStyles.textMeta}
                variant={'outlined'}
                icon={'download'}
                label={'common:download'}
                onPress={onUpdate}
              />
            )}
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
        </>
      }
    />
  );
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
  const [isTablet, setIsTablet] = useState(false);
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
    await removeSecretInfo(LOGIN);
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
    let checkTablet = DeviceInfo.isTablet();
    setIsTablet(checkTablet);
  }, []);

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
      loading={loading}
      content={
        <CContent
          contentStyle={cStyles.pt10}
          showsVerticalScrollIndicator={false}>
          <View
            style={
              isTablet
                ? [cStyles.row, cStyles.itemsStart, cStyles.justifyCenter]
                : []
            }>
            <View style={isTablet ? {flex: 0.4} : {}}>
              {isTablet && (
                <Information isTablet={isTablet} authState={authState} />
              )}
              {isTablet && (
                <Socials
                  isDark={isDark}
                  isTablet={isTablet}
                  customColors={customColors}
                  needUpdate={needUpdate}
                  onUpdate={handleUpdate}
                />
              )}
            </View>

            <View style={isTablet ? {flex: 0.6} : cStyles.flex1}>
              {!isTablet && (
                <Information isTablet={isTablet} authState={authState} />
              )}

              {/** INFORMATION */}
              <CGroupInfo
                contentStyle={[
                  isTablet ? cStyles.mx10 : cStyles.mx16,
                  cStyles.mb10,
                  cStyles.px10,
                ]}
                label={ACCOUNT.INFORMATION.label}
                content={ACCOUNT.INFORMATION.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    data={item}
                    customColors={customColors}
                  />
                ))}
              />

              {/** SETTINGS */}
              <CGroupInfo
                contentStyle={[
                  isTablet ? cStyles.mx10 : cStyles.mx16,
                  cStyles.mb10,
                  cStyles.px10,
                ]}
                label={ACCOUNT.SETTINGS.label}
                content={ACCOUNT.SETTINGS.childrens.map((item, index) => (
                  <ListItem
                    key={item.id}
                    index={index}
                    data={item}
                    customColors={customColors}
                    onSignOut={handleSignOut}
                  />
                ))}
              />

              {/** SOCIALS */}
              {!isTablet && (
                <Socials
                  isDark={isDark}
                  isTablet={isTablet}
                  customColors={customColors}
                  needUpdate={needUpdate}
                  onUpdate={handleUpdate}
                />
              )}
            </View>
          </View>
        </CContent>
      }
    />
  );
}

export default Account;
