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
import {StyleSheet, View, Text, Linking} from 'react-native';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
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
import Icons from '~/utils/common/Icons';
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
        icon: 'person-outline',
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
        icon: 'lock-open-outline',
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
        icon: IS_IOS ? 'cog-outline' : 'settings-outline',
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
        icon: 'information-circle-outline',
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
        icon: 'call-outline',
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
        icon: 'log-out-outline',
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

const Socials = React.memo(
  ({
    customColors = {},
    isDark = false,
    isTablet = false,
    needUpdate = {},
    onUpdate = () => null,
  }) => {
    return (
      <CGroupInfo
        contentStyle={[
          cStyles.mb10,
          cStyles.px10,
          isTablet ? cStyles.mx10 : cStyles.mx16,
        ]}
        content={
          <>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <Text style={[cStyles.textCaption1, {color: customColors.text}]}>
                &#169; {`${moment().year()} ${Configs.nameOfApp}`}
              </Text>
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
            </View>

            <View style={[cStyles.mt6, cStyles.row, cStyles.itemsCenter]}>
              <Text
                style={[
                  cStyles.textCaption1,
                  cStyles.mt5,
                  {color: customColors.text},
                ]}>
                {`v${VersionCheck.getCurrentVersion()}`}
              </Text>
              {needUpdate.status && (
                <CButton
                  style={[cStyles.ml10, cStyles.px6]}
                  textStyle={cStyles.textCaption1}
                  variant={'text'}
                  icon={Icons.download}
                  label={'common:download'}
                  onPress={onUpdate}
                />
              )}
            </View>
          </>
        }
      />
    );
  },
);

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
  const [needUpdate, setNeedUpdate] = useState({
    status: false,
    linkUpdate: '',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleUpdate = () => Linking.openURL(needUpdate.linkUpdate);

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
      hasShapes
      content={
        <CContent
          contentStyle={IS_ANDROID ? cStyles.mt24 : {}}
          showsVerticalScrollIndicator={false}>
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

const styles = StyleSheet.create({
  left: {flex: 0.4},
  right: {flex: 0.6},
});

export default Account;
