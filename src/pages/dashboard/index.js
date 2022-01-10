/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useRef, useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useTheme, Avatar, Layout, Text, Spinner} from "@ui-kitten/components";
import {StatusBar, StyleSheet, View} from "react-native";
import * as Animatable from "react-native-animatable";
import moment from "moment";
import "moment/locale/en-sg";
/** COMPONENTS */
import CContainer from "~/components/CContainer";
import CItem from "~/components/CItem";
/** COMMON */
import Configs from "~/configs";
import {ThemeContext} from "~/configs/theme-context";
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {
  IS_ANDROID,
} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_10,
  LIGHT,
} from "~/configs/constants";

const MyContent = Animatable.createAnimatableComponent(Layout);
const colorBgHeader = "background-basic-color-2";

function Dashboard(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {navigation} = props;

  /** Use ref */
  const contentRef = useRef();

  /** Use redux */
  const authState = useSelector(({auth}) => auth);
  const fullName = authState.getIn(["login", "fullName"]);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = (dataRoute, idxRoute) => {
    navigation.navigate(dataRoute.mName, {
      idRouteParent: dataRoute.menuID,
    });
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(["login", "lstMenu"]);
    if (tmpListMenu && tmpListMenu.lstPermissionItem.length > 0) {
      /** Check permission user can access */
      let item = null,
        tmpRoutes = [];
      for (item of tmpListMenu.lstPermissionItem) {
        if (item.isAccess) {
          tmpRoutes.push(item);
        }
      }
      tmpRoutes.sort((a, b) => {
        if (a.menuID > b.menuID) {
          return 1;
        } else if (a.menuID < b.menuID) {
          return -1;
        } else {
          return 0;
        }
      });
      setRoutes(tmpRoutes);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  useEffect(() => {
    if (loading) {
      return contentRef.current.fadeInUp(500).then(endState => {
        if (endState.finished) {
          setLoading(false);
        }
      });
    }
  }, [loading, routes]);

  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      const unsubscribe = navigation.addListener("focus", () => {
        StatusBar.setBarStyle("dark-content", true);
        IS_ANDROID &&
          StatusBar.setBackgroundColor(theme[colorBgHeader], true);
      });
      return unsubscribe;
    }
  }, [themeContext.themeApp, navigation]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer safeArea={["top"]} backgroundColor={theme[colorBgHeader]}>
      <Layout
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.px16,
          cStyles.py24
        ]}
        level="2">
        <View>
          <Text>{`${moment().format(DEFAULT_FORMAT_DATE_10)}`}</Text>
          <Text style={cStyles.mt5} category="h6">
            {`${t("dashboard:welcome")} ${fullName}`}
          </Text>
          <Text style={cStyles.mt5} category="c1">
            {t("dashboard:welcome_1")}
          </Text>
        </View>
        <Avatar size="giant" source={Assets.iconUser} />
      </Layout>

      <MyContent
        ref={contentRef}
        style={[
          cStyles.flex1,
          cStyles.roundedTopLeft8,
          cStyles.roundedTopRight8,
          cStyles.shadowListItem,
        ]}>
        <View
          style={[
            cStyles.row,
            cStyles.justifyEvenly,
            cStyles.flexWrap,
            cStyles.pt16,
            styles.list_item,
          ]}>
          {loading && (
            <View style={cStyles.center}>
              <View style={cStyles.mt16}>
                <Spinner />
              </View>
            </View>
          )}

          {!loading && routes.map((item, index) => {
            if (item.isAccess) {
              const timeAnim = (index + 1) * 150;
              return (
                <Animatable.View
                  key={item.menuID + "_" + index}
                  animation="fadeInUp"
                  duration={timeAnim}>
                  <CItem
                    index={index}
                    data={item}
                    colors={Configs.colorsSubMenu.main[index].colors}
                    bgColor={Configs.colorsSubMenu.main[index].bgColor}
                    onPress={handleItem}
                  />
                </Animatable.View>
              );
            }
            return null;
          })}
        </View>
      </MyContent>
    </CContainer>
  );
}

const styles = StyleSheet.create({
  list_item: {flex: 0.5},
});

export default Dashboard;
