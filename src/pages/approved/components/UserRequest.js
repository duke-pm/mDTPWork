/**
 ** Name: User Request 
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of UserRequest.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";
import {Card, Avatar, Text} from "@ui-kitten/components";
import {View} from "react-native";
/* COMMON */
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";

function UserRequest(props) {
  const {t} = useTranslation();
  const {
    avatar = null,
    fullName = "",
    job = "No Job",
    region = "",
    department = "",
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <Card disabled
      status="info"
      header={propsH =>
        <View
          style={[
            propsH.style,
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween,
          ]}>
          <Text category="s1">{t("add_approved_assets:request_user")}</Text>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Avatar size="small" source={avatar || Assets.iconUser} />
            <View style={cStyles.ml10}>
              <Text>{fullName}</Text>
              <Text
                style={cStyles.mt5}
                category="c1"
                appearance="hint">
                {job || "No Job"}
              </Text>
            </View>
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View>
          <Text>{department}</Text>
          <Text style={cStyles.mt5} category="c1" appearance="hint">
            {t("add_approved_assets:department")}
          </Text>
        </View>

        <View>
          <Text>{region}</Text>
          <Text style={cStyles.mt5} category="c1" appearance="hint">
            {t("add_approved_assets:region")}
          </Text>
        </View>
      </View>
    </Card>
  );
}

UserRequest.propTypes = {
  avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fullName: PropTypes.string,
  region: PropTypes.string,
  department: PropTypes.string,
}

export default React.memo(UserRequest);
