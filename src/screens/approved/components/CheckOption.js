/**
 ** Name: Check of option
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CheckOption.js
 **/
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {fS} from '~/utils/helper';

function CheckOption(props) {
  const {loading, isDetail, customColors, value, values, onCallback} = props;

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

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    if (value !== chooseValue) {
      setChooseValue(value);
    }
  }, [value, chooseValue]);

  /**************
   ** RENDER **
   **************/
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyStart,
        cStyles.pt10,
      ]}>
      {values.map((item, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            disabled={loading || isDetail}
            onPress={() => handleChooseTypeAssets(item.value, item.ref)}>
            <Animatable.View
              ref={ref => (item.ref = ref)}
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.py6,
                index !== 0 && cStyles.pl32,
              ]}
              useNativeDriver={true}>
              <Icon
                name={
                  chooseValue === item.value
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={fS(23)}
                color={
                  chooseValue === item.value
                    ? colors.SECONDARY
                    : customColors.text
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

export default CheckOption;
