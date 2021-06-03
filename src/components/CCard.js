/**
 ** Name: CCard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CCard.js
 **/
import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';

const CCard = React.memo(function CCard(props) {
  const {
    key,
    containerStyle = {},
    contentLabelStyle = {},
    label = null,
    customLabel = null,
    cardHeader = null,
    cardContent = null,
    cardFooter = null,
    customColors = {},
    isDark = false,
    onPress = null,
  } = props;

  /** RENDER */
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      key={key}
      style={[
        cStyles.rounded2,
        cStyles.mt32,
        !isDark && IS_IOS && cStyles.shadowListItem,
        !isDark && IS_ANDROID && cStyles.borderAll,
        isDark && cStyles.borderAllDark,
        styles.container,
        containerStyle,
        {backgroundColor: customColors.card},
      ]}
      activeOpacity={0.8}
      onPress={onPress}>
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
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}>
        <CText
          customStyles={[
            cStyles.fontRegular,
            {color: isDark ? customColors.text : colors.WHITE},
          ]}
          label={label}
          customLabel={customLabel}
        />
      </View>

      {cardHeader && <View style={cStyles.px16}>{cardHeader}</View>}

      {cardContent && (
        <View style={[cStyles.pb10, cStyles.px16, cardHeader && cStyles.pt10]}>
          {cardContent}
        </View>
      )}

      {cardFooter && (
        <View style={[cStyles.pb10, cStyles.px16]}>{cardFooter}</View>
      )}
    </Component>
  );
});

const styles = StyleSheet.create({
  container: {backgroundColor: colors.BACKGROUND_CARD},
  con_label: {
    backgroundColor: colors.WHITE,
    borderWidth: 0.3,
    top: -15,
  },
});

export default CCard;
