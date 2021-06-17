/**
 ** Name: Reject modal approve
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RejectModal.js
 **/
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
/* COMPONENTS */
import CInput from '~/components/CInput';
import CAlert from '~/components/CAlert';
/* COMMON */
import {colors} from '~/utils/style';

const INPUT_NAME = {
  REASON_REJECT: 'reasonReject',
};

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
      setError({
        reasonReject: {
          status: false,
          helper: '',
        },
      });
    }
  };

  const handleReject = () => {
    if (reasonReject.trim() === '') {
      setError({
        reasonReject: {
          status: true,
          helper: 'error:reason_reject_empty',
        },
      });
    } else {
      setLoading(true);
      onReject(reasonReject);
    }
  };

  const handleClose = () => {
    if (error.reasonReject.status) {
      setError({
        reasonReject: {
          status: false,
          helper: '',
        },
      });
    }
    onCloseReject();
  };

  /**************
   ** RENDER **
   **************/
  return (
    <CAlert
      loading={loading}
      show={props.showReject}
      content={description}
      customContent={
        <CInput
          name={INPUT_NAME.REASON_REJECT}
          styleFocus={styles.input_focus}
          disabled={loading}
          holder={'add_approved_assets:reason'}
          value={reasonReject}
          valueColor={colors.TEXT_BASE}
          keyboard={'default'}
          returnKey={'done'}
          error={error.reasonReject.status}
          errorHelper={error.reasonReject.helper}
          textAlignVertical={'top'}
          onChangeInput={onReject}
          onChangeValue={handleChangeReasonReject}
        />
      }
      onClose={handleClose}
      onOK={handleReject}
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {
    borderColor: colors.SECONDARY,
  },
});

export default RejectModal;
