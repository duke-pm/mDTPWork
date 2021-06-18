/**
 ** Name: Filter of project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
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
  const {sector = false, visible = false, onFilter = () => {}} = props;

  /** Use redux */
  const masterState = useSelector(({masterData}) => masterData);

  /** Use state */
  const [loading, setLoading] = useState({
    change: false,
  });
  const [owner, setOwner] = useState({
    data: masterState.get('users'),
    active: [],
  });
  const [status, setStatus] = useState({
    data: masterState.get('projectStatus'),
    active: [],
  });
  const [sectors, setSectors] = useState({
    data: masterState.get('projectSector'),
    active: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReset = () => {
    setOwner({...owner, active: []});
    setStatus({...status, active: []});
    setSectors({...sectors, active: []});
  };

  const handleFilter = () => {
    onFilter(owner.active, status.active, sectors.active);
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

  const onChangeSector = value => {
    setLoading({...loading, change: true});
    let newSector = [...sectors.active];
    if (newSector.length > 0) {
      let find = newSector.indexOf(value);
      if (find !== -1) {
        newSector.splice(find, 1);
      } else {
        newSector.push(value);
      }
    } else {
      newSector.push(value);
    }
    setSectors({...sectors, active: newSector});
    setLoading({...loading, change: false});
  };

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

            {sector && (
              <>
                <CGroupLabel label={t('project_management:holder_sector')} />
                {sectors.data.map((item, index) => {
                  let isActive = sectors.active.indexOf(item.sectorID);
                  return RowSelect(
                    isDark,
                    customColors,
                    item.sectorID,
                    item.sectorName,
                    isActive !== -1,
                    onChangeSector,
                    true,
                    index === 0,
                    index === sectors.data.length - 1,
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
        <CLoading customColors={customColors} visible={loading.change} />
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
