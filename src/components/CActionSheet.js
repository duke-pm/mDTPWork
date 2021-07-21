/**
 ** Name: CActionSheet
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
/** COMPONENTS */
import CIconButton from './CIconButton';
/** COMMON */
import Icons from '~/config/Icons';
import {cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {moderateScale} from '~/utils/helper';

function CActionSheet(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    actionRef,
    customHeader,
    headerChoose = false,
    onConfirm,
    onClose,
  } = props;
  let needUpdate = false;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleClose = () => {
    needUpdate = false;
    actionRef.current?.hide();
  };

  const handleConfirm = () => {
    needUpdate = true;
    actionRef.current?.hide();
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
      ref={actionRef}
      containerStyle={[{backgroundColor: customColors.card}, styles.container]}
      elevation={5}
      headerAlwaysVisible={true}
      gestureEnabled={true}
      indicatorColor={customColors.cardDisable}
      defaultOverlayOpacity={isDark ? 0.8 : 0.2}
      onClose={onCloseAS}
      onOpen={onOpenAS}
      CustomHeaderComponent={
        headerChoose ? (
          <View
            style={[
              cStyles.pt16,
              cStyles.px10,
              cStyles.row,
              cStyles.itemsStart,
              cStyles.justifyBetween,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              {backgroundColor: customColors.card},
            ]}>
            <CIconButton
              style={styles}
              iconProps={{size: moderateScale(21)}}
              iconName={Icons.close}
              iconColor={customColors.red}
              onPress={handleClose}
            />
            <View
              style={[
                cStyles.rounded5,
                {backgroundColor: customColors.cardDisable},
                styles.indicator,
              ]}
            />
            <CIconButton
              style={styles}
              iconProps={{size: moderateScale(21)}}
              iconName={Icons.check}
              iconColor={customColors.primary}
              onPress={handleConfirm}
            />
          </View>
        ) : customHeader ? (
          customHeader
        ) : undefined
      }
      {...props}>
      {props.children}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
  },
  indicator: {width: moderateScale(50), height: moderateScale(6)},
  icon: {height: moderateScale(45), width: moderateScale(45)},
});

export default CActionSheet;
