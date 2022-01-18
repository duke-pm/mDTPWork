/**
 ** Name: Account page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Account.js
 **/
import React, {useState, useEffect, useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTheme, Text, Layout} from "@ui-kitten/components";
import {
  StyleSheet, View, StatusBar, ScrollView,
  Linking,
} from "react-native";
import FastImage from "react-native-fast-image";
import VersionCheck from "react-native-version-check";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CMenuAccount from "~/components/CMenuAccount";
import CAlert from "~/components/CAlert";
import CLoading from "~/components/CLoading";
/* COMMON */
import Routes from "~/navigator/Routes";
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {ThemeContext} from "~/configs/theme-context";
import {
  AST_LOGIN,
  LIGHT,
} from "~/configs/constants";
import {
  removeSecretInfo,
  resetRoute,
  moderateScale,
} from "~/utils/helper";
/* REDUX */
import * as Actions from "~/redux/actions";

function Account(props) {
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);

  /** Use state */
  const [loading, setLoading] = useState(!__DEV__);
  const [alertLogout, setAlertLogout] = useState({
    status: false,
    isSignout: false,
  });
  const [versionApp, setVersionApp] = useState({
    needUpdate: false,
    number: "1.0.0",
  });
  const [menu1, setMenu1] = useState([
    {
      id: "edit_account",
      title: "account:my_account",
      subtitle: "account:holder_edit_account",
      icon: "person-outline",
      color: "color-primary-500",
      bgColor: "color-primary-transparent-500",
      renderNext: true,
      nextRoute: "MyAccount",
      value: null,
      alert: null,
    },
    {
      id: "changePassword",
      title: "account:change_password",
      subtitle: "account:holder_change_password",
      icon: "unlock-outline",
      color: "color-danger-500",
      bgColor: "color-danger-transparent-500",
      renderNext: true,
      nextRoute: "UpdatePassword",
      value: null,
      alert: null,
    },
  ]);
  const [menu2, setMenu2] = useState([
    {
      id: "settingsApp",
      title: "account:app_settings",
      subtitle: "account:holder_settings",
      icon: "settings-outline",
      color: "color-warning-500",
      bgColor: "color-warning-transparent-500",
      renderNext: true,
      nextRoute: "Settings",
      value: null,
      alert: null,
    },
    {
      id: "helpAndInfo",
      title: "account:help_and_info",
      subtitle: "account:holder_information",
      icon: "info-outline",
      color: "color-info-500",
      bgColor: "color-info-transparent-500",
      renderNext: true,
      nextRoute: "HelpAndInfo",
      value: null,
      alert: null,
    },
    {
      id: "hotline",
      title: "account:hotline",
      subtitle: null,
      icon: "phone-outline",
      color: "color-success-500",
      bgColor: "color-success-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: "1800 6242",
      alert: null,
      onPress: () => handleCallPhone("1800 6242"),
    },
    {
      id: "version",
      title: "account:version",
      subtitle: null,
      icon: "message-square-outline",
      color: "color-primary-500",
      bgColor: "color-primary-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: "1.0.0",
      alert: null,
    },
    {
      id: "signout",
      title: "account:sign_out",
      subtitle: null,
      icon: "log-out-outline",
      color: "color-danger-500",
      bgColor: "color-danger-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () => toggleAlertLogout(true, false),
    },
  ]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleAlertLogout = (status = false, isSignout = false) => {
    return setAlertLogout({status, isSignout});
  };

  const handleCallPhone = phoneNumber => {
    return Linking.openURL(`tel:${phoneNumber}`).catch(reason => {
      if (reason) alert(reason);
    });
  };

  const handleOk = isSignout => {
    setLoading(true);
    return toggleAlertLogout(false, isSignout);
  };

  const onSignOut = async () => {
    if (alertLogout.isSignout) {
      setLoading(true);
      await removeSecretInfo(AST_LOGIN);
      dispatch(Actions.logout());
      setLoading(false);
      return resetRoute(navigation, Routes.LOGIN_IN.name);
    }
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
    let fMenu = tmpMenu2.findIndex(f => f.id === "version");
    if (fMenu !== -1) {
      tmpMenu2[fMenu].value = tmpVersionCheck.number;
      setMenu2(tmpMenu2);
    }

    return setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Check version app */
    if (!__DEV__) {
      onCheckVersionApp();
    }
  }, []);

  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      const unsubscribe = navigation.addListener("focus", () => {
        StatusBar.setBarStyle("light-content", true);
      });
      return unsubscribe;
    }
  }, [themeContext.themeApp, navigation]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer safeArea={["top"]}>
      {/** Avatar + Name */}
      <Layout
        style={[
          cStyles.itemsCenter,
          cStyles.pb20,
          cStyles.pt10,
          cStyles.roundedBottomLeft8,
          cStyles.roundedBottomRight8,
        ]}>
        <View style={[styles.con_avatar, cStyles.center]}>
          <FastImage
            style={[cStyles.rounded10, styles.img_avatar]}
            resizeMode={FastImage.resizeMode.cover}
            source={Assets.iconUser}
          />
        </View>
        <Text style={cStyles.mt16} category="h6">
          {`${authState["login"]["fullName"]}`}
        </Text>
        <Text style={cStyles.mt5} category="c1">
          {authState["login"]["jobTitle"]}
        </Text>
      </Layout>

      {/** Actions */}
      <ScrollView style={cStyles.flex1}>
        <>
          <CMenuAccount data={menu1} />
          <CMenuAccount containerStyle={cStyles.mb10} data={menu2} />
        </>
      </ScrollView>

      <CAlert
        contentStyle={cStyles.m0}
        show={alertLogout.status}
        cancel
        label="common:app_name"
        message="account:alert_msg_log_out"
        textCancel="common:close"
        textOk="account:alert_log_out"
        statusOk="danger"
        onBackdrop={toggleAlertLogout}
        onCancel={toggleAlertLogout}
        onOk={() => handleOk(true)}
        onModalHide={onSignOut}
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
    backgroundColor: "rgba(255,255,255,.5)",
  },
  img_avatar: {
    height: moderateScale(80),
    width: moderateScale(80)
  },
});

export default Account;
