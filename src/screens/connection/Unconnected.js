/**
 ** Name: Unconnected screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Unconnected.js
 **/
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {View, UIManager, LayoutAnimation} from 'react-native';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CButton from '~/components/CButton';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Icons from '~/config/Icons';
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const iconLargeSize = moderateScale(80);

function Unconnected(props) {
  const {customColors} = useTheme();

  /** Use state */
  const [loading, setLoading] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const onCheckConnection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLoading(true);
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setLoading(false);
    }, 1500);
  };

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      isVisible={!props.connected}
      onBackButtonPress={() => null}
      onBackdropPress={() => null}>
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

        {loading && (
          <View style={cStyles.py16}>
            <CActivityIndicator />
          </View>
        )}

        <CButton
          style={cStyles.mt10}
          loading={loading}
          disabled={loading}
          block
          variant={'outlined'}
          label={'common:connection_again'}
          icon={Icons.reconnection}
          onPress={onCheckConnection}
        />
      </View>
    </Modal>
  );
}

export default Unconnected;
