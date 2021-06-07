/**
 ** Name: Filter of project
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {BlurView} from '@react-native-community/blur';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';
import CRowLabel from '~/components/CRowLabel';
import CLoading from '~/components/CLoading';

const RowStatus = (
  isDark,
  customColors,
  value,
  label,
  active,
  onPress,
  isBorder = true,
) => {
  const handleChange = () => onPress(value);

  return (
    <TouchableOpacity key={value} onPress={handleChange}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.pl16,
          styles.row_header,
          isBorder && isDark && cStyles.borderBottomDark,
          isBorder && !isDark && cStyles.borderBottom,
          {backgroundColor: customColors.card},
        ]}>
        <CText label={label} />
        <View style={cStyles.pr16}>
          {active && (
            <Icon name={'check'} color={customColors.icon} size={scalePx(3)} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function FilterProject(props) {
  const {
    show = false,
    data = {
      status: [],
    },
    onFilter = () => {},
  } = props;
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    data: [],
    active: [],
  });

  const handleReset = () => {};

  const handleFilter = () => {};

  const onChangeStatus = value => {
    setLoading(true);
    let newStatus = [...status.active];
    let find = newStatus.indexOf(value);
    if (find !== -1) {
      newStatus.splice(find, 1);
    } else {
      newStatus.push(value);
    }
    setStatus({...status, active: newStatus});
    setLoading(false);
  };

  useEffect(() => {
    if (data.status.lenght > 0) {
      if (status.data.length === 0) {
        setStatus({...status, data: data.status});
      }
    }
  }, [data.status, status.data]);

  return (
    <Modal
      style={cStyles.m0}
      isVisible={show}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <SafeAreaView
        style={[
          cStyles.flex1,
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}
        edges={['right', 'left', 'top']}>
        {isDark && IS_IOS && (
          <BlurView
            style={[cStyles.abs, cStyles.inset0]}
            blurType={'extraDark'}
            reducedTransparencyFallbackColor={colors.BLACK}
          />
        )}
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          {/** Header of filter */}
          <CHeader
            centerStyle={cStyles.center}
            left={
              <TouchableOpacity
                style={[cStyles.itemsStart, cStyles.pl16]}
                onPress={handleReset}>
                <CText styles={'colorWhite'} label={'common:reset'} />
              </TouchableOpacity>
            }
            right={
              <TouchableOpacity
                style={[cStyles.itemsEnd, cStyles.pr16]}
                onPress={handleFilter}>
                <CText styles={'colorWhite'} label={'common:apply'} />
              </TouchableOpacity>
            }
            title={'project_management:filter'}
          />

          {/** Content of filter */}
          <ScrollView>
            <CRowLabel label={'status:title'} />
            {data.status.map((item, index) => {
              let isActive = status.active.indexOf(item.value);
              return RowStatus(
                isDark,
                customColors,
                item.value,
                item.label,
                isActive !== -1,
                onChangeStatus,
                index !== data.status.length - 1,
              );
            })}
          </ScrollView>
        </View>
        <CLoading visible={loading} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  header_left: {flex: 0.2},
  header_body: {flex: 0.6},
  header_right: {flex: 0.2},
  row_header: {height: 50},
});

export default FilterProject;
