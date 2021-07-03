/**
 ** Name: CContainer
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContainer.js
 **/
import React from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import Modal from 'react-native-modal';
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
      style={[cStyles.flex1, {backgroundColor: customColors.background}]}
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
        renderToHardwareTextureAndroid={true}
      />
      <CLoading customColors={customColors} visible={props.loading} />
    </SafeAreaView>
  );
}

export default CContainer;
