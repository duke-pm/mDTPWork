/**
 ** Name: Reject modal approve
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RejectModal.js
 **/
import PropTypes from "prop-types";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {Icon, Input, Text} from "@ui-kitten/components";
import {Keyboard, View} from "react-native";
/* COMPONENTS */
import CAlert from "~/components/CAlert";
/* COMMON */
import {cStyles} from "~/utils/style";
import {ThemeContext} from "~/configs/theme-context";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderCloseIcon = props => (
  <Icon {...props} name="close-outline" />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function RejectModal(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const {
    showReject = false,
    description = "add_approved_assets:message_confirm_reject",
    onCloseReject = () => null,
    onReject = () => null,
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [reasonReject, setReasonReject] = useState("");
  const [error, setError] = useState({
    status: false,
    helper: "",
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeReasonReject = value => {
    setReasonReject(value);
    if (error.status) {
      return setError({status: false, helper: ""});
    }
  };

  const handleReject = () => {
    if (reasonReject.trim() === "") {
      if (!error.status) {
        return setError({status: true, helper: "error:reason_reject_empty"});
      } else return;
    }
    setLoading(true);
    return onReject(reasonReject);
  };

  const handleClose = () => {
    if (error.status) {
      setError({status: false, helper: ""});
    }
    setReasonReject("");
    return onCloseReject();
  };

  /************
   ** RENDER **
   ************/
  return (
    <CAlert
      show={showReject}
      loading={loading}
      cancel
      label={t("add_approved_lost_damaged:label_confirm")}
      customMessage={
        <Input
          style={cStyles.my10}
          autoFocus
          multiline
          disabled={loading}
          keyboardAppearance={themeContext.themeApp}
          status={error.status ? "danger" : "basic"}
          label={propsL =>
            <View style={[cStyles.row, propsL.style]}>
              <Text category="label" appearance="hint">
                {t("add_approved_lost_damaged:reason_reject")}
              </Text>
              <Text category="label" status="danger">{" *"}</Text>
            </View>
          }
          caption={t(error.helper)}
          placeholder={t(description)}
          value={reasonReject}
          onChangeText={handleChangeReasonReject}
        />
      }
      iconOk={RenderCloseIcon}
      statusOk="danger"
      textOk="add_approved_lost_damaged:reject_now"
      textCancel="common:close"
      onBackdrop={Keyboard.dismiss}
      onCancel={handleClose}
      onOk={handleReject}
    />
  );
}

RejectModal.propTypes = {
  showReject: PropTypes.bool,
  description: PropTypes.string,
  onCloseReject: PropTypes.func,
  onReject: PropTypes.func,
};

export default RejectModal;
