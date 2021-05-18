/**
 ** Name:
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
/* COMPONENTS */
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CButton from '~/components/CButton';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

const INPUT_NAME = {
  REASON_REJECT: 'reasonReject',
};

function RejectModal(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';
  const {
    description = 'add_approved_assets:message_confirm_reject',
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

  /** RENDER */
  return (
    <Modal
      isVisible={props.showReject}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      onBackButtonPress={onCloseReject}
      onBackdropPress={onCloseReject}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={cStyles.flexCenter}>
          <View
            style={[
              cStyles.rounded1,
              {backgroundColor: customColors.background},
            ]}>
            <View
              style={[
                cStyles.py10,
                cStyles.roundedTopLeft1,
                cStyles.roundedTopRight1,
                {backgroundColor: isDark ? customColors.card : colors.PRIMARY},
              ]}>
              <CText
                styles={'colorWhite textCenter fontMedium'}
                label={'common:app_name'}
              />
            </View>

            <View style={cStyles.p10}>
              <CText styles={'textCenter'} label={description} />

              <CInput
                name={INPUT_NAME.REASON_REJECT}
                styleFocus={styles.input_focus}
                disabled={props.loading}
                holder={'add_approved_assets:reason'}
                value={reasonReject}
                valueColor={colors.TEXT_BASE}
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

            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyEvenly,
                cStyles.px16,
                cStyles.py10,
              ]}>
              <CButton
                style={styles.button_base}
                block
                variant={'outlined'}
                label={'common:close'}
                onPress={handleClose}
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
  );
}

const styles = StyleSheet.create({
  input: {height: 150},
  input_focus: {
    borderColor: colors.SECONDARY,
  },
  button_base: {width: cStyles.deviceWidth / 3, marginHorizontal: 10},
});

export default RejectModal;
