/**
 ** Name: CText
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CText.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {View, Text, TouchableOpacity} from 'react-native';
/** COMMON */
import {cStyles} from '~/utils/style';

function CText(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    styles = '',
    customStyles = {},
    label = '',
    customLabel = null,
    onPress = null,
  } = props;

  let tmpStyles = styles.split(' ');
  let i,
    allStyles = [];
  for (i of tmpStyles) {
    allStyles.push(cStyles[i]);
  }

  /**************
   ** RENDER **
   **************/
  let Component = onPress ? TouchableOpacity : View;
  return (
    <Component onPress={onPress}>
      <Text
        style={[
          cStyles.textBody,
          {color: colors.text},
          allStyles,
          onPress && cStyles.px3,
          customStyles,
        ]}
        allowFontScaling={false}
        {...props}>
        {customLabel || t(label)}
      </Text>
    </Component>
  );
}

export default CText;
