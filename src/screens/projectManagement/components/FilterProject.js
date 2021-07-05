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
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CActionSheet from '~/components/CActionSheet';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
/* COMMON */
import Configs from '~/config';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {fS, IS_ANDROID, IS_IOS, sH} from '~/utils/helper';

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
              name={'chevron-forward'}
              size={fS(18)}
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
  isAvatar,
  isBorder = true,
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
        {isAvatar ? (
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
            !isLast && isBorder && isDark && cStyles.borderBottomDark,
            !isLast && isBorder && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={label} />
          {active && (
            <Icon name={'checkmark'} color={customColors.blue} size={fS(23)} />
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

  navigation.setOptions(
    Object.assign(
      {
        headerLeft: () => (
          <TouchableOpacity onPress={handleReset}>
            <View
              style={[cStyles.flex1, cStyles.itemsEnd, cStyles.justifyCenter]}>
              <CText
                customStyles={[
                  {color: customColors.red},
                  IS_ANDROID && cStyles.colorWhite,
                ]}
                label={t('common:close')}
              />
            </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={handleFilter}>
            <View
              style={[cStyles.flex1, cStyles.itemsEnd, cStyles.justifyCenter]}>
              <CText
                customStyles={[
                  {color: customColors.blue},
                  IS_ANDROID && cStyles.colorWhite,
                ]}
                label={t('common:apply')}
              />
            </View>
          </TouchableOpacity>
        ),
      },
      IS_ANDROID
        ? {
            headerCenter: () => (
              <CText
                styles={'colorWhite fontMedium'}
                label={'project_management:filter'}
              />
            ),
          }
        : {},
    ),
  );

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
    navigation.goBack();
    aParams.onFilter(
      aParams.hasYear ? Number(year.data[year.choose]?.value) : null,
      owner.active,
      status.active,
      aParams.hasSector ? sectors.active : null,
    );
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
  }, []);

  useEffect(() => {
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
  }, [aParams.hasYear, year.data]);

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

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading}
      content={
        <CContent contentStyle={cStyles.pb24}>
          {/** Year */}
          {aParams.hasYear && (
            <>
              <CGroupLabel
                containerStyle={cStyles.mt0}
                labelLeft={t('project_management:calendar_year')}
              />
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
                true,
                index === 0,
                index === owner.data.length - 1,
              );
            }}
          />

          {/** Status */}
          <CGroupLabel
            containerStyle={cStyles.mt0}
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
                false,
                true,
                index === 0,
                index === status.data.length - 1,
              );
            }}
          />

          {/** Sector */}
          {aParams.hasSector && (
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
                    false,
                    true,
                    index === 0,
                    index === sectors.data.length - 1,
                  );
                }}
              />
            </>
          )}
          {!loading && aParams.hasYear && (
            <CActionSheet
              actionRef={actionSheetYearRef}
              headerChoose
              onConfirm={handleChangeYear}>
              <Picker
                style={styles.con_action}
                itemStyle={{color: customColors.text, fontSize: fS(20)}}
                selectedValue={year.active}
                onValueChange={onChangeYear}>
                {year.data.map((value, i) => (
                  <Picker.Item
                    label={value.label}
                    value={i}
                    key={value.value}
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
  row_header: {height: 50},
  left_row_select: {width: 16},
  con_action: {width: '100%', height: sH('30%')},
});

export default FilterProject;
