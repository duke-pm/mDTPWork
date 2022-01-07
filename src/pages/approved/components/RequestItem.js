/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {Avatar, Card, Text} from "@ui-kitten/components";
import {View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/** COMPONENTS */
import CStatus from "~/components/CStatus";
/* COMMON */
import {Assets} from "~/utils/asset";
import {Commons} from "~/utils/common";
import {cStyles} from "~/utils/style";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from "~/configs/constants";

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
      statusID: data.statusID,
      statusName: data.statusName,
    });
  };

  /************
   ** RENDER **
   ************/
  let title =
    `${data.requestID} | ${trans("approved_assets:title_request_item")}`;
  if (data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.value) {
    title = `${data.requestID} | ${trans("approved_lost_damaged:title_request_item_1")}${
      data.requestTypeName
    }`;
  }
  return (
    <Card
      onPress={handleRequestItem}
      header={propsH => 
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween,
            cStyles.px16,
            cStyles.py10,
          ]}>
          <View style={cStyles.itemsStart}>
            <Text category="s1">{title}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {`${trans("common:created_at")} ${moment(
                data.requestDate,
                DEFAULT_FORMAT_DATE_4,
              ).format(DEFAULT_FORMAT_DATE_9)}`}
            </Text>
          </View>
          <View style={cStyles.itemsEnd}>
            <CStatus
              type="approved"
              value={data.statusID}
              label={data.statusName}
            />
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <Avatar size="tiny" source={Assets.iconUser} />
          <View style={cStyles.ml10}>
            <Text>{data.personRequest}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {data.deptName}
            </Text>
          </View>
        </View>

        <View style={cStyles.itemsEnd}>
          <Text>{data.regionName}</Text>
          <Text style={cStyles.mt5} category="c1" appearance="hint">
            {trans("list_request_assets_handling:region")}
          </Text>
        </View>
      </View>
    </Card>
  );
}

RequestItem.propTypes = {
  trans: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  dataProcess: PropTypes.array,
  dataDetail: PropTypes.array,
  onPress: PropTypes.func,
};

export default React.memo(RequestItem);
