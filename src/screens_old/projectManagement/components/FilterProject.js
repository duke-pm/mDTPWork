/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter of project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, TouchableOpacity, View, StatusBar} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CActionSheet from '~/components/CActionSheet';
import CAvatar from '~/components/CAvatar';
import CIcon from '~/components/CIcon';
import CIconHeader from '~/components/CIconHeader';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID, IS_IOS, sH} from '~/utils/helper';

/** All ref */
const asYearRef = createRef();

const RowPicker = React.memo(
  ({
    loading = false,
    isDark = false,
    customColors = {},
    label = '',
    active = '',
    onPress = () => null,
  }) => {
    return (
      <TouchableOpacity key={label} onPress={onPress}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            styles.row_header,
            isDark && cStyles.borderTopDark,
            isDark && cStyles.borderBottomDark,
            !isDark && cStyles.borderTop,
            !isDark && cStyles.borderBottom,
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
              cStyles.pr24,
            ]}>
            <CText label={label} />
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              {loading ? (
                <CActivityIndicator />
              ) : (
                <CText styles={'pr6'} label={active} />
              )}
              <CIcon
                name={Icons.next}
                size={'small'}
                customColor={colors.GRAY_500}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const RowSelect = React.memo(
  ({
    isDark = false,
    customColors = {},
    value = '',
    label = '',
    active = '',
    user = false,
    first = false,
    last = false,
    onPress = () => null,
  }) => {
    const handleChange = () => onPress(value);
    return (
      <TouchableOpacity key={value + label} onPress={handleChange}>
        <View
          style={[
            cStyles.flex1,
            cStyles.fullWidth,
            cStyles.row,
            cStyles.itemsCenter,
            styles.row_header,
            {backgroundColor: customColors.card},
            first && isDark && cStyles.borderTopDark,
            first && !isDark && cStyles.borderTop,
            last && isDark && cStyles.borderBottomDark,
            last && !isDark && cStyles.borderBottom,
          ]}>
          {user ? (
            <View style={cStyles.px16}>
              <CAvatar size={'small'} label={label} />
            </View>
          ) : (
            <View style={styles.left_row_select} />
          )}

          <View
            style={[
              cStyles.flex1,
              cStyles.fullHeight,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.pr16,
              !last && isDark && cStyles.borderBottomDark,
              !last && !isDark && cStyles.borderBottom,
            ]}>
            <CText label={label} />
            {active && (
              <CIcon
                name={Icons.check}
                size={'small'}
                color={IS_IOS ? 'blue' : 'green'}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

function FilterProject(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const aParams = {
    hasYear: route.params?.hasYear || false,
    hasSector: route.params?.hasSector || false,
    onFilter: route.params?.onFilter || null,
    activeYear: route.params?.activeYear || null,
    activeOwner: route.params?.activeOwner || [],
    activeStatus: route.params?.activeStatus || [],
    activeSector: route.params?.activeSector || [],
  };

  /** Use redux */
  const masterState = useSelector(({masterData}) => masterData);

  /** Use state */
  const [loading, setLoading] = useState(aParams.hasYear);
  const [year, setYear] = useState({
    data: [],
    active: 0,
    choose: 0,
  });
  const [owner, setOwner] = useState({
    data: masterState.get('users'),
    active: aParams.activeOwner,
  });
  const [status, setStatus] = useState({
    data: masterState.get('projectStatus'),
    active: aParams.activeStatus,
  });
  const [sectors, setSectors] = useState({
    data: masterState.get('projectSector'),
    active: aParams.activeSector,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReset = () => navigation.goBack();

  const handlePickerYear = () => asYearRef.current?.show();

  const handleChangeYear = () => setYear({...year, choose: year.active});

  const handleFilter = () => {
    aParams.onFilter(
      aParams.hasYear ? Number(year.data[year.choose]?.value) : null,
      owner.active,
      status.active,
      aParams.hasSector ? sectors.active : null,
    );
    navigation.goBack();
  };

  /************
   ** FUNC **
   ************/
  const onChangeYear = index => setYear({...year, active: index});

  const onGetListYear = back => {
    let tmp = new Date().getFullYear() + 2;
    tmp = Array.from({length: back}, (v, i) => tmp - back + i + 1);
    return tmp.map(item => {
      return {value: item + '', label: item + ''};
    });
  };

  const onChangeOwner = value => {
    let newOwner = [...owner.active];
    let find = newOwner.indexOf(value);
    if (find !== -1) {
      newOwner.splice(find, 1);
    } else {
      newOwner.push(value);
    }
    return setOwner({...owner, active: newOwner});
  };

  const onChangeStatus = value => {
    let newStatus = [...status.active];
    let find = newStatus.indexOf(value);
    if (find !== -1) {
      newStatus.splice(find, 1);
    } else {
      newStatus.push(value);
    }
    return setStatus({...status, active: newStatus});
  };

  const onChangeSector = value => {
    let newSector = [...sectors.active];
    let find = newSector.indexOf(value);
    if (find !== -1) {
      newSector.splice(find, 1);
    } else {
      newSector.push(value);
    }
    return setSectors({...sectors, active: newSector});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (IS_IOS) {
      if (!isDark) {
        StatusBar.setBarStyle('light-content', true);
      }
    }
    if (aParams.hasYear && year.data.length === 0) {
      let years = onGetListYear(Configs.numberYearToFilter);
      let find = years.findIndex(
        f => f.value === JSON.stringify(aParams.activeYear),
      );
      setYear({
        data: years,
        active: find,
        choose: find,
      });
    }
  }, []);

  useEffect(() => {
    if (aParams.hasYear && loading) {
      if (year.data.length > 0) {
        setLoading(false);
      }
    }
  }, [aParams.hasYear, loading, year.data]);

  useLayoutEffect(() => {
    return () => {
      if (IS_IOS) {
        if (!isDark) {
          StatusBar.setBarStyle('dark-content', true);
        }
      }
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions(
      Object.assign(
        {
          headerLeft: () => (
            <CIconHeader
              icons={[
                {
                  show: true,
                  showRedDot: false,
                  icon: Icons.close,
                  iconColor: customColors.red,
                  onPress: handleReset,
                },
              ]}
            />
          ),
          headerRight: () => (
            <CIconHeader
              icons={[
                {
                  show: true,
                  showRedDot: false,
                  icon: Icons.doubleCheck,
                  iconColor: customColors.blue,
                  onPress: handleFilter,
                },
              ]}
            />
          ),
        },
        IS_ANDROID
          ? {
              headerCenter: () => (
                <CText
                  customStyles={[cStyles.colorWhite, cStyles.textHeadline]}
                  label={'common:filter'}
                />
              ),
            }
          : {},
      ),
    );
  }, [navigation, year, owner, status, sectors]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      safeAreaStyle={{backgroundColor: customColors.cardHolder}}
      style={{backgroundColor: customColors.cardHolder}}
      content={
        <CContent contentStyle={cStyles.pb24}>
          {/** Year */}
          {aParams.hasYear && (
            <>
              <CGroupLabel />
              <RowPicker
                loading={loading}
                isDark={isDark}
                customColors={customColors}
                label={t('project_management:year')}
                active={year.data[year.choose]?.label}
                onPress={handlePickerYear}
              />
            </>
          )}

          {/** Owners */}
          <CGroupLabel
            labelLeft={t('project_management:title_owner')}
            labelRight={`${t('project_management:holder_choose_multi')} (${
              owner.active.length
            })`}
          />
          <View style={[cStyles.px0, cStyles.pb0]}>
            {owner.data.map((item, index) => {
              let isActive = owner.active.indexOf(item.empID);
              return (
                <RowSelect
                  user
                  first={index === 0}
                  last={index === owner.data.length - 1}
                  isDark={isDark}
                  customColors={customColors}
                  value={item.empID}
                  label={item.empName}
                  active={isActive !== -1}
                  onPress={onChangeOwner}
                />
              );
            })}
          </View>

          {/** Status */}
          <CGroupLabel
            labelLeft={t('status:title')}
            labelRight={`${t('project_management:holder_choose_multi')} (${
              status.active.length
            })`}
          />
          <View style={[cStyles.px0, cStyles.pb0]}>
            {status.data.map((item, index) => {
              let isActive = status.active.indexOf(item.statusID);
              return (
                <RowSelect
                  user={false}
                  first={index === 0}
                  last={index === status.data.length - 1}
                  isDark={isDark}
                  customColors={customColors}
                  value={item.statusID}
                  label={item.statusName}
                  active={isActive !== -1}
                  onPress={onChangeStatus}
                />
              );
            })}
          </View>

          {/** Sector */}
          {aParams.hasSector && (
            <>
              <CGroupLabel
                labelLeft={t('project_management:holder_sector')}
                labelRight={`${t('project_management:holder_choose_multi')} (${
                  sectors.active.length
                })`}
              />
              <View style={[cStyles.px0, cStyles.pb0]}>
                {sectors.data.map((item, index) => {
                  let isActive = sectors.active.indexOf(item.sectorID);
                  return (
                    <RowSelect
                      user={false}
                      first={index === 0}
                      last={index === sectors.data.length - 1}
                      isDark={isDark}
                      customColors={customColors}
                      value={item.sectorID}
                      label={item.sectorName}
                      active={isActive !== -1}
                      onPress={onChangeSector}
                    />
                  );
                })}
              </View>
            </>
          )}
          {!loading && aParams.hasYear && (
            <CActionSheet
              actionRef={asYearRef}
              headerChoose
              onConfirm={handleChangeYear}>
              <Picker
                style={styles.con_action}
                itemStyle={{
                  fontSize: moderateScale(21),
                  color: customColors.text,
                }}
                selectedValue={year.active}
                onValueChange={onChangeYear}>
                {year.data.map((value, i) => (
                  <Picker.Item
                    key={value.value}
                    label={value.label}
                    value={i}
                  />
                ))}
              </Picker>
            </CActionSheet>
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  row_header: {height: moderateScale(50)},
  left_row_select: {width: moderateScale(16)},
  con_action: {width: '100%', height: sH('30%')},
});

export default FilterProject;
