/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Preocess of request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestProcess.js
 **/
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Button, Spinner, useTheme, Text} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import IoniIcon from "react-native-vector-icons/Ionicons";
/* COMMON */
import {cStyles} from "~/utils/style";
import {moderateScale} from "~/utils/helper";

/** All init */
let isReject = false;
let isLastProcess = false;
const sGlobalIcon = moderateScale(20);

function RequestProcess(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {data = []} = props;

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [dataProcess, setDataProcess] = useState([]);

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let tmp2 = [],
      i = null;
    for (i of data) {
      if (i.personApproveID !== -1) tmp2.push(i);
    }
    setDataProcess(tmp2);
    setLoading(false);
  }, []);

  /************
   ** RENDER **
   ************/
  isReject = false;
  return (
    <View style={[cStyles.px16, cStyles.pb32]}>
      <Text style={[cStyles.textCenter, cStyles.py16]} category="s1">
        {t("add_approved_assets:table_process")}
      </Text>
      {loading && (
        <View style={cStyles.flexCenter}>
          <Spinner />
        </View>
      )}
      {!loading &&
        dataProcess.map((item, index) => {
          isLastProcess = index === dataProcess.length - 1;
          if (!isReject && item.statusID === 0) {
            isReject = true;
          }
          return (
            <View
              key={item.personApproveName + "_" +index.toString()}
              style={[cStyles.fullWidth, cStyles.row, cStyles.itemsStart]}>
              {item.approveDate ? (
                <Button
                  style={[cStyles.mt10, styles.con_date]}
                  appearance="outline"
                  size="small"
                  status={
                    !item.approveDate
                      ? "warning"
                      : item.statusID === 0
                      ? "danger"
                      : "success"
                  }>
                  {propsB => (
                    <View style={cStyles.center}>
                      <Text category="c1">{item.approveDate}</Text>
                      <Text style={cStyles.mt5} category="c1">{item.approveTime}</Text>
                    </View>
                  )}
                </Button>
              ) : (
                <Button
                  style={[cStyles.mt10, styles.con_date]}
                  appearance="ghost"
                  size="small">
                </Button>
              )}

              <View
                style={[
                  cStyles.px6,
                  cStyles.pt10,
                  cStyles.itemsCenter,
                  styles.con_icon,
                ]}>
                <IoniIcon
                  name={
                    !item.approveDate
                      ? "remove-circle"
                      : item.statusID === 0
                      ? "close-circle"
                      : "checkmark-circle"
                  }
                  color={
                    !item.approveDate
                      ? theme["color-basic-500"]
                      : item.statusID === 0
                      ? theme["color-danger-500"]
                      : theme["color-success-500"]
                  }
                  size={sGlobalIcon}
                />

                {index !== dataProcess.length - 1 && (
                  <View
                    style={[
                      cStyles.mt6,
                      cStyles.borderLeft,
                      {borderColor: theme["text-hint-color"]},
                      styles.line,
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  cStyles.rounded1,
                  cStyles.pr10,
                  cStyles.pb10,
                  styles.con_info,
                ]}>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsEnd,
                    cStyles.pt10,
                    styles.con_user,
                  ]}>
                  <Text
                    style={[isReject && !item.approveDate && cStyles.textThrough]}
                    category="c1">
                    {`${t("add_approved_lost_damaged:" +
                      (index === 0 ? "user_request" : "person_approved"))}`}
                  </Text>
                  <Text
                    style={[
                      cStyles.fontBold,
                      isReject && !item.approveDate && cStyles.textThrough,
                    ]}
                    category="c1">
                    {item.personApproveName}
                  </Text>
                </View>

                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.mt5,
                  ]}>
                  <Text
                    style={[isReject && !item.approveDate && cStyles.textThrough]}
                    category="c1">
                    {t("add_approved_assets:status_approved")}
                  </Text>
                  {item.approveDate ? (
                    <Text
                      style={[isReject && !item.approveDate && cStyles.textThrough]}
                      category="c1">
                      {item.statusName}
                    </Text>
                  ) : (
                    <Text
                      style={[isReject && !item.approveDate && cStyles.textThrough]}
                      category="c1">
                      {t("add_approved_assets:wait")}
                    </Text>
                  )}
                </View>

                {item.approveDate && item.reason !== "" && (
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsStart,
                      cStyles.mt5,
                      styles.con_reason,
                    ]}>
                    <Text
                      style={[isReject && !item.approveDate && cStyles.textThrough]}
                      category="c1">
                      {t("add_approved_assets:reason_reject")}
                    </Text>
                    <Text
                      style={[isReject && !item.approveDate && cStyles.textThrough]}
                      category="c1">
                      {item.reason}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {height: moderateScale(30)},
  con_date: {flex: 0.2},
  con_icon: {flex: 0.1},
  con_info: {flex: 0.7},
  con_user: {width: "70%"},
  con_reason: {width: "80%"},
});

RequestProcess.propTypes = {
  data: PropTypes.array,
};

export default RequestProcess;
