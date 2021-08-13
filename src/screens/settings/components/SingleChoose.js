/**
 ** Name: Single Choose setting
 ** Author: DTP Education
 ** CreateAt: 2021
 ** Description: Description of SingleChoose.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CGroupLabel from '~/components/CGroupLabel';
import CList from '~/components/CList';
/* COMMON */
import {DARK_MODE, THEME_DARK} from '~/config/constants';
import {saveLocalInfo, getLocalInfo, sH} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import Icons from '~/config/Icons';

const RowSelect = (
  isDark,
  customColors,
  data,
  active,
  onPress,
  isFirst,
  isLast,
  isBorder = true,
) => {
  const handleChange = () => onPress(data.value);
  return (
    <TouchableOpacity key={data.value + data.label} onPress={handleChange}>
      <View
        style={[
          cStyles.flex1,
          cStyles.fullWidth,
          cStyles.row,
          cStyles.itemsCenter,
          styles.row_header,
          isFirst && isDark && cStyles.borderTopDark,
          isFirst && !isDark && cStyles.borderTop,
          isLast && isDark && cStyles.borderBottomDark,
          isLast && !isDark && cStyles.borderBottom,
          {backgroundColor: customColors.card},
        ]}>
        <View style={styles.left_row_select} />

        <View
          style={[
            cStyles.flex1,
            cStyles.fullHeight,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.pr16,
            !isLast && isBorder && isDark && cStyles.borderBottomDark,
            !isLast && isBorder && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={data.label} />
          {active && (
            <CIcon name={Icons.check} color={'blue'} size={'medium'} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function SingleChoose(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route} = props;
  const data = route.params.data || [];
  const isChooseDarkMode = route.params.isChooseDarkMode || false;

  const [loading, setLoading] = useState(true);
  const [activeValue, setActiveValue] = useState(null);

  const onChange = async newValue => {
    if (newValue !== activeValue) {
      setLoading(true);
      setActiveValue(newValue);
      await saveLocalInfo({key: DARK_MODE, value: newValue});
      setLoading(false);
    }
  };

  const onPrepareData = async () => {
    if (isChooseDarkMode) {
      let languageLocal = await getLocalInfo(DARK_MODE);
      if (languageLocal) {
        setActiveValue(languageLocal.value);
      } else {
        setActiveValue(data[0].value);
        await saveLocalInfo({key: DARK_MODE, value: data[0].value});
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    onPrepareData();
  }, []);

  return (
    <CContainer
      loading={loading}
      content={
        <CContent contentStyle={cStyles.pb24}>
          <CGroupLabel
            containerStyle={cStyles.mt0}
            labelRight={t('project_management:holder_choose_multi')}
          />
          <CList
            contentStyle={[cStyles.px0, cStyles.pb0]}
            data={data}
            item={({item, index}) => {
              return RowSelect(
                loading,
                isDark,
                customColors,
                item,
                activeValue === item.value,
                onChange,
                index === 0,
                index === data.length - 1,
              );
            }}
          />
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  row_header: {height: 50},
  left_row_select: {width: 16},
  con_action: {width: '100%', height: sH('30%')},
});

export default SingleChoose;
