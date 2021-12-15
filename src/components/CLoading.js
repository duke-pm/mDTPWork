/**
 ** Name: Custom loading
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Spinner, Modal} from '@ui-kitten/components';
import {View} from 'react-native';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

function CLoading(props) {
  const {
    show = false,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      style={cStyles.m0}
      visible={show}
      backdropStyle={{backgroundColor: colors.BACKGROUND_MODAL}}
      onBackdropPress={() => null}
    >
      <View style={cStyles.flexCenter}>
        <Spinner status={'basic'} />
      </View>
    </Modal>
  );
}

CLoading.propTypes = {
  show: PropTypes.bool,
};

export default CLoading;
