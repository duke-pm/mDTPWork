/* eslint-disable react-hooks/exhaustive-deps */
/**
 **/
/**
 ** Name: CContainer
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Platform, StatusBar, ScrollView, UIManager, LayoutAnimation} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
/** COMMON */
import CHeader from './CHeader';
import CFooter from './CFooter';
import CLoading from './CLoading';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function CContainer(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    safeArea = {
      top: false,
      bottom: false,
    },
    style = {},
    centerStyle = {},
    headerStyle = {},
    header = null,
    content = null,
    footer = null,
    headerLeft = null,
    headerRight = null,
    hasBack = false,
    hasSearch = false,
    hasAddNew = false,
    title,
    customTitle,
    subTitle,
    customSubTitle,
    iconBack,
    onPressAddNew = () => {},
    onPressSearch = () => {},
    onRefresh = () => {},
  } = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const isSearch = commonState.get('isSearch');

  /**************
   ** RENDER **
   **************/
  // Theme
  let tmpSafeArea = ['right', 'left'];
  if (safeArea.top) {
    tmpSafeArea.push('top');
  }
  if (safeArea.bottom) {
    tmpSafeArea.push('bottom');
  }
  return (
    <SafeAreaView
      style={[cStyles.flex1, {backgroundColor: customColors.header}]}
      edges={tmpSafeArea}>
      {content}
      {footer && <CFooter content={footer} />}
      <Modal
        style={cStyles.m0}
        isVisible={isSearch}
        coverScreen={false}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        hideModalContentWhileAnimating={true}
        backdropColor={'black'}
        backdropOpacity={0.4}
        deviceHeight={cStyles.deviceHeight}
        deviceWidth={cStyles.deviceWidth}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        renderToHardwareTextureAndroid
      />
      <CLoading customColors={customColors} visible={props.loading} />
    </SafeAreaView>
  );
}

export default CContainer;
