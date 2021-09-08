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
import {checkEmpty} from '~/utils/helper';

const RowInfo = React.memo(({icon = '', label = '', onPress = null}) => {
  return (
    <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
      <CIcon name={icon} size={'medium'} />
      <CTouchable
        disabled={!onPress}
        containerStyle={cStyles.ml12}
        onPress={onPress}>
        <CText styles={'ml12'} customLabel={label} />
      </CTouchable>
    </View>
  );
});

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
      <RowInfo icon={Icons.userCircleTask} label={participant.userName} />

      {/** Full name */}
      <RowInfo icon={Icons.userTask} label={participant.fullName} />

      {/** Email */}
      <RowInfo
        icon={Icons.mailTask}
        label={participant.email}
        onPress={handleEmail}
      />

      {/** Job */}
      <RowInfo icon={Icons.jobTask} label={checkEmpty(participant.jobTitle)} />

      {/** Department */}
      <RowInfo
        icon={Icons.departmentTask}
        label={checkEmpty(participant.deptName)}
      />
    </View>
  );
}

InvitedDetails.propTypes = {
  participant: PropTypes.object,
};

export default React.memo(InvitedDetails);
