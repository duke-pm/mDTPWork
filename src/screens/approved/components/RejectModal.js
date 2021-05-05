/**
 ** Name: 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
/* COMMON */
import { colors, cStyles } from '~/utils/style';

const INPUT_NAME = {
  REASON_REJECT: 'reasonReject',
};

function RejectModal(props) {
  const {
    onCloseReject,
    onReject,
  } = props;

  const [reasonReject, setReasonReject] = useState('');
  const [error, setError] = useState({
    reasonReject: {
      status: false,
      helper: '',
    },
  });

  /** HANDLE FUNC */
  const handleChangeReasonReject = (value) => {
    setReasonReject(value);
    if (error.reasonReject.status)
      setError({
        reasonReject: {
          status: false,
          helper: '',
        },
      });
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
      onReject(reasonReject);
    }
  };

  /** RENDER */
  return (
    <Modal
      isVisible={props.showReject}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      onBackButtonPress={onCloseReject}
      onBackdropPress={onCloseReject}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={cStyles.flexCenter}>
          <View style={[cStyles.rounded1, styles.background]}>
            <View style={[
              cStyles.py10,
              cStyles.roundedTopLeft1,
              cStyles.roundedTopRight1,
              { backgroundColor: colors.PRIMARY }
            ]}>
              <CText styles={'colorWhite textCenter'} label={'common:app_name'} />
            </View>

            <View style={cStyles.p10}>
              <CText styles={'textCenter'} label={'add_approved:message_confirm_reject'} />

              <CInput
                name={INPUT_NAME.REASON_REJECT}
                style={styles.input}
                styleFocus={styles.input_focus}
                disabled={props.loading}
                holder={'add_approved:reason'}
                value={reasonReject}
                valueColor={colors.BLACK}
                keyboard={'default'}
                returnKey={'done'}
                multiline
                error={error.reasonReject.status}
                errorHelper={error.reasonReject.helper}
                textAlignVertical={'top'}
                onChangeInput={onReject}
                onChangeValue={handleChangeReasonReject}
              />
            </View>

            <View style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEvenly,
              cStyles.px16
            ]}>
              <CButton
                style={styles.button_base}
                block
                color={colors.GRAY_800}
                label={'common:cancel'}
                onPress={onCloseReject}
              />

              <CButton
                style={styles.button_base}
                block
                label={'common:ok'}
                loading={props.loading}
                onPress={handleReject}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
};

const styles = StyleSheet.create({
  background: { backgroundColor: colors.WHITE },
  input: { height: 150 },
  input_focus: {
    borderColor: colors.PRIMARY,
    borderWidth: 0.5,
  },
  button_base: { width: cStyles.deviceWidth / 3 },
});

export default RejectModal;
