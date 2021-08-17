/**
 ** Name: CUser
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CUser.js
 **/
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
import CAvatar from './CAvatar';
/* COMMON */
import {cStyles} from '~/utils/style';
import {checkEmpty} from '~/utils/helper';

function CUser(props) {
  const {style = {}, textStyle = {}, avatar = null, label = ''} = props;

  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.row, cStyles.itemsCenter, style]}>
      <CAvatar size={'vsmall'} source={avatar} label={label} />
      <CText
        customStyles={[cStyles.textCaption1, cStyles.pl5, textStyle]}
        customLabel={checkEmpty(label)}
      />
    </View>
  );
}

export default CUser;
