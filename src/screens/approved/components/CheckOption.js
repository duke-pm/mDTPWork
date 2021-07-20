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
import {moderateScale} from '~/utils/helper';
import Icons from '~/config/icons';

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
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyStart,
        !isDetail && cStyles.pt10,
      ]}>
      {values.map((item, index) => {
        if (isDetail && chooseValue !== item.value) {
          return null;
        }
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
                cStyles.pr24,
              ]}
              useNativeDriver={true}>
              <Icon
                name={
                  chooseValue === item.value ? Icons.checkCircle : Icons.circle
                }
                size={moderateScale(23)}
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
