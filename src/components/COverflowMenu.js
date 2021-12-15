/**
 ** Name: Custom OverflowMenu
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of COverflowMenu.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TopNavigationAction, Icon, MenuItem, OverflowMenu, useTheme,
} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors} from '~/utils/style';

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
    iconFill = theme['text-basic-color'],
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
  //
  //  If menus is empty => not render anything
  //
  if (menus.length === 0) return null;

  const RenderMenuAction = () => (
    <TopNavigationAction
      icon={propsI => RenderIcon(propsI, 'more-vertical-outline', iconFill)}
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
            key={itemM.id + '_' + indexM}
            title={propsT => <CText category='p1'>{itemM.customLabel || t(itemM.label)}</CText>}
            accessoryLeft={propsI => RenderIcon(propsI, itemM.icon, theme['text-basic-color'])}
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
