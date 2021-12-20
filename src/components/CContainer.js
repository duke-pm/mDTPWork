/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom container
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout, Spinner, useTheme} from '@ui-kitten/components';
import {StatusBar, View} from 'react-native';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
import {DARK, LIGHT} from '~/configs/constants';

function CContainer(props) {
  const theme = useTheme();
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const {
    safeArea = [],
    backgroundColor = null,
    loading = false,
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
        {!loading && children}
        {loading && (
          <View style={cStyles.flexCenter}>
            <Spinner />
            <CText style={cStyles.mt10} category="c1" appearance="hint">{t('common:loading')}</CText>
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
  padder: PropTypes.bool,
  headerComponent: PropTypes.element,
  children: PropTypes.element,
};

export default CContainer;
