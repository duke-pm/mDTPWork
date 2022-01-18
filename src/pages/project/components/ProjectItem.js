/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Project Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import PropTypes from "prop-types";
import React, {useState} from "react";
import {
  Avatar, MenuItem, OverflowMenu, Card, Icon,
  Text, Tooltip,
} from "@ui-kitten/components";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import IoniIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import "moment/locale/en-sg";
/** COMPONENTS */
import CStatus from "~/components/CStatus";
/* COMMON */
import {Assets} from "~/utils/asset";
import {Commons} from "~/utils/common";
import {colors, cStyles} from "~/utils/style";
import {
  moderateScale,
} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from "~/configs/constants";

/** All init */
const initSizeIconMore = moderateScale(16);
const colorPriority = "color-danger-500";
const colorHint = "text-hint-color";

const RenderChartIcon = props => (
  <Icon {...props} name="bar-chart-outline" />
);

const RenderDetailsIcon = props => (
  <Icon {...props} name="info-outline" />
);

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

function ProjectItem(props) {
  const {
    trans = {},
    theme = {},
    formatDateView = DEFAULT_FORMAT_DATE_9,
    index = -1,
    data = null,
    onPress = () => null,
    onPressDetail = () => null,
    onPressOverview = () => null,
  } = props;

  /** Use state */
  const [tooltipDelay, setTooltipDelay] = useState(false);
  const [visibleMore, setVisibleMore] = useState(false);
  
  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

  const toggleMore = () => setVisibleMore(!visibleMore);

  const handleItem = () => onPress(data);

  const handleDetails = () => {
    onPressDetail(data);
    toggleMore();
  };

  const handleOverview = () => {
    onPressOverview(data);
    toggleMore();
  };

  /************
   ** RENDER **
   ************/
  let delay = 0;
  if (
    data &&
    data.statusID < Commons.STATUS_PROJECT[4]["value"]
  ) {
    if (data.endDate && data.endDate !== "") {
      delay = moment().diff(data.endDate, "days");
    }
  }
  return (
    <Card
      onPress={handleItem}
      status={!data.isPublic ? "warning" : undefined}
      header={propsH =>
        <View
          style={[
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween,
            cStyles.px16,
            cStyles.py10,
          ]}>
          <View style={[cStyles.flex1, cStyles.itemsStart, cStyles.pr10]}>
            <Text category="s1" numberOfLines={2}>
              {`${data.prjID} | ${data.prjName}`}
            </Text>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <Avatar size="tiny" source={Assets.iconUser} />
                <View style={cStyles.ml10}>
                  <Text category="c1">{data.ownerName}</Text>
                  {data.priorityLevel > 0 && (
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <Text category="c1" appearance="hint">
                        {`${trans("project_management:piority")}`}
                      </Text>
                      <View
                        style={[
                          cStyles.center,
                          cStyles.rounded5,
                          cStyles.ml5,
                          cStyles.px3,
                          {backgroundColor: theme[colorPriority]},
                        ]}>
                        <Text category="c1" status="control">
                          {data.priorityLevel}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyEnd,
            ]}>
            <View style={cStyles.itemsEnd}>
              <CStatus
                type="project"
                value={data.statusID}
                label={data.statusName}
              />
            </View>
            <OverflowMenu
              anchor={() => 
                <IoniIcon
                  style={cStyles.ml5}
                  name="ellipsis-vertical"
                  size={initSizeIconMore}
                  color={theme[colorHint]}
                  onPress={toggleMore}
                />
              }
              backdropStyle={styles.con_backdrop}
              visible={visibleMore}
              onBackdropPress={toggleMore}>
              {data.countTask > 0 && (
                <MenuItem
                  title={trans("project_management:project_plan")}
                  accessoryLeft={RenderChartIcon}
                  onPress={handleOverview}
                />
              )}
              <MenuItem
                title={trans("project_management:project_details")}
                accessoryLeft={RenderDetailsIcon}
                onPress={handleDetails}
              />
            </OverflowMenu>
            
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
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            {delay === 0 && (
              <View>
                <Text category="c1">
                  {moment(data.endDate, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
                </Text>
                <Text style={cStyles.mt5} category="c1" appearance="hint">
                  {trans("project_management:end_date")}
                </Text>
              </View>
            )}
            {delay > 0 && (
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
          </View>
        )}

        {data.appraisalTime && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">
              {moment(data.appraisalTime, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
            </Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {trans("project_management:appraisal_time")}
            </Text>
          </View>
        )}

        {data.countChild > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">{data.countChild}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {trans("project_management:child_projects")}
            </Text>
          </View>
        )}
        {data.countTask > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <Text category="c1">{data.countTask}</Text>
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

ProjectItem.propTypes = {
  trans: PropTypes.object,
  theme: PropTypes.object,
  formatDateView: PropTypes.string,
  index: PropTypes.number,
  data: PropTypes.object,
  onPress: PropTypes.func,
  onPressDetail: PropTypes.func,
  onPressOverview: PropTypes.func,
};

export default ProjectItem;
