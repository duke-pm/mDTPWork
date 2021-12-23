/**
 ** Name: Project Details
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectDetails.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Button, Divider} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_4, DEFAULT_FORMAT_DATE_9} from '~/configs/constants';
import {checkEmpty, moderateScale} from '~/utils/helper';
import {Assets} from '~/utils/asset';
import Commons from '~/utils/common/Commons';

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
        <View style={[cStyles.row, cStyles.itemsStart, {flex: 0.5}]}>
          <View style={{flex: 0.4}}>
            <CText category="s1">{trans('project_management:is_public')}</CText>
          </View>
          <View style={{flex: 0.6}}>
            <IoniIcon
              name={project.isPublic ? "checkmark-circle-outline" : "close-circle-outline"}
              color={project.isPublic ? theme['color-success-500'] : theme['color-danger-500']}
              size={moderateScale(16)}
            />
          </View>
        </View>
        <View style={[cStyles.row, cStyles.itemsStart, {flex: 0.5}]}>
          <Button
            appearance="outline"
            size="tiny"
            status={Commons.STATUS_TASK[project.statusID]['color']}>
            {project.statusName}
          </Button>
        </View>
      </View>

      {/** Date start - end */}
      <View style={[cStyles.row, cStyles.center, cStyles.mt10]}>
        <View style={[cStyles.row, cStyles.itemsStart, {flex: 0.5}]}>
          <View style={{flex: 0.4}}>
            <CText category="s1">{trans('project_management:start_date')}</CText>
          </View>
          <View style={{flex: 0.6}}>
            <CText>{project.startDate
              ? moment(project.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)
              : '-'}
            </CText>
          </View>
        </View>
        <View style={[cStyles.row, cStyles.itemsStart, {flex: 0.5}]}>
          <View style={{flex: 0.4}}>
            <CText category="s1">{trans('project_management:end_date')}</CText>
          </View>
          <View style={{flex: 0.6}}>
            <CText>{project.endDate
              ? moment(project.endDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)
              : '-'}
            </CText>
          </View>
        </View>
      </View>

      {/** Date appraisal */}
      {project.appraisalTime && (
        <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt10]}>
          <View style={{flex: 0.3}}>
            <CText category="s1">{trans('project_management:appraisal_time')}</CText>
          </View>
          <View style={{flex: 0.7}}>
            <CText>
              {moment(project.appraisalTime, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
            </CText>
          </View>
        </View>
      )}

      {/** Owner */}
      <View style={[cStyles.row, cStyles.itemsStart, cStyles.mt10]}>
        <View style={{flex: 0.3}}>
          <CText category="s1">{trans('project_management:owner')}</CText>
        </View>
        <View style={[cStyles.row, cStyles.itemsCenter, {flex: 0.7}]}>
          <Avatar size="tiny" source={Assets.iconUser} />
          <CText style={cStyles.ml10}>{project.ownerName}</CText>
        </View>
      </View>

      {/** Description */}
      <View style={[cStyles.mt10]}>
        <CText category="s1">{trans('project_management:description')}</CText>
        <CText style={cStyles.py10}>{checkEmpty(project.descr)}</CText>
      </View>

      {/** Users invited */}
      {usersInvitedLength > 0 && (
        <View style={cStyles.mt10}>
          <CText category="s1">{trans('project_management:user_invited')}</CText>
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
                    <Avatar size="tiny" source={Assets.iconUser} />
                  </View>
                  <View
                    style={[
                      cStyles.ml5,
                      cStyles.py10,
                      cStyles.flex1,
                    ]}>
                    <CText>{itemU.fullName}</CText>
                    <CText style={cStyles.mt3} category="c1" appearance="hint">
                      {itemU.email}
                    </CText>
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
});

ProjectDetails.propTypes = {
  trans: PropTypes.object,
  theme: PropTypes.object,
  project: PropTypes.object,
};

export default ProjectDetails;
