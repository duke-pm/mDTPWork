/**
 * React Native Kit
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, View, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {BlurView} from '@react-native-community/blur';
/** COMMON */
import CHeader from './CHeader';
import CFooter from './CFooter';
import CLoading from './CLoading';
/** COMMON */
import {cStyles, colors} from '~/utils/style';

function CContainer(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  const commonState = useSelector(({common}) => common);

  const {
    safeArea = {
      top: true,
      bottom: false,
    },
    style,

    header,
    content,
    footer,

    headerLeft,
    headerRight,
    hasBack,
    hasMenu,
    hasSearch,
    hasAddNew,
    hasPaddingFooter,

    title,
    subTitle,
    iconBack,

    onPressAddNew,
    onPressSearch,
  } = props;

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
      style={[
        cStyles.flex1,
        {
          backgroundColor: isDark ? customColors.header : customColors.primary,
        },
      ]}
      edges={tmpSafeArea}>
      {isDark && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={'black'}
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
            subTitle={subTitle}
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
                  {
                    backgroundColor: colors.BACKGROUND_MODAL,
                  },
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
                  {
                    backgroundColor: colors.BACKGROUND_MODAL,
                  },
                ]}
              />
            )}
          </View>
        )}
      </View>

      <CLoading visible={props.loading} />
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
