/**
 * React Native Kit
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
/** COMMON */
import CHeader from './CHeader';
import CFooter from './CFooter';
import CLoading from './CLoading';
/** COMMON */
import { cStyles, colors } from '~/utils/style';

function CContainer(props) {
  const {
    safeArea = {
      top: true,
      bottom: false,
    },
    style,

    header,
    content,
    footer,

    headerBackground,
    headerLeft,
    headerRight,
    hasBack,
    hasMenu,
    hasSearch,
    hasAddNew,

    title,
    subTitle,
    iconBack,

    onPressAddNew,
    onPressSearch,
  } = props;

  // Theme
  const backgroundStyle = {
    backgroundColor: headerBackground || colors.BACKGROUND_HEADER,
  };

  let tmpSafeArea = ['right', 'left'];
  if (safeArea.top) {
    tmpSafeArea.push('top');
  }
  if (safeArea.bottom) {
    tmpSafeArea.push('bottom');
  }

  return (
    <SafeAreaView style={[cStyles.flex1, backgroundStyle]} edges={tmpSafeArea}>
      <View style={[cStyles.flex1, styles.container, style]}>
        {header && (
          <CHeader
            background={headerBackground}
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
        {content}
        {footer &&
          <CFooter content={footer} />
        }
      </View>

      <CLoading visible={props.loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === cStyles.platform
      ? cStyles.deviceHeight
      : cStyles.deviceHeight - 20,
    backgroundColor: colors.WHITE
  }
})

export default CContainer;
