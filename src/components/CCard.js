/**
 ** Name: CCard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CCard.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

function CCard(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    key,
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
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      key={key}
      style={[
        cStyles.rounded2,
        cStyles.mt32,
        cStyles.borderAll,
        isDark && cStyles.borderAllDark,
        styles.container,
        {backgroundColor: customColors.card},
        containerStyle,
      ]}
      delayLongPress={500}
      onLayout={onLayout}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View
        style={[
          cStyles.rounded1,
          cStyles.px10,
          cStyles.py3,
          cStyles.borderAll,
          isDark && cStyles.borderAllDark,
          cStyles.mx16,
          styles.con_label,
          contentLabelStyle,
          {backgroundColor: isDark ? colors.GRAY_830 : colors.GRAY_300},
        ]}>
        <CText
          customStyles={[cStyles.fontMedium, {color: customColors.text}]}
          label={label}
          customLabel={customLabel}
        />
      </View>

      {header && <View style={cStyles.px16}>{header}</View>}

      {content && (
        <View style={[cStyles.pb10, cStyles.px16, header && cStyles.pt10]}>
          {content}
        </View>
      )}

      {footer && <View style={[cStyles.pb10, cStyles.px16]}>{footer}</View>}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.BACKGROUND_CARD},
  con_label: {
    backgroundColor: colors.WHITE,
    borderWidth: 0.3,
    top: -15,
  },
});

export default CCard;
