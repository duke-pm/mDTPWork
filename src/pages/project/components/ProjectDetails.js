/**
 ** Name: Project Details
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectDetails.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Divider, Text} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CStatus from '~/components/CStatus';
/* COMMON */
import {cStyles} from '~/utils/style';
import {Assets} from '~/utils/asset';
import {
  checkEmpty,
  moderateScale,
} from '~/utils/helper';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';

const sIcon = moderateScale(16);

function ProjectDetails(props) {
  const {
    trans = {},
    theme = {},
    project = null,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!project) return null;
  const usersInvitedLength = (project && project.lstUserInvited.length) || 0;
  return (
    <View>
      <Divider style={cStyles.flex1} />
      {/** Is public - Status */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <View style={[cStyles.row, cStyles.itemsStart, styles.con_half]}>
          <View style={styles.con_left}>
            <Text category="label" appearance="hint">{trans('project_management:is_public')}</Text>
          </View>
          <View style={styles.con_right}>
            <IoniIcon
              name={project.isPublic ? "checkmark-circle-outline" : "close-circle-outline"}
              color={project.isPublic ? theme['color-success-500'] : theme['color-danger-500']}
              size={sIcon}
            />
          </View>
        </View>
        <View style={[cStyles.row, cStyles.itemsStart, styles.con_half]}>
          <CStatus
            type="project"
            value={project.statusID}
            label={project.statusName}
          />
        </View>
      </View>

      {/** Date start - end */}
      <View style={[cStyles.row, cStyles.center, cStyles.mt10]}>
        <View style={[cStyles.row, cStyles.itemsStart, styles.con_half]}>
          <View style={styles.con_left}>
            <Text category="label" appearance="hint">{trans('project_management:start_date')}</Text>
          </View>
          <View style={styles.con_right}>
            <Text>{project.startDate
              ? moment(project.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)
              : '-'}
            </Text>
          </View>
        </View>
        <View style={[cStyles.row, cStyles.itemsStart, styles.con_half]}>
          <View style={styles.con_left}>
            <Text category="label" appearance="hint">{trans('project_management:end_date')}</Text>
          </View>
          <View style={styles.con_right}>
            <Text>{project.endDate
              ? moment(project.endDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)
              : '-'}
            </Text>
          </View>
        </View>
      </View>

      {/** Owner */}
      <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt10]}>
        <View style={styles.con_left_2}>
          <Text category="label" appearance="hint">{trans('project_management:owner')}</Text>
        </View>
        <View style={[cStyles.row, cStyles.itemsCenter, styles.con_right_2]}>
          <Avatar size="tiny" source={Assets.iconUser} />
          <Text style={cStyles.ml10}>{project.ownerName}</Text>
        </View>
      </View>

      {/** Date appraisal */}
      {project.appraisalTime && (
        <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt10]}>
          <View style={styles.con_left_2}>
            <Text category="label" appearance="hint">{trans('project_management:appraisal_time')}</Text>
          </View>
          <View style={styles.con_right_2}>
            <Text>
              {moment(project.appraisalTime, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
            </Text>
          </View>
        </View>
      )}

      {/** Description */}
      <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt10]}>
        <View style={styles.con_left_2}>
          <Text category="label" appearance="hint">{trans('project_management:description')}</Text>
        </View>
        <View style={styles.con_right_2}>
          <Text>{checkEmpty(project.descr)}</Text>
        </View>
      </View>

      {/** Users invited */}
      {usersInvitedLength > 0 && (
        <View style={cStyles.mt10}>
          <Text category="label" appearance="hint">{trans('project_management:user_invited')}</Text>
          <ScrollView
            style={[
              cStyles.mt10,
              cStyles.rounded1,
              cStyles.borderAll,
              {
                backgroundColor: theme['background-basic-color-2'],
                borderColor: theme['border-basic-color-3'],
              },
              styles.list_invited,
            ]}>
            {project.lstUserInvited.map((itemU, indexU) => {
              return (
                <View
                  key={itemU.userName + '_' + indexU}
                  style={[cStyles.row, cStyles.itemsCenter, cStyles.ml3]}>
                  <View style={cStyles.px10}>
                    <Avatar size="small" source={Assets.iconUser} />
                  </View>
                  <View
                    style={[
                      cStyles.ml5,
                      cStyles.py10,
                      cStyles.flex1,
                    ]}>
                    <Text>{itemU.fullName}</Text>
                    <Text style={cStyles.mt3} category="c1" appearance="hint">
                      {itemU.email}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list_invited: {maxHeight: moderateScale(180)},
  con_half: {flex: 0.5},
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
  con_left_2: {flex: 0.3},
  con_right_2: {flex: 0.7},
});

ProjectDetails.propTypes = {
  trans: PropTypes.object,
  theme: PropTypes.object,
  project: PropTypes.object,
};

export default ProjectDetails;
