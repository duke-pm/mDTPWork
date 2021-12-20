/**
 ** Name: Custom Button Add
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CButtonAdd.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Icon} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderAddIcon = props => (
  <Icon {...props} name="plus-outline" />
)

/********************
 ** MAIN COMPONENT **
 ********************/
function CButtonAdd(props) {
  const {t} = useTranslation();
  const {
    show = false,
    label = null,
    onPress = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!show) return null;
  if (label) {
    return (
      <Button
        style={[cStyles.abs, styles.con_button]}
        accessoryLeft={RenderAddIcon}
        onPress={onPress}
        {...props}>
        {t(label)}
      </Button>
    );
  }
  return (
    <Button
      style={[cStyles.abs, cStyles.shadow3, styles.con_button]}
      accessoryLeft={RenderAddIcon}
      onPress={onPress}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  con_button: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(50),
    bottom: moderateScale(30),
    right: moderateScale(20),
  },
});

CButtonAdd.propTypes = {
  show: PropTypes.bool,
  label: PropTypes.any,
  onPress: PropTypes.func,
};

export default CButtonAdd;
