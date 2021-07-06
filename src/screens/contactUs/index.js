/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Contact Us
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactUs.js
 **/
import React from 'react';
import {Linking, View} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {DATA_CONTACT_US} from '~/config/constants';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';

const ContactUs = React.memo(function ContactUs(props) {
  /*****************
   ** HANDLE FUNC **
   *****************/
  const handlePhone = data => {
    Linking.openURL(`tel:${data}`);
  };

  const handleEmail = data => {
    Linking.openURL(`mailto:${data}`);
  };

  const handleURL = data => {
    Linking.openURL(data);
  };

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
        <CContent contentStyle={[cStyles.p16, IS_IOS && cStyles.pb60]}>
          {DATA_CONTACT_US.map((item, index) => {
            return (
              <CCard
                key={item.id}
                containerStyle={index === 0 ? cStyles.mt16 : cStyles.mt40}
                customLabel={item.label}
                content={
                  <View>
                    <View
                      style={[cStyles.row, cStyles.itemsStart, {width: '88%'}]}>
                      <CText styles={'textMeta'} label={'contact_us:address'} />
                      <CText
                        styles={'textMeta fontBold'}
                        customLabel={item.address}
                      />
                    </View>

                    {item.phone && item.phone.length > 0 && (
                      <View
                        style={[cStyles.row, cStyles.itemsStart, cStyles.pt10]}>
                        <CText
                          styles={'textMeta pt6'}
                          label={'contact_us:phone'}
                        />
                        <View
                          style={[
                            cStyles.row,
                            cStyles.itemsCenter,
                            cStyles.flexWrap,
                            {width: '95%'},
                          ]}>
                          {item.phone.map((itemPhone, indexPhone) => (
                            <CText
                              key={itemPhone}
                              styles={
                                'textMeta fontBold textUnderline pt6 ' +
                                (indexPhone !== 0 && 'pl10')
                              }
                              customLabel={itemPhone}
                              onPress={() => handlePhone(itemPhone)}
                            />
                          ))}
                        </View>
                      </View>
                    )}

                    {item.email && (
                      <View
                        style={[cStyles.row, cStyles.itemsStart, cStyles.pt10]}>
                        <CText styles={'textMeta'} label={'contact_us:email'} />
                        <CText
                          styles={'textMeta fontBold textUnderline'}
                          customLabel={item.email}
                          onPress={() => handleEmail(item.email)}
                        />
                      </View>
                    )}

                    {item.website && (
                      <View
                        style={[cStyles.row, cStyles.itemsStart, cStyles.pt10]}>
                        <CText
                          styles={'textMeta'}
                          label={'contact_us:website'}
                        />
                        <CText
                          styles={'textMeta fontBold textUnderline'}
                          customLabel={item.website}
                          onPress={() => handleURL(item.website)}
                        />
                      </View>
                    )}
                  </View>
                }
              />
            );
          })}
        </CContent>
      }
    />
  );
});

export default ContactUs;
