/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Project Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  Avatar, Button, MenuItem, OverflowMenu, Card, Icon,
} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {Assets} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';

const initSizeIconMore = moderateScale(16);

const RenderChartIcon = props => (
  <Icon {...props} name="bar-chart-outline" />
);

const RenderDetailsIcon = props => (
  <Icon {...props} name="info-outline" />
);

function ProjectItem(props) {
  const {
    trans = {},
    theme = {},
    index = -1,
    data = null,
    onPress = () => null,
    onPressDetail = () => null,
    onPressOverview = () => null,
  } = props;

  /** Use state */
  const [visibleMore, setVisibleMore] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleMore = () => {
    setVisibleMore(!visibleMore);
  };

  const handleDetails = () => {
    onPressDetail(data);
    toggleMore();
  };

  const handleOverview = () => {
    onPressOverview(data);
    toggleMore();
  };

  const handleItem = () => onPress(data);

  /************
   ** RENDER **
   ************/
  return (
    <Card
      onPress={handleItem}
      status={!data.isPublic ? 'warning' : undefined}
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
            <CText category="s1">{`${data.prjName}`}</CText>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <Avatar size="tiny" source={Assets.iconUser} />
                <View style={cStyles.ml5}>
                  <CText category="c1">{data.ownerName}</CText>
                </View>
              </View>
              {data.priorityLevel > 0 && (
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                  <CText category="c1" appearance="hint">
                    {` | ${trans('project_management:piority')}`}
                  </CText>
                  <View
                    style={[
                      cStyles.center,
                      cStyles.rounded5,
                      cStyles.ml5,
                      cStyles.px3,
                      {backgroundColor: theme['color-danger-500']},
                    ]}>
                    <CText category="c1" status="control">{data.priorityLevel}</CText>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
            <Button
              style={cStyles.mr10}
              size="tiny"
              status={Commons.STATUS_TASK[data.statusID.toString()].color}>
              {data.statusName}
            </Button>
            <OverflowMenu
              anchor={() => 
                <IoniIcon
                  name="ellipsis-vertical"
                  size={initSizeIconMore}
                  color={theme['text-hint-color']}
                  onPress={toggleMore}
                />
              }
              backdropStyle={styles.backdrop}
              visible={visibleMore}
              onBackdropPress={toggleMore}>
              <MenuItem
                title={trans('project_management:project_plan')}
                accessoryLeft={RenderChartIcon}
                onPress={handleOverview}
              />
              <MenuItem
                title={trans('project_management:project_details')}
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
            <CText>{moment(data.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:start_date')}
            </CText>
          </View>
        )}

        {data.endDate && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{moment(data.endDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:end_date')}
            </CText>
          </View>
        )}

        {data.appraisalTime && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{moment(data.appraisalTime, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:appraisal_time')}
            </CText>
          </View>
        )}

        {data.countChild > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{data.countChild}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:child_projects')}
            </CText>
          </View>
        )}
        {data.countTask > 0 && (
          <View style={[cStyles.itemsStart, styles.con_flex]}>
            <CText>{data.countTask}</CText>
            <CText category="c1" appearance="hint">
              {trans('project_management:child_tasks')}
            </CText>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.25},
  backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

ProjectItem.propTypes = {
  trans: PropTypes.object,
  theme: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  onPress: PropTypes.func,
  onPressDetail: PropTypes.func,
  onPressOverview: PropTypes.func,
};

export default React.memo(ProjectItem);
