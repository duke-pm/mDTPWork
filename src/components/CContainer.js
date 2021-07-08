/**
 ** Name: CContainer
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
/** COMMON */
import CFooter from './CFooter';
import CLoading from './CLoading';
/** COMMON */
import {cStyles} from '~/utils/style';

function CContainer(props) {
  const {customColors} = useTheme();
  const {
    safeArea = {
      top: false,
      bottom: false,
    },
    content = null,
    footer = null,
  } = props;

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
      style={[cStyles.flex1, {backgroundColor: customColors.background}]}
      edges={tmpSafeArea}>
      {content}
      {footer && <CFooter content={footer} />}
      <CLoading customColors={customColors} visible={props.loading} />
    </SafeAreaView>
  );
}

export default CContainer;
