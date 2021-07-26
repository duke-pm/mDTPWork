/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CTouchable from '~/components/CTouchable';
import CCard from '~/components/CCard';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

function RequestItem(props) {
  const {t} = useTranslation();
  const {
    loading,
    customColors,
    index,
    data,
    dataProcess,
    dataDetail,
    onPress,
  } = props;

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
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyStart,
                  styles.header_right,
                ]}>
                <CAvatar size={'vsmall'} label={data.personRequest} />
                <CLabel style={cStyles.ml6} customLabel={data.personRequest} />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsCenter, styles.header_right]}>
                <Icon
                  name={statusIcon}
                  size={moderateScale(18)}
                  color={customColors[statusColor]}
                />
                <CText
                  styles={'pl6 textCaption1 fontBold ' + colorText}
                  customLabel={data.statusName}
                />
              </View>
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

              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel customLabel={data.regionName} />
              </View>
            </View>

            {/** Department */}
            <View
              style={[
                cStyles.row,
                cStyles.itemsStart,
                cStyles.justifyBetween,
                cStyles.mt6,
              ]}>
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel label={'approved_lost_damaged:department_request'} />
                <CLabel numberOfLines={1} customLabel={data.deptName} />
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
