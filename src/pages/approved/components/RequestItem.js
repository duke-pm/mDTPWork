/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Button, Card} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Assets} from '~/utils/asset';
import {Commons, Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';

function RequestItem(props) {
  const {
    trans = {},
    index = -1,
    data = null,
    dataProcess = [],
    dataDetail = [],
    onPress = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRequestItem = () => {
    onPress(data, dataProcess, dataDetail, {
      statusIcon,
      statusColor,
      statusName: data.statusName,
    });
  };

  /************
   ** RENDER **
   ************/
  let title = `${trans('approved_assets:title_request_item')}`,
    statusIcon = Icons.request,
    statusColor = 'warning';
  if (data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.value) {
    title = `${trans('approved_lost_damaged:title_request_item_1')}${
      data.requestTypeName
    }`;
  }
  if (data.statusID === Commons.STATUS_REQUEST.APPROVED.value) {
    statusIcon = 'checkmark';
    statusColor = 'info';
  } else if (data.statusID === Commons.STATUS_REQUEST.REJECT.value) {
    statusIcon = 'close';
    statusColor = 'danger';
  } else if (data.statusID === Commons.STATUS_REQUEST.DONE.value) {
    statusIcon = 'done-all';
    statusColor = 'success';
  }
  return (
    <Card
      onPress={handleRequestItem}
      header={propsH => 
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px16,
            cStyles.py10,
          ]}>
          <View style={styles.con_header_left}>
            <CText category="s1">{`${title}`}</CText>
            <CText category="c1" appearance="hint">{
              moment(
                data.requestDate,
                DEFAULT_FORMAT_DATE_4,
              ).format(DEFAULT_FORMAT_DATE_9)
            }</CText>
          </View>
          <View style={[cStyles.itemsEnd, styles.con_header_right]}>
            <Button size="tiny" status={statusColor}>
              {data.statusName}
            </Button>
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <Avatar size="tiny" source={Assets.iconUser} />
          <View style={cStyles.ml10}>
            <CText>{data.personRequest}</CText>
            <CText category='c1' appearance="hint">{data.deptName}</CText>
          </View>
        </View>

        <View style={cStyles.itemsEnd}>
          <CText>{data.regionName}</CText>
          <CText category="c1" appearance="hint">
            {trans('list_request_assets_handling:region')}
          </CText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_header_left: {flex: 0.7},
  con_header_right: {flex: 0.3},
});

RequestItem.propTypes = {
  trans: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  dataProcess: PropTypes.array,
  dataDetail: PropTypes.array,
  onPress: PropTypes.func,
};

export default React.memo(RequestItem);
