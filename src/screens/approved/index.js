/**
 ** Name: Approved page
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, { useState, useEffect } from 'react';
import { View, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigation/Routes';
import { colors, cStyles } from '~/utils/style';
import Configs from '~/config';
/* REDUX */

const DATA = [
  {
    id: 1,
    title: 'Đơn xin cấp phát tài sản #001',
    status: 0,
    date: '2021-04-21',
  },
  {
    id: 2,
    title: 'Đơn xin cấp phát tài sản #002',
    status: 1,
    date: '2021-04-22',
  },
  {
    id: 3,
    title: 'Đơn xin cấp phát tài sản #003',
    status: 2,
    date: '2021-04-24',
  },
  {
    id: 4,
    title: 'Đơn xin cấp phát tài sản #004',
    status: 0,
    date: '2021-04-24',
  },
  {
    id: 5,
    title: 'Đơn xin cấp phát tài sản #005',
    status: 2,
    date: '2021-04-20',
  },
]

const ApprovedItem = (index, data) => {
  return (
    <View style={[cStyles.py10, cStyles.px16, index !== 0 && cStyles.borderTop]}>
      <CText styles={'textTitle'} customLabel={data.title} />
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pt10]}>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <CText styles={'textMeta'} label={'approved:date_request'} />
          <CText styles={'textMeta'} customLabel={moment(data.date).format(Configs.dateFormatView)} />
        </View>

        {data.status === 2 &&
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <CText styles={'textMeta'} label={'approved:date_approved'} />
            <CText styles={'textMeta'} customLabel={moment(data.date).format(Configs.dateFormatView)} />
          </View>
        }
      </View>
    </View>
  )
}

const RenderHeaderSection = (section) => {
  if (section.data.length === 0) return null;

  let nameIcon = '', colorIcon = 'black';
  if (section.data[0].status === 0) {
    nameIcon = 'paper-plane';
    colorIcon = colors.ORANGE;
  } else if (section.data[0].status === 1) {
    nameIcon = 'check';
    colorIcon = colors.BLUE;
  } else if (section.data[0].status === 2) {
    nameIcon = 'check-double';
    colorIcon = colors.GREEN;
  }

  return (
    <View style={[cStyles.row, cStyles.itemsCenter, cStyles.p10, cStyles.rounded1, { backgroundColor: colors.GRAY_300 }]}>
      <Icon name={nameIcon} size={20} color={colorIcon} />
      <CText styles={'pl16'} customLabel={section.title} />
    </View>
  )
}

function Approved(props) {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  /** HANDLE FUNC */
  const handleAddNew = () => {
    props.navigation.navigate(Routes.MAIN.ADD_APPROVED.name);
  };

  /** FUNC */
  const prepareData = () => {
    let filter1 = DATA.filter(f => f.status === 0);
    let filter2 = DATA.filter(f => f.status === 1);
    let filter3 = DATA.filter(f => f.status === 2);

    let filter = [
      {
        title: 'Đã gửi yêu cầu',
        data: filter1,
      },
      {
        title: 'Trưởng Bộ Phận',
        data: filter2,
      },
      {
        title: 'Cấp phê duyệt (TGĐ/GĐHC)',
        data: filter3,
      },
    ]
    setData(filter);
    setLoading(false);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    prepareData();
  }, []);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      header
      hasAddNew
      title={'approved:title'}
      onPressAddNew={handleAddNew}
      content={
        <CContent padder>
          {/* <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pb16]}>
            <CText label={'approved:filter'} />
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.p10, cStyles.ml10, cStyles.rounded1, { backgroundColor: colors.GRAY_300 }]}>
              <CText label={'approved:status'} />
              <Icon style={cStyles.pl10} name={'times-circle'} size={15} color={colors.GRAY_700} />
            </View>
          </View> */}

          {!loading &&
            <SectionList
              sections={data}
              renderSectionHeader={({ section }) => RenderHeaderSection(section)}
              renderItem={({ item, index }) => {
                return ApprovedItem(index, item);
              }}
              keyExtractor={(item, index) => index.toString()}
              stickySectionHeadersEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          }
        </CContent>
      }
    />
  );
};

export default Approved;
