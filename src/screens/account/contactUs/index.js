/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Contact Us page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactUs.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {Linking, View} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CList from '~/components/CList';
/* COMMON */
import {cStyles} from '~/utils/style';
import {DATA_CONTACT_US} from '~/config/constants';

/** All init */
const COLORS_HEADER_CARD = {
  dark: ['#232526', '#414345'],
  light: ['#E0EAFC', '#eef2f3', '#fff'],
};

function ContactUs(props) {
  const theme = useColorScheme();

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
      loading={false}
      content={
        <CContent scrollEnabled={false}>
          <CList
            contentStyle={cStyles.mt16}
            data={DATA_CONTACT_US}
            item={({item, index}) => {
              return (
                <CCard
                  key={item.id}
                  customLabel={item.label}
                  gradientColor={COLORS_HEADER_CARD[theme]}
                  content={
                    <View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsStart,
                          {width: '88%'},
                        ]}>
                        <CText
                          styles={'textCaption1'}
                          label={'contact_us:address'}
                        />
                        <CText
                          styles={'textCaption1 fontBold'}
                          customLabel={item.address}
                        />
                      </View>

                      {item.phone && item.phone.length > 0 && (
                        <View
                          style={[
                            cStyles.row,
                            cStyles.itemsStart,
                            cStyles.pt10,
                          ]}>
                          <CText
                            styles={'textCaption1 pt6'}
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
                                  'textCaption1 fontBold textUnderline pt6 ' +
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
                          style={[
                            cStyles.row,
                            cStyles.itemsStart,
                            cStyles.pt10,
                          ]}>
                          <CText
                            styles={'textCaption1'}
                            label={'contact_us:email'}
                          />
                          <CText
                            styles={'textCaption1 fontBold textUnderline'}
                            customLabel={item.email}
                            onPress={() => handleEmail(item.email)}
                          />
                        </View>
                      )}

                      {item.website && (
                        <View
                          style={[
                            cStyles.row,
                            cStyles.itemsStart,
                            cStyles.pt10,
                          ]}>
                          <CText
                            styles={'textCaption1'}
                            label={'contact_us:website'}
                          />
                          <CText
                            styles={'textCaption1 fontBold textUnderline'}
                            customLabel={item.website}
                            onPress={() => handleURL(item.website)}
                          />
                        </View>
                      )}
                    </View>
                  }
                />
              );
            }}
          />
        </CContent>
      }
    />
  );
}

export default React.memo(ContactUs);
