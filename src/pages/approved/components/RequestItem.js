/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {Avatar, Card, Text} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import moment from "moment";
/** COMPONENTS */
import CStatus from "~/components/CStatus";
/* COMMON */
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from "~/configs/constants";

function RequestItem(props) {
  const {
    trans = {},
    formatDateView = DEFAULT_FORMAT_DATE_9,
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
          <View style={[cStyles.itemsStart, cStyles.pr10]}>
            <Text category="s1">{`${data.requestID} | ${data.requestTypeName}`}</Text>
            <Text category="c1" appearance="hint">
              {`${trans('common:created_at')} ` +
              moment(data.requestDate, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
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
        <View style={styles.con_left}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Avatar size="tiny" source={Assets.iconUser} />
            <View style={cStyles.ml10}>
              <Text category="c1">{data.personRequest}</Text>
              <Text style={cStyles.mt5} category="c1" appearance="hint">
                {data.jobTitle}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.con_right}>
          <Text category="c1">{data.regionName}</Text>
          <Text style={cStyles.mt5} category="c1" appearance="hint">
            {trans("list_request_assets_handling:region")}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.6},
  con_right: {flex: 0.4},
})

RequestItem.propTypes = {
  trans: PropTypes.object,
  formatDateView: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
  dataProcess: PropTypes.array,
  dataDetail: PropTypes.array,
  onPress: PropTypes.func,
};

export default React.memo(RequestItem);
