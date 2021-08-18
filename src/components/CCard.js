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
import CIconButton from './CIconButton';
/* COMMON */
import Icons from '~/config/Icons';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';

const Touchable = IS_IOS ? TouchableHighlight : TouchableNativeFeedback;

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
  const Component = onPress ? Touchable : View;
  const Gradient = gradientColor ? LinearGradient : View;
  return (
    <View
      key={key}
      style={[
        cStyles.shadowListItem,
        cStyles.rounded2,
        IS_ANDROID && cStyles.ofHidden,
        styles.container,
        style,
      ]}>
      <Component
        style={[cStyles.rounded2, {backgroundColor: customColors.card}]}
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
          locations={[0, 0.6, 1]}
          colors={gradientColor}>
          <View
            style={[
              cStyles.roundedTopLeft2,
              cStyles.roundedTopRight2,
              cStyles.flex1,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.px10,
              cStyles.py8,
              cStyles.borderBottom,
              isDark && cStyles.borderBottomDark,
              contentLabelStyle,
            ]}>
            <View style={detail ? styles.con_header_left : cStyles.flex1}>
              <CText
                customStyles={[cStyles.textBody, cStyles.fontBold]}
                label={label}
                customLabel={customLabel}
              />
            </View>
            {detail && (
              <View style={styles.con_header_right}>
                <CIconButton
                  iconName={Icons.detail}
                  iconColor={customColors.icon}
                  onPress={onDetailPress}
                />
              </View>
            )}
          </View>

          {content && <View style={cStyles.p10}>{content}</View>}

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
  container: {zIndex: 2},
  con_header_left: {flex: 0.9},
  con_header_right: {flex: 0.1},
});

export default CCard;
