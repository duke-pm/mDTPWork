/**
 ** Name: Invited Details
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of InvitedDetails.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {Linking, View} from 'react-native';
/* COMPONENTS */
import CAvatar from '~/components/CAvatar';
import CIcon from '~/components/CIcon';
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
/* COMMON */
import {Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';

function InvitedDetails(props) {
  const {participant = null} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleEmail = () => Linking.openURL(`mailto:${participant.email}`);

  /************
   ** RENDER **
   ************/
  if (!participant) {
    return null;
  }
  return (
    <View>
      <View style={[cStyles.center, cStyles.mb10]}>
        <CAvatar size={'large'} label={participant.fullName} />
      </View>
      {/** User name */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <CIcon name={Icons.userTask} size={'medium'} />
        <CText styles={'pl12'} customLabel={participant.userName} />
      </View>

      {/** Full name */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <CIcon name={Icons.userCircleTask} size={'large'} />
        <CText styles={'pl10'} customLabel={participant.fullName} />
      </View>

      {/** Email */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <CIcon name={Icons.mailTask} size={'medium'} />
        <CTouchable containerStyle={cStyles.ml12} onPress={handleEmail}>
          <CText styles={'textUnderline'} customLabel={participant.email} />
        </CTouchable>
      </View>

      {/** Job */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <CIcon name={Icons.jobTask} size={'medium'} />
        <CText styles={'ml12'} customLabel={participant.jobTitle} />
      </View>

      {/** Department */}
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
        <CIcon name={Icons.departmentTask} size={'medium'} />
        <CText styles={'ml12'} customLabel={participant.deptName} />
      </View>
    </View>
  );
}

InvitedDetails.propTypes = {
  participant: PropTypes.object,
};

export default React.memo(InvitedDetails);
