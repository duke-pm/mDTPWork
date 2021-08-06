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
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';
import {IS_ANDROID, IS_IOS, moderateScale} from '~/utils/helper';
import Icons from '~/config/Icons';
import CIconButton from './CIconButton';

function CCard(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    key = 'dtp-work',
    style = {},
    containerStyle = {},
    contentLabelStyle = {},
    gradientColor = null,
    detail = false,
    label = null,
    customLabel = null,
    content = null,
    footer = null,
    onLayout = null,
    onPress = null,
    onDetailPress = null,
  } = props;

  /************
   ** RENDER **
   ************/
  const Component = onPress
    ? IS_IOS
      ? TouchableHighlight
      : TouchableNativeFeedback
    : View;
  const Gradient = gradientColor ? LinearGradient : View;
  return (
    <View
      key={key}
      style={[
        cStyles.shadowListItem,
        cStyles.rounded2,
        IS_ANDROID && cStyles.ofHidden,
        styles.con,
        style,
      ]}>
      <Component
        activeOpacity={0.8}
        underlayColor={colors.TRANSPARENT}
        onLayout={onLayout}
        onPress={onPress}>
        <Gradient
          style={[
            cStyles.rounded2,
            {backgroundColor: customColors.card},
            containerStyle,
          ]}
          colors={gradientColor}>
          <View
            style={[
              cStyles.roundedTopLeft2,
              cStyles.roundedTopRight2,
              cStyles.flex1,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.pl16,
              cStyles.py8,
              cStyles.borderBottom,
              isDark && cStyles.borderBottomDark,
              contentLabelStyle,
            ]}>
            <View style={styles.con_header_left}>
              <CText
                customStyles={[cStyles.textBody, cStyles.fontBold]}
                label={label}
                customLabel={customLabel}
              />
            </View>
            {detail && (
              <CIconButton
                iconName={Icons.detail}
                iconColor={customColors.icon}
                onPress={onDetailPress}
              />
            )}
          </View>

          {content && (
            <View style={[cStyles.py10, cStyles.px16]}>{content}</View>
          )}

          {footer && (
            <View
              style={[
                cStyles.p10,
                cStyles.borderTop,
                isDark && cStyles.borderTopDark,
              ]}>
              {footer}
            </View>
          )}
        </Gradient>
      </Component>
    </View>
  );
}

const styles = StyleSheet.create({
  con: {zIndex: 2},
  container: {backgroundColor: colors.BACKGROUND_CARD},
  con_label: {top: -moderateScale(15)},
  con_header_left: {flex: 0.9},
  con_header_right: {flex: 0.1},
});

export default CCard;
