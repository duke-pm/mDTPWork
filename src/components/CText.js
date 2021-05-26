/**
 ** Name: CText
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CText.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {View, Text, TouchableHighlight} from 'react-native';
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

  /** RENDER */
  let Component = onPress ? TouchableHighlight : View;
  return (
    <Component onPress={onPress}>
      <Text
        style={[
          cStyles.textDefault,
          {color: colors.text},
          allStyles,
          customStyles,
        ]}
        allowFontScaling={true}
        {...props}>
        {customLabel || t(label)}
      </Text>
    </Component>
  );
}

export default CText;
