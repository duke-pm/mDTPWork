/**
 ** Name: Account page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Spinner, useTheme} from '@ui-kitten/components';
import {StyleSheet, View, ImageBackground, StatusBar, ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CMenuAccount from '~/components/CMenuAccount';
import CAlert from '~/components/CAlert';
import CText from '~/components/CText';
// import CContent from '~/components/CContent';
// import CAvatar from '~/components/CAvatar';
// import CText from '~/components/CText';
// import CGroupInfo from '~/components/CGroupInfo';
// import ListItem from './components/ListItem';
// import SocialItem from './components/SocialItem';
/* COMMON */
import Configs from '~/configs';
import Routes from '~/navigator/Routes';
import { Assets } from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';
import {AST_LOGIN} from '~/configs/constants';
import {
  alert,
  IS_ANDROID,
  IS_IOS,
  moderateScale,
  removeSecretInfo,
  resetRoute,
} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';
import CLoading from '~/components/CLoading';

/** all init */

// const Socials = React.memo(({isDark = false, isTablet = false}) => {
//   return (
//     <CGroupInfo
//       contentStyle={[
//         cStyles.mb10,
//         cStyles.px10,
//         isTablet ? cStyles.mx10 : cStyles.mx16,
//       ]}
//       content={
//         <View style={[cStyles.row, cStyles.itemsCenter]}>
//           {Configs.socialsNetwork.map((item, index) => (
//             <SocialItem
//               key={item.id}
//               index={index}
//               data={item}
//               isDark={isDark}
//             />
//           ))}
//         </View>
//       }
//     />
//   );
// });

function Account(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState(false);
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
      value: '1800 6242',
      alert: null,
      onPress: () => toggleAlertLogout(true, false),
    },
  ]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleAlertLogout = (status = false, isSignout = false) => {
    setAlertLogout({status, isSignout});
  };

  const handleOk = (isSignout) => {
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setBarStyle('light-content', true);
      IS_ANDROID &&
        StatusBar.setBackgroundColor(theme['color-primary-400'], true);
    });
    return unsubscribe;
  }, [navigation]);

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
