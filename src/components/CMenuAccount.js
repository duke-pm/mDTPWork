/**
 ** Name: Custom Menu Account
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CMenuAccount.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import {
  Layout, ListItem, Menu, Text, Icon, useTheme,
} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
/* COMMON */
import Routes from "~/navigator/Routes";
import {colors, cStyles} from "~/utils/style";
import {moderateScale} from "~/utils/helper";

const colorError = "color-danger-500";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderRightValue = info =>
  <Text
    style={cStyles.textRight}
    category="c1"
    appearance="hint"
    >{info.value}</Text>;

const RenderForwardIcon = (props, theme, info) => (
  <View style={[cStyles.row, cStyles.itemsCenter]}>
    {info.alert && (
      <View
        style={[
          cStyles.rounded4,
          cStyles.center,
          {backgroundColor: theme[colorError]},
          styles.con_holder_row,
        ]}>
        <Text category="c1" status="control">{info.alert}</Text>
      </View>
    )}
    {info.value && (
      <Text
        style={cStyles.textRight}
        category="c1"
        appearance="hint">
        {info.value}
      </Text>
    )}
    <Icon {...props} name="arrow-ios-forward" />
  </View>
);

const RenderLeftIcon = (props, theme, name, color, bgColor) => (
  <View
    style={[
      cStyles.mx5,
      cStyles.rounded10,
      cStyles.center,
      {backgroundColor: theme[bgColor]},
      styles.con_icon,
    ]}>
    <Icon {...props} name={name} fill={theme[color]} />
  </View>
);
 
/********************
 ** MAIN COMPONENT **
 ********************/
function CMenuAccount(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    containerStyle = {},
    data = [
      {
        id: "help",
        title: "account:help",
        icon: "question-mark-circle-outline",
        color: "color-primary-500",
        bgColor: "color-primary-transparent-500",
        renderNext: true,
        nextRoute: Routes.MY_ACCOUNT.name,
        value: null,
        alert: null,
        onPress: null,
      },
      {
        id: "log_out",
        title: "account:log_out",
        icon: "log-out-outline",
        color: "color-danger-500",
        bgColor: "color-danger-transparent-500",
        renderNext: false,
        nextRoute: null,
        value: null,
        alert: null,
        onPress: () => null,
      },
    ],
  } = props;

  /**********
   ** FUNC **
   **********/
  const handleGoMenuItem = (nextRoute, onRefresh) => {
    if (nextRoute) {
      navigation.navigate(nextRoute, {
        onRefresh,
      });
    }
  };

  /************
   ** RENDER **
   ************/
  return (
    <Layout
      style={[
        cStyles.rounded1,
        cStyles.mx10,
        cStyles.mt10,
        containerStyle,
      ]}>
      <View
        style={[
          cStyles.rounded2,
          styles.con_menu,
        ]}
        scrollEnabled={false}>
        {data.map((itemM, indexM) => {
          return (
            <ListItem
              key={itemM.id + "_" + indexM}
              style={[
                indexM === 0 && cStyles.roundedTopLeft1,
                indexM === 0 && cStyles.roundedTopRight1,
                indexM === data.length - 1 && cStyles.roundedBottomLeft1,
                indexM === data.length - 1 && cStyles.roundedBottomRight1,
              ]}
              title={propsT =>
                <Text style={cStyles.ml8} category="s1">{t(itemM.title)}</Text>
              }
              description={itemM.subtitle
                ? propsD =>
                  <Text style={cStyles.ml8} category="c1" appearance="hint">
                    {t(itemM.subtitle)}
                  </Text>
                : undefined
              }
              accessoryLeft={propsIc =>
                RenderLeftIcon(propsIc, theme, itemM.icon, itemM.color, itemM.bgColor)
              }
              accessoryRight={itemM.renderNext
                ? propsR => RenderForwardIcon(propsR, theme, itemM)
                : itemM.value
                  ? propsR => RenderRightValue(itemM)
                  : undefined
              }
              onPress={itemM.renderNext
                ? () => handleGoMenuItem(itemM.nextRoute, itemM.onRefresh)
                : itemM.onPress
              }
            />
          )
        })}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_icon: {
    height: moderateScale(40),
    width: moderateScale(40),
  },
  con_holder_row: {
    height: moderateScale(16),
    width: moderateScale(16),
  },
  con_menu: {backgroundColor: colors.TRANSPARENT},
});

CMenuAccount.propTypes = {
  containerStyle: PropTypes.object,
  data: PropTypes.array,
};

export default CMenuAccount;
