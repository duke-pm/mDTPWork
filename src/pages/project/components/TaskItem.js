/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import PropTypes from "prop-types";
import React, {useState} from "react";
import {Avatar, Card, Text, Tooltip} from "@ui-kitten/components";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/** COMPONENTS */
import CStatus from "~/components/CStatus";
/* COMMON */
import {Assets} from "~/utils/asset";
import {Commons} from "~/utils/common";
import {colors, cStyles} from "~/utils/style";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from "~/configs/constants";

const RenderToDate = (trans, formatDateView, data, delay, onPress) => {
  return (
    <TouchableOpacity
      style={[cStyles.itemsStart, styles.con_flex]}
      disabled={delay === 0}
      onPress={onPress}>
      <View>
        <Text status={delay > 0 ? "danger" : "basic"} category="c1">
          {moment(data, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
        </Text>
        <Text style={cStyles.mt5} category="c1" appearance="hint">
          {trans("project_management:end_date")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function TaskItem(props) {
  const {
    trans = null,
    formatDateView = DEFAULT_FORMAT_DATE_9,
    data = null,
    onPress = () => null,
  } = props;

  /** Use state */
  const [tooltipDelay, setTooltipDelay] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

  const handleItem = () => {
    if (data.statusID === Commons.STATUS_PROJECT[6]["value"]) {
      data.isUpdated = false;
    }
    onPress(data);
  };

  /************
   ** RENDER **
   ************/
  let showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value,
    delay = 0;
  if (
    data &&
    showPercentage &&
    data.statusID < Commons.STATUS_PROJECT[4]["value"]
  ) {
    if (data.endDate && data.endDate !== "") {
      delay = moment().diff(data.endDate, "days");
    }
  }
  return (
    <Card
      onPress={handleItem}
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
          <View style={[cStyles.flex1, cStyles.itemsStart, cStyles.pr10]}>
            <Text numberOfLines={2}>
              <Text category="s1">{`${data?.taskID} | `}</Text>
              <Text category="s1" status={Commons.TYPE_TASK[data.typeName]["color"]}>
                {data.typeName}
              </Text>
              <Text category="s1">{` ${data?.taskName}`}</Text>
            </Text>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
              <Avatar size="tiny" source={Assets.iconUser} />
              <View style={cStyles.ml10}>
                <Text category="c1">{`${data.ownerName}`}</Text>
              </View>
            </View>
          </View>
          <View style={cStyles.itemsEnd}>
            <CStatus
              type="project"
              value={data.statusID}
              label={data.statusName}
            />
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        {data.startDate && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">
              {moment(data.startDate, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
            </Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {trans("project_management:start_date")}
            </Text>
          </View>
        )}

        {data.endDate && (
          <Tooltip
            backdropStyle={styles.con_backdrop}
            visible={tooltipDelay}
            onBackdropPress={toggleTooltipDelay}
            anchor={() =>
              RenderToDate(
                trans,
                formatDateView,
                data.endDate,
                delay,
                toggleTooltipDelay,
              )}>
            {`${trans(
              "project_management:delay_date_1"
              )} ${delay} ${trans(
                "project_management:delay_date_2"
              )}`}
          </Tooltip>
        )}

        {data.countChild === 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">{`${data.percentage}%`}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {trans("project_management:holder_task_percentage")}
            </Text>
          </View>
        )}

        {data.countChild > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">{data.countChild}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {trans("project_management:child_tasks")}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.25},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

TaskItem.propTypes = {
  formatDateView: PropTypes.string,
  data: PropTypes.object.isRequired,
  trans: PropTypes.func,
  onPress: PropTypes.func,
};

export default React.memo(TaskItem);
