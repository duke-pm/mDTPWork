/**
 ** Name: CText
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CText.js
 **/
import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {useTranslation} from 'react-i18next';
/** COMMON */
import {cStyles} from '~/utils/style';

function CText(props) {
  const {t} = useTranslation();

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

  let Component = onPress ? TouchableHighlight : View;

  return (
    <Component onPress={onPress}>
      <Text
        style={[cStyles.textDefault, allStyles, customStyles]}
        allowFontScaling={true}
        {...props}>
        {customLabel || t(label)}
      </Text>
    </Component>
  );
}

export default CText;
