/**
 ** Name: Account page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '@ui-kitten/components';
import {
  StyleSheet, View, ImageBackground, StatusBar, ScrollView,
  Linking,
} from 'react-native';
import VersionCheck from 'react-native-version-check';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CMenuAccount from '~/components/CMenuAccount';
import CAlert from '~/components/CAlert';
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
/* COMMON */
import Routes from '~/navigator/Routes';
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {AST_LOGIN, LIGHT} from '~/configs/constants';
import {
  IS_ANDROID,
  moderateScale,
  removeSecretInfo,
  resetRoute,
} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
/* REDUX */
import * as Actions from '~/redux/actions';

function Account(props) {
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [alertLogout, setAlertLogout] = useState({
    status: false,
    isSignout: false,
  });
  const [menu1, setMenu1] = useState([
    {
      id: 'edit_account',
      title: 'account:my_account',
      subtitle: 'account:holder_edit_account',
      icon: 'person-outline',
      color: 'color-primary-600',
      bgColor: 'color-primary-transparent-500',
      renderNext: true,
      nextRoute: 'MyAccount',
      value: null,
      alert: null,
    },
    {
      id: 'changePassword',
      title: 'account:change_password',
      subtitle: 'account:holder_change_password',
      icon: 'unlock-outline',
      color: 'color-danger-600',
      bgColor: 'color-danger-transparent-500',
      renderNext: true,
      nextRoute: 'UpdatePassword',
      value: null,
      alert: null,
    },
  ]);
  const [menu2, setMenu2] = useState([
    {
      id: 'settingsApp',
      title: 'account:app_settings',
      subtitle: 'account:holder_settings',
      icon: 'settings-outline',
      color: 'color-basic-600',
      bgColor: 'color-basic-transparent-500',
      renderNext: true,
      nextRoute: 'Settings',
      value: null,
      alert: null,
    },
    {
      id: 'helpAndInfo',
      title: 'account:help_and_info',
      subtitle: 'account:holder_information',
      icon: 'info-outline',
      color: 'color-info-600',
      bgColor: 'color-info-transparent-500',
      renderNext: true,
      nextRoute: 'HelpAndInfo',
      value: null,
      alert: null,
    },
    {
      id: 'hotline',
      title: 'account:hotline',
      subtitle: null,
      icon: 'phone-outline',
      color: 'color-success-600',
      bgColor: 'color-success-transparent-500',
      renderNext: false,
      nextRoute: null,
      value: '1800 6242',
      alert: null,
      onPress: () => handleCallPhone('1800 6242'),
    },
    {
      id: 'version',
      title: 'account:version',
      subtitle: null,
      icon: 'message-square-outline',
      color: 'color-primary-600',
      bgColor: 'color-primary-transparent-500',
      renderNext: false,
      nextRoute: null,
      value: '1.0.0',
      alert: null,
    },
    {
      id: 'signout',
      title: 'account:sign_out',
      subtitle: null,
      icon: 'log-out-outline',
      color: 'color-danger-600',
      bgColor: 'color-danger-transparent-500',
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () => toggleAlertLogout(true, false),
    },
  ]);
  const [versionApp, setVersionApp] = useState({
    needUpdate: false,
    number: '1.0.0',
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleAlertLogout = (status = false, isSignout = false) => {
    setAlertLogout({status, isSignout});
  };

  const handleCallPhone = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`).catch(reason => {
      console.log('[LOG] === ERROR Call Phone ===> ', reason);
      if (reason) alert(reason);
    });
  };

  const handleOk = isSignout => {
    setLoading(true);
    toggleAlertLogout(false, isSignout);
  };

  const onSignOut = async () => {
    setLoading(true);
    await removeSecretInfo(AST_LOGIN);
    dispatch(Actions.logout());
    setLoading(false);
    resetRoute(navigation, Routes.LOGIN_IN.name);
  };

  const onCheckVersionApp = async () => {
    /** Get version app from store */
    let tmpVersionCheck = {...versionApp},
      latestVersion = await VersionCheck.getLatestVersion(),
      needUpdate = await VersionCheck.needUpdate();
    if (latestVersion)
      tmpVersionCheck.number = latestVersion;
    if (needUpdate && needUpdate.isNeeded)
      tmpVersionCheck.needUpdate = needUpdate;
    setVersionApp(tmpVersionCheck);

    /** Set value for menu */
    let tmpMenu2 = [...menu2];
    let fMenu = tmpMenu2.findIndex(f => f.id === 'version');
    if (fMenu !== -1) {
      tmpMenu2[fMenu].value = tmpVersionCheck.number;
      setMenu2(tmpMenu2);
    }

    setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Check version app */
    onCheckVersionApp();
  }, []);

  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      const unsubscribe = navigation.addListener('focus', () => {
        StatusBar.setBarStyle('dark-content', true);
        IS_ANDROID &&
          StatusBar.setBackgroundColor('white', true);
      });
      return unsubscribe;
    }
  }, [themeContext.themeApp, navigation]);

  useEffect(() => {
    if (!alertLogout.status) {
      if (alertLogout.isSignout) {
        onSignOut();
      }
    }
  }, [
    alertLogout.status,
    alertLogout.isSignout,
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer safeArea={['top']} backgroundColor={theme['color-primary-400']}>
      {/** Avatar + Name */}
      <View
        style={[
          cStyles.itemsCenter,
          cStyles.pb20,
          cStyles.pt10,
          cStyles.roundedBottomLeft8,
          cStyles.roundedBottomRight8,
          {backgroundColor: theme['color-primary-400']}
        ]}>
        <View style={[styles.con_avatar, cStyles.center]}>
          <ImageBackground
            style={styles.img_avatar}
            borderRadius={moderateScale(50)}
            resizeMode={'cover'}
            source={Assets.iconUser}>
          </ImageBackground>
        </View>
        <CText style={cStyles.mt16} category='h6' status='control'>
          {`${authState.getIn(['login', 'fullName'])}`}
        </CText>
        <CText category='c1' status='control'>
          {authState.getIn(['login', 'jobTitle'])}
        </CText>
      </View>

      {/** Actions */}
      <ScrollView style={cStyles.flex1}>
        <>
          <CMenuAccount data={menu1} />
          <CMenuAccount containerStyle={cStyles.mb16} data={menu2} />
        </>
      </ScrollView>

      <CAlert
        contentStyle={cStyles.m0}
        show={alertLogout.status}
        cancel={true}
        label={'common:app_name'}
        message={'account:alert_msg_log_out'}
        textCancel={'common:close'}
        textOk={'account:alert_log_out'}
        statusOk={'danger'}
        onBackdrop={toggleAlertLogout}
        onCancel={toggleAlertLogout}
        onOk={() => handleOk(true)}
      />
      <CLoading show={loading} />
    </CContainer>
  )
}

const styles = StyleSheet.create({
  con_avatar: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(90),
    backgroundColor: 'rgba(255,255,255,.5)',
  },
  img_avatar: {
    height: moderateScale(80),
    width: moderateScale(80)
  },
});

export default Account;
