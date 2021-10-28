/**
 ** Name: CCard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CCard.js
 **/
import PropTypes from 'prop-types';
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
import Icons from '~/utils/common/Icons';
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
    gradientColor = undefined,
    detail = false,
    customIconHeader = [],
    idx = undefined,
    color = undefined,
    label = undefined,
    customLabel = undefined,
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
        cStyles.rounded1,
        IS_ANDROID && cStyles.ofHidden,
        styles.container,
        style,
      ]}>
      <Component
        style={[cStyles.rounded1, {backgroundColor: customColors.card}]}
        activeOpacity={0.8}
        underlayColor={colors.TRANSPARENT}
        onLayout={onLayout}
        onPress={onPress}>
        <Gradient
          style={[
            cStyles.rounded1,
            {backgroundColor: customColors.card},
            containerStyle,
          ]}
          locations={[0, 0.6, 1]}
          colors={gradientColor}>
          <View
            style={[
              cStyles.roundedTopLeft1,
              cStyles.roundedTopRight1,
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
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                detail ? styles.con_header_left : cStyles.flex1,
              ]}>
              {idx && color && (
                <View
                  style={[
                    cStyles.p4,
                    cStyles.center,
                    cStyles.rounded1,
                    {backgroundColor: color},
                  ]}>
                  <CText styles={'textBody fontBold'} customLabel={idx} />
                </View>
              )}
              <View style={cStyles.flex1}>
                <CText
                  customStyles={[
                    cStyles.textBody,
                    cStyles.fontBold,
                    cStyles.pl6,
                  ]}
                  numberOfLines={2}
                  label={label}
                  customLabel={customLabel}
                />
              </View>
            </View>
            {customIconHeader.length > 0 &&
              customIconHeader.map((item, index) => (
                <View key={index + '_icon_header'}>
                  <CIconButton
                    iconName={item.icon}
                    iconColor={customColors.orange}
                    onPress={item.onPress}
                  />
                </View>
              ))}
            {detail && (
              <View style={styles.con_header_right}>
                <CIconButton
                  iconName={Icons.detail}
                  iconColor={customColors.orange}
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

CCard.propTypes = {
  key: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  contentLabelStyle: PropTypes.object,
  gradientColor: PropTypes.array,
  detail: PropTypes.bool,
  customIconHeader: PropTypes.array,
  label: PropTypes.string,
  customLabel: PropTypes.string,
  content: PropTypes.element,
  footer: PropTypes.element,
  onLayout: PropTypes.func,
  onPress: PropTypes.func,
  onDetailPress: PropTypes.func,
};

export default React.memo(CCard);
