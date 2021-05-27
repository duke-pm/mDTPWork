/**
 ** Name: CActionSheet
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import CIconButton from './CIconButton';
import {cStyles} from '~/utils/style';

function CActionSheet(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';
  const {actionRef, headerChoose = false, onConfirm} = props;

  return (
    <ActionSheet
      ref={actionRef}
      headerAlwaysVisible={true}
      elevation={2}
      indicatorColor={customColors.text}
      containerStyle={{backgroundColor: customColors.card}}
      gestureEnabled={true}
      defaultOverlayOpacity={isDark ? 0.8 : 0.5}
      CustomHeaderComponent={
        headerChoose ? (
          <View
            style={[
              cStyles.pt16,
              cStyles.px16,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.roundedTopLeft2,
              cStyles.roundedTopRight2,
              {backgroundColor: customColors.card},
            ]}>
            <CIconButton
              iconName={'x'}
              iconColor={customColors.icon}
              onPress={() => actionRef.current?.hide()}
            />
            <CIconButton
              iconName={'check'}
              iconColor={customColors.primary}
              onPress={onConfirm}
            />
          </View>
        ) : undefined
      }>
      {props.children}
    </ActionSheet>
  );
}

export default CActionSheet;
