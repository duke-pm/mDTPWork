/* eslint-disable react-hooks/exhaustive-deps */
/**
 **/
/**
 ** Name: CContainer
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Platform, StatusBar, Modal} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
/** COMMON */
import CHeader from './CHeader';
import CFooter from './CFooter';
import CLoading from './CLoading';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function CContainer(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';
  const {
    safeArea = {
      top: true,
      bottom: false,
    },
    style = {},
    header = null,
    content = null,
    footer = null,
    headerLeft = null,
    headerRight = null,
    hasBack = false,
    hasMenu = false,
    hasSearch = false,
    hasAddNew = false,
    hasPaddingFooter = false,
    title,
    customTitle,
    subTitle,
    customSubTitle,
    iconBack,
    onPressAddNew = () => {},
    onPressSearch = () => {},
  } = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [bgColor, setbgColor] = useState(customColors.primary);

  /** LIFE CYCLE */
  useEffect(() => {
    if (isDark) {
      setbgColor(customColors.header);
    } else {
      setbgColor(customColors.primary);
    }
  }, [isDark, setbgColor]);

  useEffect(() => {
    if (props.loading) {
      setLoading(true);
    }
    if (!props.loading) {
      setLoading(false);
    }
  }, [props.loading, setLoading]);

  /** RENDER */
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
            onPressAddNew={onPressAddNew}
            onPressSearch={onPressSearch}
          />
        )}
        {content && (
          <View
            style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
            {content}
            {commonState.get('isSearch') && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.inset0,
                  {backgroundColor: colors.BACKGROUND_MODAL},
                ]}
              />
            )}
          </View>
        )}
        {footer && (
          <View>
            <CFooter content={footer} hasPaddingFooter={hasPaddingFooter} />
            {commonState.get('isSearch') && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.inset0,
                  {backgroundColor: colors.BACKGROUND_MODAL},
                ]}
              />
            )}
          </View>
        )}
      </View>

      <CLoading visible={loading} />
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
