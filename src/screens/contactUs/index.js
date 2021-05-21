/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Contact Us
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ContactUs.js
 **/
import React from 'react';
import {Linking, ScrollView, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';

const DATA = [
  {
    id: '1',
    label: 'CÔNG TY TNHH EDUCATION SOLUTIONS VIỆT NAM',
    address:
      '148 - 150 Nguyễn Đình Chính, P. 8, Quận Phú Nhuận, Tp. Hồ Chí Minh',
    phone: ['(+84) 28 3845 6936', '(+84) 3845 6937', '(+84) 28 3845 6928'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '2',
    label: 'CHI NHÁNH MIỀN BẮC',
    address:
      'Tầng 7, Số 227, Đường Nguyễn Ngọc Nại, P. Khương Mai, Q. Thanh Xuân, Tp. Hà Nội',
    phone: ['(+84) 24 3513 4278', '(+84) 24 3513 4279'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '3',
    label: 'VĂN PHÒNG ĐẠI DIỆN MIỀN TRUNG',
    address: '90/2 Nguyễn Văn Linh, Q. Hải Châu, Tp. Đà Nẵng',
    phone: ['(+84) 236 3849 076', '(+84) 236 3692 775', '(+84) 236 3849 076'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '4',
    label: 'VĂN PHÒNG ĐẠI DIỆN ĐÔNG NAM BỘ',
    address: 'D08, 253 Phạm Văn Thuận, P. Tân Mai, Tp. Biên Hòa, Đồng Nai',
    phone: ['(+84) 251 3918 711', '(+84) 251 3918 713'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '5',
    label: 'VĂN PHÒNG ĐẠI DIỆN MEKONG',
    address:
      'Tầng 5, Toà nhà STS, 11B Đại lộ Hoà Bình, Q. Ninh Kiều, Tp. Cần Thơ',
    phone: ['(+84) 292 6252 559', '(+84) 292 6252 558'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '6',
    label: 'CHI NHÁNH LAOS',
    address:
      'House No. 108, Unit 07, Ban Phone Sinuane, Phone Sinuane Road., Sisattanak District, Vientiane Capital, Laos',
    phone: ['(+856) 20 5554 2926'],
    email: 'info.dtplaos@dtp-education.com',
    website: 'https://www.tes-thailand.com/',
  },
  {
    id: '7',
    label: 'CHI NHÁNH THÁI LAN',
    address:
      'H.Cape Bizplus Wongwaen-Onnut 24/25 Sukhapiban 2 RD.Prawet Bangkok 10250',
    phone: ['(+66) 21 154 943'],
    email: null,
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '8',
    label: 'CHI NHÁNH CAMBODIA',
    address: '(3rd Floor), St. 63, Chak Tomuk Daun Penh, Phnom Penh',
    phone: ['(+855) 16 555 287'],
    email: null,
    website: 'https://www.dtpcambodia.com/',
  },
  {
    id: '9',
    label: 'CHI NHÁNH SINGAPORE',
    address: '470 North Bridge Road # 05-12 Bugis Cube Singapore (188735)',
    phone: [],
    email: null,
    website: 'https://www.edpub.sg/',
  },
];

const ContactUs = React.memo(function ContactUs(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  const handlePhone = data => {
    Linking.openURL(`tel:${data}`);
  };

  const handleEmail = data => {
    Linking.openURL(`mailto:${data}`);
  };

  const handleURL = data => {
    Linking.openURL(data);
  };

  return (
    <CContainer
      header
      loading={false}
      title={'contact_us:title'}
      hasBack
      content={
        <CContent>
          <ScrollView style={cStyles.flex1} contentContainerStyle={cStyles.p16}>
            {DATA.map((item, index) => {
              return (
                <CCard
                  key={item.id}
                  containerStyle={index === 0 ? cStyles.mt16 : cStyles.mt40}
                  customColors={customColors}
                  darkMode={isDark}
                  customLabel={item.label}
                  cardContent={
                    <View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsStart,
                          {width: '88%'},
                        ]}>
                        <CText
                          styles={'textMeta'}
                          label={'contact_us:address'}
                        />
                        <CText
                          styles={'textMeta fontBold'}
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
                          style={[
                            cStyles.row,
                            cStyles.itemsStart,
                            cStyles.pt10,
                          ]}>
                          <CText
                            styles={'textMeta'}
                            label={'contact_us:email'}
                          />
                          <CText
                            styles={'textMeta fontBold textUnderline'}
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
          </ScrollView>
        </CContent>
      }
    />
  );
});

export default ContactUs;
