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
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CActionSheet from '~/components/CActionSheet';
import CAvatar from '~/components/CAvatar';
import CIconHeader from '~/components/CIconHeader';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Configs from '~/config';
import Icons from '~/config/Icons';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID, IS_IOS, sH} from '~/utils/helper';

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
            cStyles.pr24,
            !isLast && isBorder && isDark && cStyles.borderBottomDark,
            !isLast && isBorder && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={label} />
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            {loading ? (
              <CActivityIndicator />
            ) : (
              <CText styles={'pr6'} label={active} />
            )}
            <Icon
              name={Icons.next}
              size={moderateScale(18)}
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
  isUser,
  isFirst,
  isLast,
) => {
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
          isFirst && isDark && cStyles.borderTopDark,
          isFirst && !isDark && cStyles.borderTop,
          isLast && isDark && cStyles.borderBottomDark,
          isLast && !isDark && cStyles.borderBottom,
          {backgroundColor: customColors.card},
        ]}>
        {isUser ? (
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
            !isLast && isDark && cStyles.borderBottomDark,
            !isLast && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={label} />
          {active && (
            <Icon
              name={Icons.check}
              color={customColors.blue}
              size={moderateScale(18)}
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
  const handleReset = () => {
    navigation.goBack();
  };

  const handlePickerYear = () => {
    actionSheetYearRef.current?.show();
  };

  const handleChangeYear = () => {
    setYear({...year, choose: year.active});
  };

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
  const onGetListYear = back => {
    let tmp = new Date().getFullYear() + 2;
    tmp = Array.from({length: back}, (v, i) => tmp - back + i + 1);
    return tmp.map(item => {
      return {value: item + '', label: item + ''};
    });
  };

  const onChangeYear = index => {
    setYear({...year, active: index});
  };

  const onChangeOwner = value => {
    let newOwner = [...owner.active];
    let find = newOwner.indexOf(value);
    if (find !== -1) {
      newOwner.splice(find, 1);
    } else {
      newOwner.push(value);
    }
    setOwner({...owner, active: newOwner});
  };

  const onChangeStatus = value => {
    let newStatus = [...status.active];
    let find = newStatus.indexOf(value);
    if (find !== -1) {
      newStatus.splice(find, 1);
    } else {
      newStatus.push(value);
    }
    setStatus({...status, active: newStatus});
  };

  const onChangeSector = value => {
    let newSector = [...sectors.active];
    let find = newSector.indexOf(value);
    if (find !== -1) {
      newSector.splice(find, 1);
    } else {
      newSector.push(value);
    }
    setSectors({...sectors, active: newSector});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (IS_IOS) {
      if (isDark) {
        // Do nothing
      } else {
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
        if (isDark) {
          // Do nothing
        } else {
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
                  iconColor: IS_IOS ? customColors.red : colors.WHITE,
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
                  iconColor: IS_IOS ? customColors.blue : colors.WHITE,
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
                  label={'project_management:filter'}
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
      content={
        <CContent contentStyle={cStyles.pb24}>
          {/** Year */}
          {aParams.hasYear && (
            <>
              <CGroupLabel />
              {RowPicker(
                loading,
                isDark,
                customColors,
                t('project_management:year'),
                year.data[year.choose]?.label,
                handlePickerYear,
                true,
                true,
                true,
              )}
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
              return RowSelect(
                isDark,
                customColors,
                item.statusID,
                item.statusName,
                isActive !== -1,
                onChangeStatus,
                false,
                index === 0,
                index === status.data.length - 1,
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
                  return RowSelect(
                    isDark,
                    customColors,
                    item.sectorID,
                    item.sectorName,
                    isActive !== -1,
                    onChangeSector,
                    false,
                    index === 0,
                    index === sectors.data.length - 1,
                  );
                })}
              </View>
            </>
          )}
          {!loading && aParams.hasYear && (
            <CActionSheet
              actionRef={actionSheetYearRef}
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
