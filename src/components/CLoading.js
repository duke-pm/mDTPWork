/**
 ** Name: CLoading
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import React from 'react';
import {View, StyleSheet, ActivityIndicator, Modal} from 'react-native';
/** COMMON */
import {colors, cStyles} from '~/utils/style';

function CLoading(props) {
  /** RENDER */
  return (
    <Modal visible={props.visible} animationType={'fade'} transparent>
      <View
        style={[
          cStyles.flex1,
          cStyles.itemsCenter,
          cStyles.justifyCenter,
          styles.con_modal,
        ]}>
        <ActivityIndicator size={'small'} color={colors.GRAY_500} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_modal: {backgroundColor: colors.BACKGROUND_MODAL},
});

export default CLoading;
