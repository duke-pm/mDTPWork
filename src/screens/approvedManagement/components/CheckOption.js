/**
 ** Name: Check of option
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CheckOption.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {cStyles} from '~/utils/style';

function CheckOption(props) {
  const {
    loading = false,
    isDetail = false,
    customColors = {},
    primaryColor = '',
    value = true,
    values = [],
    onCallback = () => null,
  } = props;

  /** Use state */
  const [chooseValue, setChooseValue] = useState('N');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChooseTypeAssets = (val, ref) => {
    if (val !== chooseValue) {
      ref.pulse(300);
      setChooseValue(val);
      if (onCallback) {
        onCallback(val);
      }
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (value !== chooseValue) {
      setChooseValue(value);
    }
  }, [value, chooseValue]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyStart]}>
      {values.map(item => {
        if (isDetail && chooseValue !== item.value) {
          return null;
        }
        return (
          <TouchableOpacity
            key={item.label}
            disabled={loading || isDetail}
            onPress={() => handleChooseTypeAssets(item.value, item.ref)}>
            <Animatable.View
              ref={ref => (item.ref = ref)}
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.py6,
                cStyles.pr24,
              ]}
              useNativeDriver={true}>
              <CIcon
                name={
                  chooseValue === item.value ? Icons.checkSquare : Icons.square
                }
                size={'medium'}
                customColor={
                  chooseValue === item.value ? primaryColor : customColors.icon
                }
              />
              <CText styles={'pl6'} label={item.label} />
            </Animatable.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

CheckOption.propTypes = {
  loading: PropTypes.bool,
  isDetail: PropTypes.bool,
  customColors: PropTypes.object,
  primaryColor: PropTypes.string,
  value: PropTypes.any,
  values: PropTypes.array,
  onCallback: PropTypes.func,
};

export default CheckOption;
