/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import PropTypes from 'prop-types';
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
import Icons from '~/utils/common/Icons';
import Commons from '~/utils/common/Commons';
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';

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
              <CUser style={styles.flex_half} label={data.personRequest} />
              <View style={[cStyles.itemsStart, styles.flex_half]}>
                <CStatusTag
                  customLabel={data.statusName}
                  color={customColors[statusColor]}
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
              <View style={[cStyles.row, cStyles.itemsStart, styles.flex_half]}>
                <CLabel label={'approved_lost_damaged:date_request'} />
                <CLabel
                  customLabel={moment(
                    data.requestDate,
                    DEFAULT_FORMAT_DATE_4,
                  ).format(formatDateView)}
                />
              </View>

              {/** Department */}
              <View style={[cStyles.row, cStyles.itemsStart, styles.flex_half]}>
                <Text numberOfLines={2}>
                  <Text
                    style={[cStyles.textCaption1, {color: customColors.text}]}>
                    {t('approved_lost_damaged:department_request')}
                  </Text>
                  <Text
                    style={[cStyles.textCaption1, {color: customColors.text}]}>
                    {data.deptName}
                  </Text>
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
  flex_half: {flex: 0.5},
});

RequestItem.propTypes = {
  customColors: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  dataProcess: PropTypes.array,
  dataDetail: PropTypes.array,
  onPress: PropTypes.func,
};

export default React.memo(RequestItem);
