/**
 ** Name: Custom Status
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CStatus.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button, Text} from "@ui-kitten/components";
import {View} from "react-native";
/* COMMON */
import {Commons} from "~/utils/common";
import {cStyles} from "~/utils/style";

function CStatus(props) {
  const {t} = useTranslation();
  const {
    type = "approved",
    disabled = false,
    value = null,
    label = "",
    customLabel = null,
    onPress = undefined,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!value) return null;
  let status = null;
  if (type === "approved") {
    status = Commons.STATUS_APPROVED.find(f => f.value === value);
  }
  if (type === "project") {
    status = Commons.STATUS_PROJECT.find(f => f.value === value);
  }
  if (type === "booking") {
    status = Commons.STATUS_BOOKING.find(f => f.value === value);
  }
  if (!status) return null;
  return (
    <Button
      style={cStyles.rounded5}
      disabled={disabled}
      size="tiny"
      status={status.color}
      onPress={onPress}>
      {propsT =>
        customLabel
        ? customLabel(propsT)
        :
          <View style={cStyles.py0}>
            <Text style={propsT.style}>{t(label)}</Text>
          </View>
      }
    </Button>
  );
}

CStatus.propTypes = {
  type: PropTypes.oneOf([
    "approved",
    "project",
    "booking",
  ]),
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
  ]),
  label: PropTypes.string,
  customLabel: PropTypes.any,
  onPress: PropTypes.func,
}

export default React.memo(CStatus);
