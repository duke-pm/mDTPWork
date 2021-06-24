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
import {StyleSheet, View, Platform, StatusBar} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
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
      top: true,
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
    hasMenu = false,
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

  /** Use state */
  const [bgColor, setbgColor] = useState(customColors.primary);

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    if (isDark) {
      setbgColor(customColors.header);
    } else {
      setbgColor(customColors.primary);
    }
  }, [isDark, setbgColor]);

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
      style={[cStyles.flex1, {backgroundColor: bgColor}]}
      edges={tmpSafeArea}>
      <StatusBar backgroundColor={bgColor} />
      {isDark && IS_IOS && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={colors.BLACK}
        />
      )}
      <View style={[cStyles.flex1, styles.container, style]}>
        {header && (
          <CHeader
            style={headerStyle}
            centerStyle={centerStyle}
            hasBack={hasBack}
            hasMenu={hasMenu}
            hasSearch={hasSearch}
            hasAddNew={hasAddNew}
            iconBack={iconBack}
            title={title}
            customTitle={customTitle}
            subTitle={subTitle}
            customSubTitle={customSubTitle}
            left={headerLeft}
            right={headerRight}
            onRefresh={onRefresh}
            onPressAddNew={onPressAddNew}
            onPressSearch={onPressSearch}
          />
        )}
        {content && (
          <View
            style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
            {content}
            <Modal
              style={cStyles.m0}
              isVisible={isSearch}
              coverScreen={false}
              useNativeDriver={true}
              useNativeDriverForBackdrop={true}
              hideModalContentWhileAnimating={true}
              deviceHeight={cStyles.deviceHeight}
              deviceWidth={cStyles.deviceWidth}
              animationIn={'fadeIn'}
              animationOut={'fadeOut'}
            />
          </View>
        )}
        {footer && <CFooter content={footer} />}
      </View>

      <CLoading customColors={customColors} visible={props.loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height:
      Platform.OS === cStyles.platform
        ? cStyles.deviceHeight
        : cStyles.deviceHeight - 20,
    backgroundColor: colors.WHITE,
  },
});

export default CContainer;
