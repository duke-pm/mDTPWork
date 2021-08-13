/**
 ** Name: Unconnected screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
/* COMMON */
import Icons from '~/config/Icons';
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

const iconLargeSize = moderateScale(80);

function Unconnected(props) {
  const {customColors} = useTheme();

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      isVisible={!props.connected}
      onBackButtonPress={() => null}
      onBackdropPress={() => {}}>
      <View
        style={[
          cStyles.center,
          cStyles.p16,
          cStyles.rounded2,
          {backgroundColor: customColors.background},
        ]}>
        <View style={cStyles.pb32}>
          <CIcon
            name={Icons.failedSad}
            color={'orange'}
            customSize={iconLargeSize}
          />
        </View>
        <CText
          customStyles={[
            cStyles.textTitle3,
            cStyles.textCenter,
            {color: customColors.text},
          ]}
          label={'error:title'}
        />
        <CText
          customStyles={[
            cStyles.textCaption1,
            cStyles.pt10,
            cStyles.textCenter,
            {color: customColors.text},
          ]}
          label={'error:lost_network'}
        />
      </View>
    </Modal>
  );
}

export default Unconnected;
