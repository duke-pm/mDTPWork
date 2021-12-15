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
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CCard from '~/components/CCard';
import CStatusTag from '~/components/CStatusTag';
import CUser from '~/components/CUser';
import CIcon from '~/components/CIcon';
/* COMMON */
import {Commons, Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';

function RequestItem(props) {
  const {t} = useTranslation();
  const {
    customColors = {},
    index = -1,
    data = null,
    dataProcess = [],
    dataDetail = [],
    onPress = () => null,
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
  let title = `${t('approved_assets:title_request_item')}`,
    statusIcon = Icons.request,
    colorText = 'colorOrange',
    statusColor = Commons.STATUS_REQUEST.WAIT.color,
    bgColor = Commons.STATUS_REQUEST.WAIT.bgColor;
  if (data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.value) {
    title = `${t('approved_lost_damaged:title_request_item_1')}${
      data.requestTypeName
    }`;
  }
  if (data.statusID === Commons.STATUS_REQUEST.APPROVED.value) {
    statusIcon = Icons.requestApproved_1;
    colorText = 'colorBlue';
    statusColor = Commons.STATUS_REQUEST.APPROVED.color;
    bgColor = Commons.STATUS_REQUEST.APPROVED.bgColor;
  } else if (data.statusID === Commons.STATUS_REQUEST.REJECT.value) {
    statusIcon = Icons.requestRejected;
    colorText = 'colorRed';
    statusColor = Commons.STATUS_REQUEST.REJECT.color;
    bgColor = Commons.STATUS_REQUEST.REJECT.bgColor;
  } else if (data.statusID === Commons.STATUS_REQUEST.DONE.value) {
    statusIcon = Icons.requestApproved_2;
    colorText = 'colorGreen';
    statusColor = Commons.STATUS_REQUEST.DONE.color;
    bgColor = Commons.STATUS_REQUEST.DONE.bgColor;
  }
  return (
    <CCard
      key={index}
      customLabel={title}
      idx={data.requestID}
      color={colors.BG_APPROVED}
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
                  bgColor={bgColor}
                />
              </View>
            </View>

            {/** Region & User send */}
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                cStyles.mt10,
              ]}>
              <View
                style={[cStyles.row, cStyles.itemsCenter, styles.flex_half]}>
                <CIcon size={'smaller'} name={Icons.dateRequest} />
                <CLabel
                  style={cStyles.pl5}
                  customLabel={moment(
                    data.requestDate,
                    DEFAULT_FORMAT_DATE_4,
                  ).format(formatDateView)}
                />
              </View>

              {/** Department */}
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.pr10,
                  styles.flex_half,
                ]}>
                <CIcon size={'smaller'} name={Icons.departmentRequest} />
                <CLabel style={cStyles.pl5} customLabel={data.deptName} />
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
