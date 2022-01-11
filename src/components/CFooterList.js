/**
 ** Name: Custom Footer List
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from "react";
import {useTranslation} from "react-i18next";
import {Spinner, Text} from "@ui-kitten/components";
import {View} from "react-native";
/* COMMON */
import {cStyles} from "~/utils/style";

function CFooterList(props) {
  const {t} = useTranslation();
  
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <Spinner />
      <Text style={cStyles.mt10} category="c1" appearance="hint">
        {t("common:loading")}
      </Text>
    </View>
  );
}

export default React.memo(CFooterList);
