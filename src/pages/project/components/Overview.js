/**
 ** Name: Overview page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Overview.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";
import {
  Layout, Text, Avatar, Tooltip, Icon, ListItem,
  Divider, Card,
} from "@ui-kitten/components";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CAvatar from "~/components/CAvatar";
import CText from "~/components/CText";
import Status from "./Status";
import Percentage from "./Percentage";
import FileAttach from "./FileAttach";
/* COMMON */
import {Commons} from "~/utils/common";
import {Assets} from "~/utils/asset";
import {cStyles, colors} from "~/utils/style";
import {
  checkEmpty,
} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from "~/configs/constants";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderDescriptionIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="list-outline"
  />
);

const RenderStatusIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="flash-outline"
  />
);

const RenderProjectIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="credit-card-outline"
  />
);

const RenderTimeIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="clock-outline"
  />
);

const RenderPercentIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="trending-up-outline"
  />
);

const RenderPersonIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="person-outline"
  />
);

const RenderPeopleIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="people-outline"
  />
);

const RenderPiorityIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="flag-outline"
  />
);

const RenderSectorIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="archive-outline"
  />
);

const RenderGradeIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="award-outline"
  />
);

const RenderComponentIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="book-outline"
  />
);

const RenderPushlisherIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="people-outline"
  />
);

const RenderOwnershipIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="people-outline"
  />
);

const RenderFileIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="attach-outline"
  />
);

const RenderAuthorIcon = props => (
  <Icon {...props}
    style={[props.style, cStyles.ml0]}
    name="person-outline"
  />
);

const RenderToDate = (formatDateView, delay, data, onPress) => {
  return (
    <TouchableOpacity disabled={delay === 0} onPress={onPress}>
      <Text status={delay > 0 ? "danger" : "basic"}>
        {moment(data, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
      </Text>
    </TouchableOpacity>
  );
}

/********************
 ** MAIN COMPONENT **
 ********************/
function Overview(props) {
  const {t} = useTranslation();
  const {
    loading = false,
    update = false,
    permissionChangeStatus = false,
    language = "vi",
    refreshToken = "",
    formatDateView = DEFAULT_FORMAT_DATE_9,
    navigation = {},
    task = null,
    onStartUpdate = () => null,
    onEndUpdate = () => null,
    onNeedUpdate = () => null,
  } = props;

  const [tooltipDelay, setTooltipDelay] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

  /**********
   ** FUNC **
   **********/

  /************
   ** RENDER **
   ************/
  if (!task) return null;

  let delay = 0,
    arrAvatarParticipant = [],
    showPercentage = task.taskTypeID === Commons.TYPE_TASK.TASK.value;
  if (showPercentage && task.statusID < Commons.STATUS_PROJECT[4]["value"]) {
    if (task.endDate && task.endDate !== "") {
      delay = moment().diff(task.endDate, "days");
    }
  }
  if (task.lstUserInvited.length > 0) {
    arrAvatarParticipant = task.lstUserInvited.map(itemA =>
      Assets.iconUser
    );
  }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={cStyles.p10}
      contentInsetAdjustmentBehavior={"automatic"}>
      {!loading && (
        <Card disabled>
          <Layout style={[cStyles.flex1, cStyles.rounded1, styles.con_content]}>
            <ListItem
              disabled={true}
              style={[cStyles.roundedTopLeft1, cStyles.roundedTopRight1]}
              title={propsT =>
                <Text appearance="hint">{t("project_management:piority")}</Text>}
              accessoryLeft={RenderPiorityIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <View style={[
                    cStyles.center,
                    cStyles.px5,
                    cStyles.py1,
                    cStyles.rounded1,
                    {backgroundColor: Commons.PRIORITY_TASK[task.priority]["color"]},
                  ]}>
                    <Text status="control" category="label">
                      {checkEmpty(task.priorityName)}
                    </Text>
                  </View>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:main_title")}</Text>}
              accessoryLeft={RenderProjectIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{task.prjName}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            {task.taskTypeID !==
              Commons.TYPE_TASK.MILESTONE.value && (
              <ListItem
                disabled={true}
                title={propsT =>
                  <Text appearance="hint">{t("project_management:status")}</Text>}
                accessoryLeft={RenderStatusIcon}
                accessoryRight={propsR =>
                  <Status
                    disabled={update}
                    isUpdate={permissionChangeStatus}
                    language={language}
                    refreshToken={refreshToken}
                    navigation={navigation}
                    task={task}
                    onStartUpdate={onStartUpdate}
                    onEndUpdate={onEndUpdate}
                    onNeedUpdate={onNeedUpdate}
                  />
                }
              />
            )}
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">
                  {t("project_management:estimated_time")}
                </Text>}
              accessoryLeft={RenderTimeIcon}
              accessoryRight={propsR =>
                <View
                  style={[
                    cStyles.flex1,
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyEnd,
                  ]}>
                  <Text>
                    {moment(task.startDate, DEFAULT_FORMAT_DATE_4).format(formatDateView)}
                  </Text>
                  <Text>  &#8594;  </Text>
                  <Tooltip
                    backdropStyle={styles.con_backdrop}
                    visible={tooltipDelay}
                    onBackdropPress={toggleTooltipDelay}
                    anchor={() =>
                      RenderToDate(formatDateView, delay, task.endDate, toggleTooltipDelay)}>
                    {`${t("project_management:delay_date_1")} ${
                      delay
                    } ${t("project_management:delay_date_2")}`}
                  </Tooltip>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:holder_task_percentage")}</Text>}
              accessoryLeft={RenderPercentIcon}
              accessoryRight={propsR =>
                <Percentage
                  disabled={update}
                  navigation={navigation}
                  language={language}
                  refreshToken={refreshToken}
                  task={task}
                  onStartUpdate={onStartUpdate}
                  onEndUpdate={onEndUpdate}
                />
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:assignee")}</Text>}
              accessoryLeft={RenderPersonIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                  <Avatar size="tiny" source={Assets.iconUser} />
                  <Text style={cStyles.ml10}>{task.ownerName}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            {arrAvatarParticipant.length > 0 && (
              <ListItem
                disabled={true}
                title={propsT =>
                  <Text appearance="hint">{t("project_management:user_invited")}</Text>}
                accessoryLeft={RenderPeopleIcon}
                accessoryRight={propsR =>
                  <CAvatar
                    style={cStyles.justifyEnd}
                    absolute={false}
                    sources={arrAvatarParticipant}
                    details={task.lstUserInvited}
                    size="tiny"
                  />
                }
              />
            )}
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:sector")}</Text>}
              accessoryLeft={RenderSectorIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.sectorName)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:grade")}</Text>}
              accessoryLeft={RenderGradeIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.gradeName)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:component")}</Text>}
              accessoryLeft={RenderComponentIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.componentName)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:author")}</Text>}
              accessoryLeft={RenderAuthorIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.author)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:origin_publisher")}</Text>}
              accessoryLeft={RenderPushlisherIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.originPublisher)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              title={propsT =>
                <Text appearance="hint">{t("project_management:owner_ship_dtp")}</Text>}
              accessoryLeft={RenderOwnershipIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <Text style={cStyles.textRight}>{checkEmpty(task.ownershipDTP)}</Text>
                </View>
              }
            />
            <Divider style={cStyles.flex1} />
            {task.attachFiles !== "" && (
              <ListItem
                disabled={true}
                title={propsT =>
                  <Text appearance="hint">{t("project_management:files_attach")}</Text>}
                accessoryLeft={RenderFileIcon}
                accessoryRight={propsR =>
                  <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                    <FileAttach file={task.attachFiles} />
                  </View>
                }
              />
            )}
            <Divider style={cStyles.flex1} />
            <ListItem
              disabled={true}
              style={[
                cStyles.itemsStart,
                cStyles.roundedBottomLeft1,
                cStyles.roundedBottomRight1,
              ]}
              title={propsT =>
                <Text appearance="hint">
                  {t("project_management:description")}
                </Text>}
              description={propsD =>
                <View style={cStyles.mt10}>
                  <CText>
                    {checkEmpty(task.descr, t("project_management:empty_description"))}
                  </CText>
                </View>
              }
              accessoryLeft={RenderDescriptionIcon}
            />
          </Layout>
        </Card>
      )}
    </KeyboardAwareScrollView>
  );
}

Overview.propTypes = {
  loading: PropTypes.bool,
  update: PropTypes.bool,
  permissionChangeStatus: PropTypes.bool,
  language: PropTypes.string,
  refreshToken: PropTypes.string,
  formatDateView: PropTypes.string,
  navigation: PropTypes.object,
  task: PropTypes.any,
  onStartUpdate: PropTypes.func,
  onEndUpdate: PropTypes.func,
  onNeedUpdate: PropTypes.func,
};

const styles = StyleSheet.create({
  con_flex: {flex: 0.48},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
  con_content: {
    marginHorizontal: -14,
    marginVertical: -6,
  }
});

export default Overview;
