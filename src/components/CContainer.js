/**
 ** Name: CContainer
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
/** COMMON */
import CFooter from './CFooter';
import CLoading from './CLoading';
import {Shapes} from './CBackgroundSharp';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {useColorScheme} from 'react-native-appearance';
import {THEME_DARK} from '~/config/constants';

function CContainer(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    safeArea = {top: false, bottom: false},
    safeAreaStyle = {},
    style = {},
    hasShapes = false,
    content = null,
    footer = null,
  } = props;

  /************
   ** RENDER **
   ************/
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
        {backgroundColor: customColors.backgroundActivity},
        safeAreaStyle,
      ]}
      edges={tmpSafeArea}>
      {hasShapes && (
        <Shapes
          primaryColor={isDark ? colors.STATUS_ON_HOLD_OPACITY : colors.BLUE}
          secondaryColor={isDark ? colors.STATUS_NEW_OPACITY : colors.FACEBOOK}
          height={3}
          borderRadius={20}
          figures={[
            {name: 'circle', position: 'center', size: 60},
            {name: 'donut', position: 'flex-start', axis: 'top', size: 80},
            {name: 'circle', position: 'center', axis: 'right', size: 100},
          ]}
        />
      )}
      <View style={[cStyles.flex1, style]}>
        {!props.loading ? content : null}
      </View>
      {footer && <CFooter content={footer} />}
      <CLoading visible={props.loading} />
    </SafeAreaView>
  );
}

CContainer.propTypes = {
  loading: PropTypes.bool,
  safeArea: PropTypes.object,
  safeAreaStyle: PropTypes.object,
  style: PropTypes.object,
  hasShapes: PropTypes.bool,
  content: PropTypes.element,
  footer: PropTypes.element,
};

export default CContainer;
