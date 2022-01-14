/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Config settings of App
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Settings.js
 **/
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ScrollView} from "react-native";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CMenuAccount from "~/components/CMenuAccount";
/* COMMON */
import {cStyles} from "~/utils/style";
/** REDUX */
import store from "~/redux/store";

function Settings(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);

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
      value: t(`settings:${commonState["language"]}`),
      alert: null,
      onRefresh: () => onCheckCommonData(),
    },
    {
      id: "themes",
      title: "settings:appearance",
      subtitle: "settings:holder_appearance",
      icon: "color-palette-outline",
      color: "color-danger-600",
      bgColor: "color-danger-transparent-500",
      renderNext: true,
      nextRoute: "Appearance",
      value: t(`settings:${commonState["theme"]}`),
      alert: null,
      onRefresh: () => onCheckCommonData(),
    },
  ]);

  const [menu2, setMenu2] = useState([
    {
      id: "formatDate",
      title: "settings:format_date",
      subtitle: "settings:holder_format_date",
      icon: "calendar-outline",
      color: "color-basic-600",
      bgColor: "color-basic-transparent-500",
      renderNext: true,
      nextRoute: "DateTime",
      value: commonState["formatDateView"]
        + "\n"
        + commonState["formatTimeView"],
      alert: null,
      onRefresh: () => onCheckCommonData(),
    },
  ]);

  /**********
   ** FUNC **
   **********/
  const onCheckCommonData = () => {
    let {common} = store.getState(),
      tmpMenu1 = [...menu1],
      tmpMenu2 = [...menu2];
    tmpMenu1[0].value = t(`settings:${common["language"]}`);
    tmpMenu1[1].value = t(`settings:${common["theme"]}`);
    tmpMenu2[0].value = common["formatDateView"]
      + "\n"
      + common["formatTimeView"];
    setMenu1(tmpMenu1);
    setMenu2(tmpMenu2);
  };

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
          <CMenuAccount data={menu2} />
        </>
      </ScrollView>
    </CContainer>
  );
}

export default Settings;
