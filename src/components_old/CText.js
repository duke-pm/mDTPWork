/**
 ** Name: CText
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CText.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {View, Text, TouchableOpacity} from 'react-native';
/** COMMON */
import {cStyles} from '~/utils/style';

function CText(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {
    styles = '',
    customStyles = {},
    label = '',
    disabled = true,
    customLabel = null,
    onPress = null,
  } = props;

  /**************
   ** RENDER **
   **************/
  let tmpStyles = styles.split(' ');
  let i,
    allStyles = [];
  for (i of tmpStyles) {
    allStyles.push(cStyles[i]);
  }
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component onPress={onPress} disabled={disabled}>
      <Text
        style={[
          cStyles.textBody,
          {color: customColors.text},
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

CText.propTypes = {
  styles: PropTypes.string,
  customStyles: PropTypes.object,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  customLabel: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(CText);
