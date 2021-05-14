/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CGroupFilter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CGroupFilter.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, FlatList, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {IS_ANDROID, scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function CGroupFilter(props) {
  const {t} = useTranslation();
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

  const [values] = useState(items);
  const [valuesChoose, setValuesChoose] = useState(activeAll ? items : []);

  /** HANDLE FUNC */
  const handleItem = data => {
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
    let chooses = [];
    for (let i of itemsChoose) {
      let find = values.findIndex(f => f.value == i);
      if (find !== -1) {
        if (typeof i === 'boolean') {
          if (i === true) {
            chooses.push(values[find]);
          }
        } else {
          chooses.push(values[find]);
        }
      } else if (typeof i === 'boolean') {
        if (i === true) {
          let tmp = values[0];
          tmp.value = true;
          chooses.push(tmp);
        }
      }
    }
    setValuesChoose(chooses);
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
        <CText styles={'fontMedium'} label={t(label)} />
      </View>

      <View style={[cStyles.row, cStyles.itemsCenter, styles.con_right]}>
        <FlatList
          contentContainerStyle={[cStyles.row, cStyles.flexWrap]}
          data={values}
          renderItem={({item, index}) => {
            let isCheck = valuesChoose.find(f => f.value == item.value);

            return (
              <TouchableOpacity onPress={() => handleItem(item)}>
                <View
                  style={[
                    cStyles.rounded1,
                    cStyles.ml6,
                    cStyles.mt6,
                    !isCheck && styles.con_unactive,
                    isCheck && styles.con_active,
                  ]}>
                  {isCheck && (
                    <View style={styles.con_icon}>
                      <Icon
                        name={'check'}
                        size={scalePx(1.5)}
                        color={colors.WHITE}
                      />
                    </View>
                  )}
                  <View
                    style={[
                      cStyles.rounded1,
                      cStyles.py4,
                      cStyles.px16,
                      !isCheck && styles.unactive,
                      isCheck && styles.active,
                    ]}>
                    <CText
                      styles={'textMeta fontMedium colorPrimary'}
                      label={item.label}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={IS_ANDROID}
          scrollEnabled={false}
          horizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  con_active: {
    backgroundColor: colors.SECONDARY,
  },
  con_unactive: {
    backgroundColor: colors.WHITE,
  },
  active: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.SECONDARY,
    borderTopLeftRadius: 40,
  },
  unactive: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
  },
  con_left: {
    flex: 0.27,
  },
  con_right: {
    flex: 0.73,
  },
  con_icon: {position: 'absolute', top: 0, left: 0},
});

export default CGroupFilter;
