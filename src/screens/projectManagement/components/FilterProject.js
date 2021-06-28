/* eslint-disable react-hooks/exhaustive-deps */
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
import {isIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Switch,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CActionSheet from '~/components/CActionSheet';
import CList from '~/components/CList';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, scalePx, sH} from '~/utils/helper';
import CAvatar from '~/components/CAvatar';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
            <Icon name={'check'} color={customColors.blue} size={scalePx(3)} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const RowToggle = (
  isDark,
  customColors,
  value,
  label,
  onPress,
  isBorder = true,
  isFirst,
  isLast,
) => {
  return (
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
        <CText label={label} />
        <Switch
          value={value}
          onValueChange={onPress}
        />
      </View>
    </View>
  );
};

function FilterProject(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const hasYear = route.params?.hasYear || false;
  const hasSector = route.params?.hasSector || false;
  const onFilter = route.params?.onFilter || null;
  const activeOwner = route.params?.activeOwner || [];
  const activeStatus = route.params?.activeStatus || [];
  const activeSector = route.params?.activeSector || [];

  /** Use redux */
  const masterState = useSelector(({masterData}) => masterData);

  /** Use state */
  const [loading, setLoading] = useState({
    main: hasYear,
  });
  const [year, setYear] = useState({
    data: [],
    active: 0,
    choose: 0,
  });
  const [owner, setOwner] = useState({
    data: masterState.get('users'),
    active: activeOwner,
  });
  const [status, setStatus] = useState({
    data: masterState.get('projectStatus'),
    active: activeStatus,
  });
  const [sectors, setSectors] = useState({
    data: masterState.get('projectSector'),
    active: activeSector,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleReset = () => {
    if (owner.active.length !== 0 || status.active.length !== 0) {
      setOwner({...owner, active: []});
      setStatus({...status, active: []});
      hasSector && setSectors({...sectors, active: []});
      hasYear &&
        setYear({
          ...year,
          active: year.data.length - 1,
          choose: year.data.length - 1,
        });
    }
  };

  const handlePickerYear = () => {
    actionSheetYearRef.current?.show();
  };

  const handleChangeYear = () => {
    setYear({...year, choose: year.active});
  };

  const handleFilter = () => {
    navigation.goBack();
    onFilter(
      hasYear ? Number(year.data[year.choose]?.value) : null,
      owner.active,
      status.active,
      hasSector ? sectors.active : null,
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
    if (hasYear) {
      let years = onGetListYear(10);
      setYear({
        data: years,
        active: years.length - 1,
        choose: years.length - 1,
      });
    }
  }, [hasYear]);

  useEffect(() => {
    if (hasYear && loading.main) {
      if (year.data.length > 0) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setLoading({...loading, main: false});
      }
    }
  }, [hasYear, loading.main, year.data]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main}
      title={'project_management:filter'}
      header
      headerLeft={
        <TouchableOpacity
          style={[cStyles.itemsStart, cStyles.pl10]}
          onPress={handleReset}>
          <CText styles={'colorWhite textMeta'} label={'common:reset'} />
        </TouchableOpacity>
      }
      headerRight={
        <TouchableOpacity
          style={[cStyles.itemsEnd, cStyles.pr10]}
          onPress={handleFilter}>
          <CText styles={'colorWhite textMeta'} label={t('common:apply')} />
        </TouchableOpacity>
      }
      content={
        <CContent scroll contentStyle={isIphoneX() ? cStyles.pb40 : {}}>
          {/** Year */}
          {hasYear && (
            <>
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
          {hasSector && (
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
          {!loading.main && hasYear && (
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
