/**
 ** Name: Footer Form Request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FooterFormRequest.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CButton from '~/components/CButton';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {moderateScale} from '~/utils/helper';
import {cStyles} from '~/utils/style';

function FooterFormRequest(props) {
  const {
    loading = false,
    customColors = {},
    isDetail = false,
    isApprovedReject = false,
    onAdd = () => null,
    onReject = () => null,
    onApproved = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!isDetail) {
    return (
      <View style={[cStyles.px16, cStyles.pb5]}>
        <CButton
          block
          disabled={loading}
          icon={Icons.send}
          label={'common:send'}
          onPress={onAdd}
        />
      </View>
    );
  }

  if (isApprovedReject) {
    return (
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyEvenly,
          cStyles.px16,
        ]}>
        <CButton
          style={styles.button_reject}
          block
          color={customColors.red}
          disabled={loading.main}
          icon={Icons.close}
          label={'common:reject'}
          onPress={onReject}
        />
        <CButton
          style={styles.button_approved}
          block
          color={customColors.green}
          disabled={loading.main}
          icon={Icons.check}
          label={'common:approved'}
          onPress={onApproved}
        />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  button_approved: {width: moderateScale(150)},
  button_reject: {width: moderateScale(150)},
});

FooterFormRequest.propTypes = {
  loading: PropTypes.bool,
  customColors: PropTypes.object.isRequired,
  isDetail: PropTypes.bool,
  isApprovedReject: PropTypes.bool,
  onAdd: PropTypes.func,
  onReject: PropTypes.func,
  onApproved: PropTypes.func,
};

export default React.memo(FooterFormRequest);
