/**
 ** Name: CCard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CCard.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {IS_IOS} from '~/utils/helper';

function CCard(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    key = 'dtp-work',
    style = {},
    containerStyle = {},
    contentLabelStyle = {},
    label = null,
    customLabel = null,
    header = null,
    content = null,
    footer = null,
    onLayout = null,
    onPress = null,
    onLongPress = null,
  } = props;

  /**************
   ** RENDER **
   **************/
  const Component = onPress
    ? IS_IOS
      ? TouchableOpacity
      : TouchableNativeFeedback
    : View;
  return (
    <View key={key} style={[cStyles.rounded2, styles.con, style]}>
      <Component
        style={[cStyles.flex1, cStyles.rounded2]}
        activeOpacity={0.5}
        delayLongPress={500}
        onLayout={onLayout}
        onPress={onPress}
        onLongPress={onLongPress}>
        <View
          style={[
            cStyles.mt24,
            {backgroundColor: customColors.card},
            containerStyle,
          ]}>
          <View
            style={[
              cStyles.rounded1,
              cStyles.px10,
              cStyles.py3,
              cStyles.mx16,
              styles.con_label,
              contentLabelStyle,
              {backgroundColor: isDark ? colors.GRAY_830 : colors.GRAY_200},
            ]}>
            <CText
              customStyles={cStyles.fontMedium}
              label={label}
              customLabel={customLabel}
            />
          </View>

          {header && <View style={cStyles.px16}>{header}</View>}

          {content && (
            <View style={[cStyles.px16, cStyles.pb10, header && cStyles.pt10]}>
              {content}
            </View>
          )}

          {footer && <View style={[cStyles.pb10, cStyles.px16]}>{footer}</View>}
        </View>
      </Component>
    </View>
  );
}

const styles = StyleSheet.create({
  con: {overflow: 'hidden', zIndex: 2},
  container: {backgroundColor: colors.BACKGROUND_CARD},
  con_label: {top: -15},
});

export default CCard;
