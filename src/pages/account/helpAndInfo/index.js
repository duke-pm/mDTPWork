/* eslint-disable no-sparse-arrays */
/**
 ** Name: Help and info page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of HelpAndInfo.js
 **/
import React, {useEffect, useState} from "react";
import {Linking, ScrollView} from "react-native";
import Rate, {AndroidMarket} from "react-native-rate";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CMenuAccount from "~/components/CMenuAccount";
/** COMMON */
import Configs from "~/configs";
import {cStyles} from "~/utils/style";

function HelpAndInfo(props) {

  /** Use state */
  const [menu1, setMenu1] = useState([
    {
      id: "contactUs",
      title: "help_and_info:contact_us",
      subtitle: null,
      icon: "people-outline",
      color: "color-primary-600",
      bgColor: "color-primary-transparent-500",
      renderNext: true,
      nextRoute: "ContactUs",
      value: null,
      alert: null,
    },
  ]);
  const [menu2, setMenu2] = useState([
    {
      id: "termAndConditions",
      title: "help_and_info:privacy_policies",
      subtitle: null,
      icon: "shield-outline",
      color: "color-danger-600",
      bgColor: "color-danger-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () =>
        handleGoURL("https://www.dtp-education.com/gioi-thieu/"),
    },
    {
      id: "termAndConditions",
      title: "help_and_info:term_conditions",
      subtitle: null,
      icon: "checkmark-circle-outline",
      color: "color-warning-600",
      bgColor: "color-warning-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () =>
        handleGoURL("https://www.dtp-education.com/gioi-thieu/tam-nhin-su-menh/"),
    },
    {
      id: "aboutUs",
      title: "help_and_info:about_us",
      subtitle: null,
      icon: "person-done-outline",
      color: "color-info-600",
      bgColor: "color-info-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () =>
        handleGoURL("https://www.dtp-education.com/?v=1"),
    },
  ]);
  const [menu3, setMenu3] = useState([
    {
      id: "rateApp",
      title: "help_and_info:rate_app",
      subtitle: null,
      icon: "star-outline",
      color: "color-warning-600",
      bgColor: "color-warning-transparent-500",
      renderNext: false,
      nextRoute: null,
      value: null,
      alert: null,
      onPress: () => toogleRating(),
    },
  ]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toogleRating = () => {
    const options = {
      AppleAppID: Configs.appStoreID,
      GooglePackageName: Configs.googlePlayPackage,
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
    };
    Rate.rate(options, success => {
      if (success) {
        console.log("[LOG] === SUCCESS RATE ===> ", success);
      }
    });
  };

  const handleGoURL = url => Linking.openURL(url);

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top"]}
      headerComponent={
        <CTopNavigation title="help_and_info:title" back/>
      }>
      {/** Actions */}
      <ScrollView style={cStyles.flex1}>
        <>
          <CMenuAccount data={menu1} />
          <CMenuAccount data={menu2} />
          <CMenuAccount containerStyle={cStyles.mb16} data={menu3} />
        </>
      </ScrollView>
    </CContainer>
  );
}

export default HelpAndInfo;
