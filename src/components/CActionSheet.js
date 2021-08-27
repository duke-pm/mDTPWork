/**
 ** Name: CActionSheet
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {BlurView} from '@react-native-community/blur';
/** COMPONENTS */
import CIconButton from './CIconButton';
/** COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {IS_IOS, moderateScale} from '~/utils/helper';

const propIcon = {size: moderateScale(21)};

function CActionSheet(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {customHeader, headerChoose = false, onConfirm, onClose} = props;
  let needUpdate = false;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleClose = () => {
    needUpdate = false;
    props.actionRef.current?.hide();
  };

  const handleConfirm = () => {
    needUpdate = true;
    props.actionRef.current?.hide();
    if (onConfirm) {
      onConfirm(needUpdate);
    }
  };

  /**********
   ** FUNC **
   **********/
  const onOpenAS = () => {
    needUpdate = false;
  };

  const onCloseAS = () => {
    if (onClose) {
      if (needUpdate) {
        onClose(true);
      } else {
        onClose(false);
      }
    }
  };

  /************
   ** RENDER **
   ************/
  return (
    <ActionSheet
      ref={props.actionRef}
      containerStyle={[
        cStyles.roundedTopLeft3,
        cStyles.roundedTopRight3,
        styles.container,
      ]}
      elevation={5}
      nestedScrollEnabled={true}
      headerAlwaysVisible={true}
      gestureEnabled={false}
      indicatorColor={customColors.cardDisable}
      defaultOverlayOpacity={isDark ? 0.8 : 0.2}
      onClose={onCloseAS}
      onOpen={onOpenAS}
      CustomHeaderComponent={undefined}
      {...props}>
      <BlurView
        style={[cStyles.abs, cStyles.inset0, cStyles.rounded3]}
        blurAmount={50}
        blurType={isDark ? 'dark' : IS_IOS ? 'materialLight' : 'light'}
        overlayColor={colors.TRANSPARENT}
        reducedTransparencyFallbackColor="white"
      />
      {headerChoose ? (
        <View
          style={[
            cStyles.px10,
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween,
            cStyles.roundedTopLeft3,
            cStyles.roundedTopRight3,
          ]}>
          <CIconButton
            style={styles.icon}
            iconProps={propIcon}
            iconName={Icons.close}
            iconColor={customColors.red}
            onPress={handleClose}
          />
          <View style={[cStyles.rounded3, styles.indicator]} />
          <CIconButton
            style={styles.icon}
            iconProps={propIcon}
            iconName={Icons.doubleCheck}
            iconColor={customColors.primary}
            onPress={handleConfirm}
          />
        </View>
      ) : customHeader ? (
        customHeader
      ) : undefined}
      {props.children}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.TRANSPARENT},
  indicator: {width: moderateScale(50), height: moderateScale(6)},
  icon: {height: moderateScale(45), width: moderateScale(45)},
});

CActionSheet.propTypes = {
  actionRef: PropTypes.any,
  customHeader: PropTypes.element,
  headerChoose: PropTypes.bool,
  children: PropTypes.element,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};

export default CActionSheet;
