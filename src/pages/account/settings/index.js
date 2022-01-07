/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Config settings of App
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Settings.js
 **/
import React, {useState} from "react";
import {ScrollView} from "react-native";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CMenuAccount from "~/components/CMenuAccount";
/* COMMON */
import {cStyles} from "~/utils/style";

function Settings(props) {

  /** Use state */
  const [menu1, setMenu1] = useState([
    {
      id: "languages",
      title: "settings:language",
      subtitle: null,
      icon: "globe-outline",
      color: "color-primary-600",
      bgColor: "color-primary-transparent-500",
      renderNext: true,
      nextRoute: "Languages",
      value: null,
      alert: null,
    },
    {
      id: "themes",
      title: "settings:appearance",
      subtitle: null,
      icon: "color-palette-outline",
      color: "color-danger-600",
      bgColor: "color-danger-transparent-500",
      renderNext: true,
      nextRoute: "Appearance",
      value: null,
      alert: null,
    },
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top"]}
      headerComponent={
        <CTopNavigation title="settings:title" back/>
      }>
      {/** Actions */}
      <ScrollView style={cStyles.flex1}>
        <>
          <CMenuAccount data={menu1} />
        </>
      </ScrollView>
    </CContainer>
  );
}

export default Settings;
