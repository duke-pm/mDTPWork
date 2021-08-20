/**
 ** Name: Tabbar Loading
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import {cStyles} from '~/utils/style';

TabbarLoading.propTypes = {
  show: PropTypes.bool,
};

function TabbarLoading(props) {
  /**************
   ** RENDER **
   **************/
  if (!props.show) {
    return null;
  }
  return (
    <View style={[cStyles.flexCenter]}>
      <CActivityIndicator />
      <CText styles={'textCaption1 pt10 textCenter'} label={'loading'} />
    </View>
  );
}

export default React.memo(TabbarLoading);
