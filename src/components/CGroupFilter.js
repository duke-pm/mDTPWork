/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CGroupFilter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CGroupFilter.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {IS_ANDROID, scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CGroupFilter(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {
    containerStyle = {},
    activeAll = true,
    column = false,
    row = false,
    label = '',
    items = [],
    itemsChoose = [],
    onChange = () => {},
  } = props;

  /** Use state */
  const [values] = useState(items);
  const [valuesChoose, setValuesChoose] = useState(activeAll ? items : []);
  const [valuesRef, setValuesRef] = useState([]);

  /** HANDLE FUNC */
  const handleItem = (index, data) => {
    valuesRef[index].pulse(300);
    let tmpValues = [...valuesChoose];
    let fItem = tmpValues.findIndex(f => f.value == data.value);
    if (fItem !== -1) {
      tmpValues.splice(fItem, 1);
    } else {
      tmpValues.push(data);
    }
    setValuesChoose(tmpValues);
    let callback = tmpValues.map(item => item.value);
    onChange(callback);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    let chooses = [],
      choosesRef = [],
      i = null;
    for (i of itemsChoose) {
      let find = values.findIndex(f => f.value == i);
      if (find !== -1) {
        if (typeof i === 'boolean') {
          if (i === true) {
            chooses.push(values[find]);
            let handleRef = createRef();
            choosesRef.push(handleRef);
          }
        } else {
          chooses.push(values[find]);
          let handleRef = createRef();
          choosesRef.push(handleRef);
        }
      } else if (typeof i === 'boolean') {
        if (i === true) {
          let tmp = values[0];
          tmp.value = true;
          chooses.push(tmp);
          let handleRef = createRef();
          choosesRef.push(handleRef);
        }
      }
    }
    setValuesChoose(chooses);
    setValuesRef(choosesRef);
  }, []);

  /** RENDER */
  return (
    <View
      style={[
        cStyles.pt10,
        column && [cStyles.col, cStyles.justifyStart],
        row && [cStyles.row, cStyles.itemsStart],
        containerStyle,
      ]}>
      <View style={[cStyles.pt6, styles.con_left]}>
        <CText label={t(label)} />
      </View>

      <View style={[cStyles.row, cStyles.itemsCenter, styles.con_right]}>
        <FlatList
          contentContainerStyle={[cStyles.row, cStyles.flexWrap]}
          data={values}
          renderItem={({item, index}) => {
            let isCheck = valuesChoose.find(f => f.value == item.value);
            return (
              <TouchableOpacity onPress={() => handleItem(index, item)}>
                <Animatable.View
                  ref={ref => (valuesRef[index] = ref)}
                  style={[
                    cStyles.rounded1,
                    cStyles.ml6,
                    cStyles.mt6,
                    isCheck && styles.con_active,
                    !isCheck && {backgroundColor: customColors.card},
                  ]}
                  useNativeDriver={true}>
                  {isCheck && (
                    <View style={[cStyles.abs, cStyles.top0, cStyles.left0]}>
                      <Icon
                        name={'check'}
                        size={scalePx(1.9)}
                        color={colors.WHITE}
                      />
                    </View>
                  )}

                  <View
                    style={[
                      cStyles.py10,
                      cStyles.px16,
                      cStyles.rounded1,
                      cStyles.borderAll,
                      isCheck && styles.active,
                      {backgroundColor: customColors.card},
                    ]}>
                    <CText styles={'textMeta fontMedium'} label={item.label} />
                  </View>
                </Animatable.View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={IS_ANDROID}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  con_active: {backgroundColor: colors.SECONDARY},
  active: {
    borderColor: colors.SECONDARY,
    borderTopLeftRadius: 40,
  },
  con_left: {flex: 0.28},
  con_right: {flex: 0.72},
});

export default CGroupFilter;
