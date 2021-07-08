/**
 ** Name: CActionSheet
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
/** COMPONENTS */
import CIconButton from './CIconButton';
/** COMMON */
import {cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

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

  const handleClose = () => {
    needUpdate = false;
    actionRef.current?.hide();
  };

  const handleConfirm = () => {
    needUpdate = true;
    actionRef.current?.hide();
    if (onConfirm) {
      onConfirm();
    }
  };

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

  return (
    <ActionSheet
      ref={actionRef}
      containerStyle={{backgroundColor: customColors.card}}
      elevation={5}
      headerAlwaysVisible={true}
      indicatorColor={customColors.cardDisable}
      gestureEnabled={true}
      defaultOverlayOpacity={isDark ? 0.8 : 0.4}
      openAnimationSpeed={20}
      closeAnimationDuration={200}
      onClose={onCloseAS}
      onOpen={onOpenAS}
      CustomHeaderComponent={
        headerChoose ? (
          <View
            style={[
              cStyles.pt16,
              cStyles.px16,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              {backgroundColor: customColors.card},
            ]}>
            <CIconButton
              iconName={'close'}
              iconColor={customColors.icon}
              onPress={handleClose}
            />
            <CIconButton
              iconName={'checkmark'}
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

export default CActionSheet;
