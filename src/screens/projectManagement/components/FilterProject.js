/**
 ** Name: Filter of project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CActionSheet from '~/components/CActionSheet';
import CLoading from '~/components/CLoading';
import CList from '~/components/CList';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';

/** All refs use in this screen */
const actionSheetYearRef = createRef();

const RowPicker = (
  loading,
  isDark,
  customColors,
  label,
  active,
  onPress,
  isBorder = true,
  isFirst,
  isLast,
) => {
  return (
    <TouchableOpacity key={label} onPress={onPress}>
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
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            {loading ? <ActivityIndicator /> : <CText label={active} />}
            <Icon
              name={'chevron-right'}
              size={scalePx(2.5)}
              color={colors.GRAY_500}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
            <Icon name={'check'} color={customColors.blue} size={scalePx(3)} />
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
    main: true,
    change: false,
  });
  const [year, setYear] = useState({
    data: [],
    active: 0,
    choose: 0,
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
    setYear({
      ...year,
      active: year.data.length - 1,
      choose: year.data.length - 1,
    });
  };

  const handleFilter = () => {
    onFilter(
      Number(year.data[year.choose]?.value),
      owner.active,
      status.active,
      sectors.active,
    );
  };

  const handlePickerYear = () => {
    actionSheetYearRef.current?.show();
  };

  const handleChangeYear = () => {
    setYear({...year, choose: year.active});
  };

  /************
   ** FUNC **
   ************/
  const onGetListYear = back => {
    let tmp = new Date().getFullYear();
    tmp = Array.from({length: back}, (v, i) => tmp - back + i + 1);
    return tmp.map(item => {
      return {value: item + '', label: item + ''};
    });
  };

  const onChangeYear = index => {
    setYear({...year, active: index});
  };

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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let years = onGetListYear(10);
    setYear({data: years, active: years.length - 1, choose: years.length - 1});
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
                style={[cStyles.itemsStart, cStyles.pl24]}
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
            contentContainerStyle={cStyles.pb40}
            keyboardShouldPersistTaps={'handled'}>
            {/** Year */}
            <CGroupLabel
              containerStyle={cStyles.mt0}
              labelLeft={t('project_management:calendar_year')}
            />
            {RowPicker(
              loading.main,
              isDark,
              customColors,
              t('project_management:year'),
              year.data[year.choose]?.label,
              handlePickerYear,
              true,
              true,
              true,
            )}

            {/** Owners */}
            <CGroupLabel
              containerStyle={cStyles.mt0}
              labelLeft={t('project_management:title_owner')}
              labelRight={t('project_management:holder_choose_multi')}
            />
            <CList
              contentStyle={[cStyles.px0, cStyles.pb0]}
              data={owner.data}
              item={({item, index}) => {
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
              }}
            />

            {/** Status */}
            <CGroupLabel
              labelLeft={t('status:title')}
              labelRight={t('project_management:holder_choose_multi')}
            />
            <CList
              contentStyle={[cStyles.px0, cStyles.pb0]}
              data={status.data}
              item={({item, index}) => {
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
              }}
            />

            {/** Sector */}
            {sector && (
              <>
                <CGroupLabel
                  labelLeft={t('project_management:holder_sector')}
                  labelRight={t('project_management:holder_choose_multi')}
                />
                <CList
                  contentStyle={[cStyles.px0, cStyles.pb0]}
                  data={sectors.data}
                  item={({item, index}) => {
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
                  }}
                />
              </>
            )}
          </ScrollView>
        </View>
        <CLoading
          customColors={customColors}
          visible={loading.main || loading.change}
        />
        {!loading.main && (
          <CActionSheet
            actionRef={actionSheetYearRef}
            headerChoose
            onConfirm={handleChangeYear}>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: scalePx(3)}}
              selectedValue={year.active}
              onValueChange={onChangeYear}>
              {year.data.map((value, i) => (
                <Picker.Item label={value.label} value={i} key={value.value} />
              ))}
            </Picker>
          </CActionSheet>
        )}
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
