/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter of project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CLoading from '~/components/CLoading';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';

const RowSelect = (
  isDark,
  customColors,
  value,
  label,
  active,
  onPress,
  isBorder = true,
  isFirst,
  isLast,
) => {
  const handleChange = () => onPress(value);

  return (
    <TouchableOpacity key={value + label} onPress={handleChange}>
      <View
        style={[
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
            cStyles.fullHeight,
            cStyles.fullWidth,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.pr32,
            !isLast && isBorder && isDark && cStyles.borderBottomDark,
            !isLast && isBorder && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={label} />
          {active && (
            <Icon
              name={'check'}
              color={customColors.primary}
              size={scalePx(3)}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function FilterProject(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {visible = false, data, onFilter = () => {}} = props;

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    change: false,
  });
  const [owner, setOwner] = useState({
    data: [],
    active: [],
  });
  const [status, setStatus] = useState({
    data: [],
    active: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReset = () => {
    setStatus({...status, active: []});
    setOwner({...owner, active: []});
  };

  const handleFilter = () => {
    onFilter(owner.active, status.active);
  };

  /************
   ** FUNC **
   ************/
  const onChangeOwner = value => {
    setLoading({...loading, change: true});
    let newOwner = [...owner.active];
    if (newOwner.length > 0) {
      let find = newOwner.indexOf(value);
      if (find !== -1) {
        newOwner.splice(find, 1);
      } else {
        newOwner.push(value);
      }
    } else {
      newOwner.push(value);
    }
    setOwner({...owner, active: newOwner});
    setLoading({...loading, change: false});
  };

  const onChangeStatus = value => {
    setLoading({...loading, change: true});
    let newStatus = [...status.active];
    if (newStatus.length > 0) {
      let find = newStatus.indexOf(value);
      if (find !== -1) {
        newStatus.splice(find, 1);
      } else {
        newStatus.push(value);
      }
    } else {
      newStatus.push(value);
    }
    setStatus({...status, active: newStatus});
    setLoading({...loading, change: false});
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    setOwner({data: data.owners, active: []});
    setStatus({data: data.listStatus, active: []});
    setLoading({...loading, main: false});
  }, []);

  /**************
   ** RENDER **
   **************/
  return (
    <Modal
      style={cStyles.m0}
      isVisible={visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
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
          {!loading.main && (
            <ScrollView
              style={cStyles.flex1}
              keyboardShouldPersistTaps={'handled'}>
              <CGroupLabel label={t('project_management:title_owner')} />
              {owner.data.map((item, index) => {
                let isActive = owner.active.indexOf(item.empID);
                return RowSelect(
                  isDark,
                  customColors,
                  item.empID,
                  item.empName,
                  isActive !== -1,
                  onChangeOwner,
                  true,
                  index === 0,
                  index === owner.data.length - 1,
                );
              })}

              <CGroupLabel label={t('status:title')} />
              {status.data.map((item, index) => {
                let isActive = status.active.indexOf(item.statusID);
                return RowSelect(
                  isDark,
                  customColors,
                  item.statusID,
                  item.statusName,
                  isActive !== -1,
                  onChangeStatus,
                  true,
                  index === 0,
                  index === status.data.length - 1,
                );
              })}
            </ScrollView>
          )}
        </View>
        <CLoading
          customColors={customColors}
          visible={loading.main || loading.change}
        />
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
  row_header: {height: 50},
  left_row_select: {width: 16},
});

export default FilterProject;
