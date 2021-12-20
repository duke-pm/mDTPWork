/**
 ** Name: Reject modal approve
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RejectModal.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Input} from '@ui-kitten/components';
import {StyleSheet, Keyboard} from 'react-native';
/* COMPONENTS */
import CAlert from '~/components/CAlert';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';


function RejectModal(props) {
  const {t} = useTranslation();
  const {
    showReject = false,
    description = 'add_approved_assets:message_confirm_reject',
    onCloseReject = () => null,
    onReject = () => null,
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
      setError({reasonReject: {status: false, helper: ''}});
    }
    setReasonReject('');
    onCloseReject();
  };

  /************
   ** RENDER **
   ************/
  return (
    <CAlert
      show={showReject}
      loading={loading}
      cancel
      label={t('add_approved_lost_damaged:label_confirm')}
      customMessage={
        <Input
          style={[cStyles.my10, styles.input]}
          autoFocus
          multiline
          status={error.reasonReject.status ? 'danger' : 'basic'}
          label={t('add_approved_lost_damaged:reason_reject')}
          caption={t(error.reasonReject.helper)}
          placeholder={t(description)}
          value={reasonReject}
          onChangeText={handleChangeReasonReject}
        />
      }
      statusOk='danger'
      textCancel='common:close'
      onBackdrop={Keyboard.dismiss}
      onCancel={handleClose}
      onOk={handleReject}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    maxHeight: moderateScale(100),
  },
});

RejectModal.propTypes = {
  showReject: PropTypes.bool,
  description: PropTypes.string,
  onCloseReject: PropTypes.func,
  onReject: PropTypes.func,
};

export default RejectModal;
