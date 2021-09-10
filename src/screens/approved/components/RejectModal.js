/**
 ** Name: Reject modal approve
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RejectModal.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, LayoutAnimation, UIManager} from 'react-native';
/* COMPONENTS */
import CInput from '~/components/CInput';
import CAlert from '~/components/CAlert';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, verticalScale} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const INPUT_NAME = {REASON_REJECT: 'reasonReject'};

function RejectModal(props) {
  const {
    description = 'add_approved_assets:message_confirm_reject',
    onCloseReject,
    onReject,
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [reasonReject, setReasonReject] = useState('');
  const [error, setError] = useState({
    reasonReject: {
      status: false,
      helper: '',
    },
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeReasonReject = value => {
    setReasonReject(value);
    if (error.reasonReject.status) {
      setError({reasonReject: {status: false, helper: ''}});
    }
  };

  const handleReject = () => {
    if (reasonReject.trim() === '') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({
        reasonReject: {status: true, helper: 'error:reason_reject_empty'},
      });
    } else {
      setLoading(true);
      onReject(reasonReject);
    }
  };

  const handleClose = () => {
    if (error.reasonReject.status) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError({reasonReject: {status: false, helper: ''}});
    }
    onCloseReject();
  };

  /************
   ** RENDER **
   ************/
  return (
    <CAlert
      loading={loading}
      show={props.showReject}
      content={description}
      customContent={
        <CInput
          name={INPUT_NAME.REASON_REJECT}
          style={[cStyles.itemsStart, styles.input_multiline]}
          styleFocus={styles.input_focus}
          disabled={loading}
          holder={'add_approved_assets:reason'}
          value={reasonReject}
          keyboard={'default'}
          returnKey={'done'}
          autoFocus={true}
          multiline={true}
          error={error.reasonReject.status}
          errorHelper={error.reasonReject.helper}
          textAlignVertical={'top'}
          onChangeInput={onReject}
          onChangeValue={handleChangeReasonReject}
        />
      }
      onClose={handleClose}
      onOK={handleReject}
      onBackButtonPress={() => null}
      onBackdropPress={() => null}
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  input_multiline: {height: verticalScale(100)},
});

RejectModal.propTypes = {
  showReject: PropTypes.bool,
  description: PropTypes.string,
  onCloseReject: PropTypes.func,
  onReject: PropTypes.func,
};

export default RejectModal;
