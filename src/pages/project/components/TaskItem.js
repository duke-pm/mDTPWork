/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Task Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of TaskItem.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Avatar, Button, Card, Layout, Text, Tooltip} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {DEFAULT_FORMAT_DATE_4, DEFAULT_FORMAT_DATE_9} from '~/configs/constants';
import {Commons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';

function TaskItem(props) {
  const {
    theme = {},
    data = null,
    trans = null,
    onPress = () => null,
  } = props;

  /** Use state */
  const [tooltipDelay, setTooltipDelay] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

  const handleItem = () => {
    if (data.statusID === Commons.STATUS_TASK["7"].value) {
      data.isUpdated = false;
    }
    onPress(data);
  };

  /************
   ** RENDER **
   ************/
  let showPercentage = data.taskTypeID === Commons.TYPE_TASK.TASK.value,
    bgTaskType = colors.STATUS_NEW_OPACITY, // Default is TASK
    delay = 0;
  if (data) {
    if (data.taskTypeID === Commons.TYPE_TASK.PHASE.value) {
      bgTaskType = colors.STATUS_ON_HOLD_OPACITY;
    } else if (data.taskTypeID === Commons.TYPE_TASK.MILESTONE.value) {
      bgTaskType = colors.STATUS_SCHEDULE_OPACITY;
    }
  }
  if (
    data &&
    showPercentage &&
    data.statusID < Commons.STATUS_TASK["5"].value
  ) {
    if (data.endDate && data.endDate !== '') {
      delay = moment().diff(data.endDate, 'days');
    }
  }
  return (
    <Card
      style={data.statusID > 4
        ? {backgroundColor: theme['background-basic-color-2']}
        : {}}
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
              <Text category="s1" status={Commons.TYPE_TASK[data.typeName]['color']}>
                {data.typeName}
              </Text>
              <Text style={cStyles.pl5} category="s1">{`  ${data?.taskName}`}</Text>
            </Text>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <Avatar size="tiny" source={Assets.iconUser} />
                <View style={cStyles.ml5}>
                  <CText category="c1">{`${data.ownerName} | `}</CText>
                </View>
              </View>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                <CText category="c1" appearance="hint">
                    {`${trans('project_management:piority')}`}
                  </CText>
                <CText category="c1" status={Commons.PRIORITY_TASK[data.priority]['color']}>
                  {` ${data.priorityName}`}
                </CText>
              </View>
            </View>
          </View>
          <View style={cStyles.itemsEnd}>
            <Button
              appearance="outline"
              size="tiny"
              status={Commons.STATUS_TASK[data.statusID.toString()].color}>
              {propsB =>
                <View style={cStyles.center}>
                  <Text style={propsB.style}>{data.statusName}</Text>
                  {data.typeName === 'TASK' && (
                    <Text style={[propsB.style, cStyles.mt3]}>{`${data.percentage}%`}</Text>
                  )}
                </View>
              }
            </Button>
          </View>
        </View>
      }>
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        {data.startDate && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{moment(data.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:start_date')}
            </CText>
          </View>
        )}

        {data.endDate && (
          <Tooltip
            backdropStyle={styles.con_backdrop}
            visible={tooltipDelay}
            onBackdropPress={toggleTooltipDelay}
            anchor={() =>
              <TouchableOpacity
                style={[cStyles.itemsStart, styles.con_flex]}
                disabled={delay === 0}
                onPress={toggleTooltipDelay}>
                <View>
                  <CText status={delay > 0 ? "danger" : "basic"}>
                    {moment(data.endDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
                  </CText>
                  <CText category="c1" appearance="hint">
                    {trans('project_management:end_date')}
                  </CText>
                </View>
              </TouchableOpacity>
            }>
            {`${trans('project_management:delay_date_1')} ${delay} ${trans('project_management:delay_date_2')}`}
          </Tooltip>
        )}

        {data.countChild > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{data.countChild}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:child_tasks')}
            </CText>
          </View>
        )}

        {data.lstUserInvited.length > 0 && (
          <View style={[cStyles.justifyStart, styles.con_flex]}>
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              {data.lstUserInvited.map((itemP, indexP) => {
                if (indexP > 3) return null;
                if (indexP === 3) {
                  return (
                    <Layout
                      style={[
                        cStyles.abs,
                        cStyles.center,
                        cStyles.rounded5,
                        styles.con_avatar_number,
                        {left: indexP * 15}]}
                      level="4">
                      <Text category="c2">{`+${data.lstUserInvited.length - 3}`}</Text>
                    </Layout>
                  );
                }
                return (
                  <Avatar
                    style={[cStyles.abs, {left: indexP * 15}]}
                    size="tiny"
                    source={Assets.iconUser} />
                );
              })}
            </View>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.25},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
  con_avatar_number: {height: 24, width: 24},
});

TaskItem.propTypes = {
  theme: PropTypes.object,
  data: PropTypes.object.isRequired,
  trans: PropTypes.func,
  onPress: PropTypes.func,
};

export default React.memo(TaskItem);
