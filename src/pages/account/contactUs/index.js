/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Contact Us page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactUs.js
 **/
import React from 'react';
import {Card, List} from '@ui-kitten/components';
import {Linking, View} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {DATA_CONTACT_US} from '~/configs/constants';

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
      safeArea={['top', 'bottom']}
      headerComponent={
        <CTopNavigation
          title="contact_us:title"
          back
          borderBottom
        />
      }>
      <List
        contentContainerStyle={[cStyles.px16, cStyles.py10]}
        data={DATA_CONTACT_US}
        renderItem={info => {
          return (
            <Card
              disabled
              header={
                <CText category="label">{info.item.label}</CText>
              }
            >
              <View>
                <CText> &#9906;   {`${info.item.address}`}</CText>
                <CText style={cStyles.mt5} onPress={() => handleURL(info.item.website)}>
                  &#9881;   {`${info.item.website}`}
                </CText>
                <CText style={cStyles.mt5} onPress={() => handleEmail(info.item.email)}>
                  &#9993;   {`${info.item.email}`}
                </CText>
                {info.item.phone.map((itemP, indexP) =>
                  <CText style={cStyles.mt5} onPress={() => handlePhone(itemP)}>
                    &#9742;   {`${itemP}`}
                  </CText>
                )}
              </View>
            </Card>
          )
        }}
        keyExtractor={(item, index) => item.id + '_' + index}
        ItemSeparatorComponent={() => <View style={cStyles.my5} />}
      />
    </CContainer>
  );
}

export default ContactUs;
