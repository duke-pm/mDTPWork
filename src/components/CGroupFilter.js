/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CGroupFilter
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupFilter.js
 **/
import PropTypes from 'prop-types';
import React, {createRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {THEME_DARK} from '~/config/constants';
import {StyleSheet, FlatList, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
/* COMPONENTS */
import CText from './CText';
import CLabel from './CLabel';
import CIcon from './CIcon';
import CTouchable from './CTouchable';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

let isCheck = null;

function CGroupFilter(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    containerStyle = {},
    label = '',
    items = [],
    itemsChoose = [],
    primaryColor = undefined,
    onChange = () => {},
  } = props;

  /** Use state */
  const [values] = useState(items);
  const [valuesChoose, setValuesChoose] = useState(items);
  const [valuesRef, setValuesRef] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (itemsChoose.length > 0) {
      let chooses = [],
        choosesRef = [],
        i = null,
        find = null;
      for (i of itemsChoose) {
        find = values.findIndex(f => f.value == i);
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
      setValuesRef(choosesRef);
      setValuesChoose(chooses);
    }
  }, [itemsChoose]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.pt8, containerStyle]}>
      <View style={cStyles.pt10}>
        <CLabel bold label={t(label)} />
      </View>

      <FlatList
        style={cStyles.mt10}
        contentContainerStyle={cStyles.row}
        data={values}
        renderItem={({item, index}) => {
          isCheck = valuesChoose.find(f => f.value == item.value);
          return (
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <CTouchable
                onPress={() => handleItem(index, item)}
                containerStyle={cStyles.rounded5}
                style={cStyles.rounded5}>
                <Animatable.View
                  ref={ref => (valuesRef[index] = ref)}
                  useNativeDriver={true}>
                  <View
                    style={[
                      cStyles.py6,
                      cStyles.px10,
                      cStyles.rounded5,
                      cStyles.borderAll,
                      isDark && cStyles.borderAllDark,
                      isDark && isCheck && {borderColor: primaryColor},
                      cStyles.row,
                      cStyles.itemsCenter,
                      {
                        backgroundColor: isCheck
                          ? primaryColor
                          : colors.TRANSPARENT,
                      },
                      isDark && {backgroundColor: colors.TRANSPARENT},
                    ]}>
                    <CText
                      styles={'textCaption1 fontMedium pr4'}
                      customStyles={[
                        cStyles.textCaption1,
                        cStyles.fontMedium,
                        cStyles.pr4,
                        isDark && isCheck && {color: primaryColor},
                      ]}
                      label={item.label}
                    />
                    <CIcon
                      name={isCheck ? Icons.check : Icons.noneCheck}
                      size={'smaller'}
                      customColor={isDark && isCheck ? primaryColor : undefined}
                    />
                  </View>
                </Animatable.View>
              </CTouchable>
              <View style={cStyles.mx5} />
            </View>
          );
        }}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={cStyles.pr10} />}
        removeClippedSubviews={IS_ANDROID}
        scrollEnabled={false}
      />
    </View>
  );
}

// const styles = StyleSheet.create({
//   active_dark: {borderColor: }
// });

CGroupFilter.propTypes = {
  containerStyle: PropTypes.object,
  label: PropTypes.string,
  items: PropTypes.array,
  itemsChoose: PropTypes.array,
  primaryColor: PropTypes.string,
  onChange: PropTypes.func,
};

export default CGroupFilter;
