/**
 ** Name: Custom Loading
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Spinner, Modal, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

function CLoading(props) {
  const {t} = useTranslation();
  const {show = false} = props;

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      visible={show}
      backdropStyle={styles.con_backdrop}
      onBackdropPress={() => null}>
      <View style={cStyles.flexCenter}>
        <Spinner />
        <Text
          style={cStyles.mt10}
          category="c1"
          appearance="hint"
          status="control">
          {t('common:loading')}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

CLoading.propTypes = {
  show: PropTypes.bool,
};

export default CLoading;
