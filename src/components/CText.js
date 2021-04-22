/**
 * React Native Kit
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
/** COMMON */
import { cStyles } from '~/utils/style';

function CText(props) {
  const { t } = useTranslation();

  const {
    styles = '',
    customStyles = {},
    label = '',
    customLabel = null,
  } = props;

  let tmpStyles = styles.split(' ');
  let i, allStyles = [];
  for (i of tmpStyles) allStyles.push(cStyles[i]);

  return (
    <Text
      style={[
        cStyles.textDefault,
        allStyles,
        customStyles,
      ]}
      allowFontScaling={true}
      {...props}>
      {customLabel || t(label)}
    </Text>
  )
};

export default CText;