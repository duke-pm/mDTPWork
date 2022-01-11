/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom Container
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import PropTypes from "prop-types";
import React, {useContext, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {SafeAreaView} from "react-native-safe-area-context";
import {
  Layout, Spinner, useTheme, Text,
} from "@ui-kitten/components";
import {StatusBar, View} from "react-native";
/* COMMON */
import {cStyles} from "~/utils/style";
import {ThemeContext} from "~/configs/theme-context";
import {IS_ANDROID} from "~/utils/helper";
import {
  DARK,
  LIGHT,
} from "~/configs/constants";

const colorBackground = "background-basic-color-1";

function CContainer(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const theme = useTheme();
  const {
    safeArea = [],
    backgroundColor = null,
    loading = false,
    headerComponent = null,
    children = null,
  } = props;
  const mainColor = backgroundColor || theme[colorBackground];

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      StatusBar.setBarStyle("dark-content", true);
      IS_ANDROID &&
        StatusBar.setBackgroundColor(mainColor, true);
    }
    if (themeContext.themeApp === DARK) {
      StatusBar.setBarStyle("light-content", true);
      IS_ANDROID &&
        StatusBar.setBackgroundColor(mainColor, true);
    }
  }, [themeContext.themeApp]);

  /************
   ** RENDER **
   ************/
  let safeAreaScreen = ["left", "right"];
  safeAreaScreen = safeAreaScreen.concat(safeArea);
  return (
    <SafeAreaView
      style={[cStyles.flex1, {backgroundColor: mainColor}]}
      edges={safeAreaScreen}>
      {headerComponent}
      <Layout
        style={cStyles.flex1}
        level="2">
        {!loading && children}
        {loading && (
          <View style={cStyles.flexCenter}>
            <Spinner />
            <Text
              style={cStyles.mt10}
              category="c1"
              appearance="hint">
              {t("common:loading")}
            </Text>
          </View>
        )}
      </Layout>
    </SafeAreaView>
  );
}

CContainer.propTypes = {
  safeArea: PropTypes.array,
  backgroundColor: PropTypes.string,
  loading: PropTypes.bool,
  headerComponent: PropTypes.element,
  children: PropTypes.element,
};

export default CContainer;
