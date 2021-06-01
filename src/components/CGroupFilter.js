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
        cStyles.py10,
        row && [cStyles.row, cStyles.itemsStart],
        containerStyle,
      ]}>
      <View style={[cStyles.pt10, row && styles.con_left]}>
        <CText label={t(label)} />
      </View>

      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          !row && cStyles.py6,
          row && styles.con_right,
        ]}>
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
                    index !== 0 && cStyles.ml6,
                    cStyles.mt6,
                    !isCheck && {backgroundColor: customColors.card},
                  ]}
                  useNativeDriver={true}>
                  <View
                    style={[
                      cStyles.py6,
                      cStyles.px10,
                      cStyles.rounded7,
                      cStyles.borderAll,
                      cStyles.row,
                      cStyles.itemsCenter,
                      isCheck && styles.active,
                      {backgroundColor: customColors.card},
                    ]}>
                    <Icon
                      name={'check'}
                      size={scalePx(2)}
                      color={isCheck ? colors.SECONDARY : customColors.icon}
                    />
                    <CText
                      customStyles={[
                        cStyles.textMeta,
                        cStyles.fontMedium,
                        cStyles.pl4,
                        isCheck && cStyles.colorSecondary,
                      ]}
                      label={item.label}
                    />
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
  },
  con_left: {flex: 0.28},
  con_right: {flex: 0.72},
});

export default CGroupFilter;
