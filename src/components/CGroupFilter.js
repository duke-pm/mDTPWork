/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CGroupFilter
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupFilter.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@ui-kitten/components';
import {FlatList, View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';

let isCheck = null;

function CGroupFilter(props) {
  const {t} = useTranslation();
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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = (index, data) => {
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
    }
  }, [itemsChoose]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.mt16, containerStyle]}>
      <CText category="s1" appearance="hint">{t(label)}</CText>

      <FlatList
        style={cStyles.mt6}
        contentContainerStyle={cStyles.flexWrap}
        data={values}
        renderItem={({item, index}) => {
          isCheck = valuesChoose.find(f => f.value == item.value);
          return (
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt4]}>
              <Button
                style={cStyles.mr4}
                appearance={isCheck ? 'filled' : 'outline'}
                status={primaryColor}
                size="small"
                onPress={() => handleItem(index, item)}
              >
                {t(item.label)}
              </Button>
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

CGroupFilter.propTypes = {
  containerStyle: PropTypes.object,
  label: PropTypes.string,
  items: PropTypes.array,
  itemsChoose: PropTypes.array,
  primaryColor: PropTypes.string,
  onChange: PropTypes.func,
};

export default CGroupFilter;
