/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Contact Us page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactUs.js
 **/
import React from "react";
import {Card, List, Text} from "@ui-kitten/components";
import {Linking, View} from "react-native";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
/* COMMON */
import {cStyles} from "~/utils/style";
import {DATA_CONTACT_US} from "~/configs/constants";
import {IS_ANDROID} from "~/utils/helper";

function ContactUs(props) {

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handlePhone = data => Linking.openURL(`tel:${data}`);

  const handleEmail = data => Linking.openURL(`mailto:${data}`);

  const handleURL = data => Linking.openURL(data);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top", "bottom"]}
      headerComponent={
        <CTopNavigation
          title="contact_us:title"
          back
          borderBottom
        />
      }>
      <List
        contentContainerStyle={cStyles.p10}
        data={DATA_CONTACT_US}
        renderItem={info => {
          return (
            <Card disabled
              header={<Text category="s1">{info.item.label}</Text>}>
              <View>
                <Text> &#9906;   {`${info.item.address}`}</Text>
                <Text
                  style={cStyles.mt5}
                  status="primary"
                  onPress={() => handleURL(info.item.website)}>
                  &#9881;   {`${info.item.website}`}
                </Text>
                <Text
                  style={cStyles.mt5}
                  status="primary"
                  onPress={() => handleEmail(info.item.email)}>
                  &#9993;   {`${info.item.email}`}
                </Text>
                {info.item.phone.map((itemP, indexP) =>
                  <Text
                    key={itemP + "_" + indexP}
                    style={cStyles.mt5}
                    status="primary"
                    onPress={() => handlePhone(itemP)}>
                    &#9742;   {`${itemP}`}
                  </Text>
                )}
              </View>
            </Card>
          )
        }}
        keyExtractor={(item, index) => item.id + "_" + index}
        removeClippedSubviews={IS_ANDROID}
        ItemSeparatorComponent={() => <View style={cStyles.my5} />}
      />
    </CContainer>
  );
}

export default ContactUs;
