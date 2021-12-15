/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom container
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout, useTheme} from '@ui-kitten/components';
import {StatusBar} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
import {DARK, LIGHT} from '~/configs/constants';

function CContainer(props) {
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {
    safeArea = [],
    backgroundColor = null,
    padder = false,
    headerComponent = null,
    children = null,
  } = props;

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      StatusBar.setBarStyle('dark-content', true);
      IS_ANDROID &&
        StatusBar.setBackgroundColor(theme['background-basic-color-1'], true);
    }
    if (themeContext.themeApp === DARK) {
      StatusBar.setBarStyle('light-content', true);
      IS_ANDROID &&
        StatusBar.setBackgroundColor(theme['background-basic-color-1'], true);
    }
  }, [themeContext.themeApp]);

  /************
   ** RENDER **
   ************/
  let safeAreaScreen = ['left', 'right'];
  safeAreaScreen = safeAreaScreen.concat(safeArea);
  return (
    <SafeAreaView
      style={[
        cStyles.flex1,
        {backgroundColor: backgroundColor || theme['background-basic-color-1']},
      ]}
      edges={safeAreaScreen}>
      {headerComponent}
      <Layout
        style={[cStyles.flex1, padder && cStyles.px16, padder && cStyles.py10]}
        level="3">
        {children}
      </Layout>
    </SafeAreaView>
  );
}

CContainer.propTypes = {
  safeArea: PropTypes.array,
  backgroundColor: PropTypes.string,
  padder: PropTypes.bool,
  headerComponent: PropTypes.element,
  children: PropTypes.element,
};

export default CContainer;
