/**
 ** Name: Custom Overflow Menu
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of COverflowMenu.js
 **/
import PropTypes from "prop-types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
  TopNavigationAction, Icon, MenuItem, OverflowMenu,
  useTheme, Text,
} from "@ui-kitten/components";
import {StyleSheet} from "react-native";
/* COMMON */
import {colors} from "~/utils/style";

const colorText = "text-basic-color";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderIcon = (props, name, fill) => (
  <Icon {...props} fill={fill} name={name} />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function COverflowMenu(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    iconFill = theme[colorText],
    menus = [],
  } = props;

  /** Use state */
  const [show, setShow] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleMenu = () => setShow(!show);

  const handleMenuItem = onPress => {
    if (onPress) onPress();
    toggleMenu();
  };

  /************
   ** RENDER **
   ************/
  if (menus.length === 0) return null;

  const RenderMenuAction = () => (
    <TopNavigationAction
      icon={propsI => RenderIcon(propsI, "more-vertical-outline", iconFill)}
      onPress={toggleMenu}
    />
  );

  return (
    <OverflowMenu
      backdropStyle={styles.backdrop}
      visible={show}
      anchor={RenderMenuAction}
      onBackdropPress={toggleMenu}>
      {menus.map((itemM, indexM) => {
        return (
          <MenuItem
            key={itemM.id + "_" + indexM}
            title={propsT =>
              <Text>{itemM.customLabel || t(itemM.label)}</Text>}
            accessoryLeft={propsI =>
              RenderIcon(propsI, itemM.icon, theme[colorText])}
            onPress={() => handleMenuItem(itemM.onPress)}
          />
        )
      })}
    </OverflowMenu>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.BG_BACKDROP,
  },
});

COverflowMenu.propTypes = {
  iconFill: PropTypes.string,
  menus: PropTypes.array,
};

export default COverflowMenu;
