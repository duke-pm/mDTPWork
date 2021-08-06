/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CCard from '~/components/CCard';
import CStatusTag from '~/components/CStatusTag';
import CUser from '~/components/CUser';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {cStyles} from '~/utils/style';

function RequestItem(props) {
  const {t} = useTranslation();
  const {customColors, index, data, dataProcess, dataDetail, onPress} = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDateView = commonState.get('formatDateView');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRequestItem = () => {
    onPress(data, dataProcess, dataDetail, {
      statusIcon,
      colorText,
      statusColor,
    });
  };

  /************
   ** RENDER **
   ************/
  let title = `#${data.requestID} ${t('approved_assets:title_request_item')}`;
  let statusIcon = Icons.request;
  let colorText = 'colorOrange';
  let statusColor = 'orange';
  if (data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.value) {
    title = `#${data.requestID} ${t(
      'approved_lost_damaged:title_request_item_1',
    )}${data.requestTypeName}`;
  }
  if (data.statusID === Commons.STATUS_REQUEST.APPROVED.value) {
    statusIcon = Icons.requestApproved_1;
    colorText = 'colorBlue';
    statusColor = 'blue';
  } else if (data.statusID === Commons.STATUS_REQUEST.REJECT.value) {
    statusIcon = Icons.requestRejected;
    colorText = 'colorRed';
    statusColor = 'red';
  } else if (data.statusID === Commons.STATUS_REQUEST.DONE.value) {
    statusIcon = Icons.requestApproved_2;
    colorText = 'colorGreen';
    statusColor = 'green';
  }
  return (
    <CCard
      key={index}
      customLabel={title}
      onPress={handleRequestItem}
      content={
        <View
          style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <View style={cStyles.flex1}>
            {/** Date send & Status */}
            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View style={[cStyles.itemsStart, styles.header_right]}>
                <CStatusTag
                  customLabel={data.statusName}
                  color={customColors[statusColor]}
                />
              </View>
              <CUser style={styles.header_right} label={data.personRequest} />
            </View>

            {/** Region & User send */}
            <View
              style={[
                cStyles.row,
                cStyles.itemsStart,
                cStyles.justifyBetween,
                cStyles.mt6,
              ]}>
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel label={'approved_lost_damaged:date_request'} />
                <CLabel
                  customLabel={moment(
                    data.requestDate,
                    DEFAULT_FORMAT_DATE_4,
                  ).format(formatDateView)}
                />
              </View>

              {/** Department */}
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <Text numberOfLines={2}>
                  <Text style={cStyles.textCaption1}>
                    {t('approved_lost_damaged:department_request')}
                  </Text>
                  <Text style={cStyles.textCaption1}>{data.deptName}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header_left: {flex: 0.5},
  header_right: {flex: 0.5},
});

export default React.memo(RequestItem);
