/**
 ** Name: Project Details
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectDetails.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CIcon from '~/components/CIcon';
import CLabel from '~/components/CLabel';
import CText from '~/components/CText';
import CUser from '~/components/CUser';
import CAvatar from '~/components/CAvatar';
import CStatusTag from '~/components/CStatusTag';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {checkEmpty, moderateScale} from '~/utils/helper';

function ProjectDetails(props) {
  const {
    isDark = false,
    customColors = {},
    formatDateView = 'DD/MM/YYYY',
    project = null,
  } = props;

  /************
   ** RENDER **
   ************/
  if (!project) {
    return null;
  }
  const usersInvitedLength = (project && project.lstUserInvited.length) || 0;
  return (
    <View>
      {/** Separator */}
      <View
        style={[
          cStyles.borderTop,
          isDark && cStyles.borderTopDark,
          cStyles.fullWidth,
          cStyles.pb16,
        ]}
      />

      {/** Info basic */}
      <View style={cStyles.itemsStart}>
        {/** Is public */}
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mb10]}>
          <CLabel bold label={'project_management:is_public'} />
          <CIcon
            style={cStyles.ml3}
            name={project.isPublic ? Icons.checkCircle : Icons.alert}
            color={project.isPublic ? 'green' : 'orange'}
            size={'smaller'}
          />
        </View>

        {/** Date created */}
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <CLabel bold label={'project_management:date_created'} />
          <CText
            styles={'textCallout ml3'}
            customLabel={moment(project.crtdDate, DEFAULT_FORMAT_DATE_4).format(
              formatDateView,
            )}
          />
        </View>

        {/** Owner */}
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
          <CLabel bold label={'project_management:owner'} />
          <CUser style={cStyles.ml6} label={project.ownerName} />
        </View>

        {/** Status */}
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
          <CLabel bold label={'project_management:status'} />
          <CStatusTag
            style={cStyles.ml6}
            color={isDark ? project.colorDarkCode : project.colorCode}
            customLabel={project.statusName}
          />
        </View>
      </View>

      {/** Description */}
      <View style={cStyles.mt10}>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <CLabel bold label={'project_management:description'} />
          <CText
            styles={'textCallout'}
            customLabel={checkEmpty(project.descr)}
          />
        </View>
      </View>

      {/** Users invited */}
      {usersInvitedLength > 0 && (
        <View style={cStyles.mt10}>
          <CLabel bold label={'project_management:user_invited'} />
          <ScrollView
            style={[
              cStyles.mt10,
              cStyles.rounded2,
              {backgroundColor: customColors.textInput},
              styles.list_invited,
            ]}>
            {project.lstUserInvited.map((item, index) => {
              return (
                <View
                  key={item.userName}
                  style={[cStyles.row, cStyles.itemsCenter, cStyles.ml3]}>
                  <View style={cStyles.px10}>
                    <CAvatar label={item.fullName} size={'small'} />
                  </View>
                  <View
                    style={[
                      cStyles.ml5,
                      cStyles.py10,
                      cStyles.flex1,
                      index !== usersInvitedLength - 1 && cStyles.borderBottom,
                      index !== usersInvitedLength - 1 &&
                        isDark &&
                        cStyles.borderBottomDark,
                    ]}>
                    <CText
                      styles={'textCallout fontBold'}
                      customLabel={checkEmpty(item.fullName)}
                    />
                    <CText
                      styles={'textCaption1 mt3'}
                      customLabel={checkEmpty(item.email)}
                    />
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
  isDark: PropTypes.bool,
  customColors: PropTypes.object,
  formatDateView: PropTypes.string,
  project: PropTypes.object,
};

export default ProjectDetails;
