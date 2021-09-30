/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter of project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Calendar} from 'react-native-calendars';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CGroupLabel from '~/components/CGroupLabel';
import CAvatar from '~/components/CAvatar';
import CIconHeader from '~/components/CIconHeader';
import CActivityIndicator from '~/components/CActivityIndicator';
import CAlert from '~/components/CAlert';
import CButton from '~/components/CButton';
import CIcon from '~/components/CIcon';
/* COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {
  moderateScale,
  IS_ANDROID,
  IS_IOS,
  alert,
  verticalScale,
} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
let keyboardOpen = null,
  keyboardHide = null;
const INPUT_NAME = {FROM_DATE: 'fromDate', TO_DATE: 'toDate'};
const THEME_CALENDAR = {
  textDayFontSize: cStyles.textCallout.fontSize,
  textMonthFontSize: cStyles.textCallout.fontSize,
  textDayHeaderFontSize: cStyles.textCallout.fontSize,
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: 'bold',
  arrowColor: colors.ORANGE,
  selectedDotColor: colors.WHITE,
  selectedDayBackgroundColor: colors.BLUE,
  selectedDayTextColor: colors.WHITE,
  todayTextColor: colors.BLUE,
  'stylesheet.calendar.header': {
    dayTextAtIndex6: {
      color: colors.RED,
    },
  },
  // arrows
  arrowStyle: {padding: 0},
  // day names
  textSectionTitleColor: colors.GRAY_600,
  textDayFontWeight: cStyles.textBody.fontWeight,
  textDayStyle: {marginTop: IS_ANDROID ? moderateScale(2) : moderateScale(7)},
  // disabled date
  textDisabledColor: 'grey',
  // dot (marked date)
  dotColor: colors.PRIMARY,
  disabledDotColor: 'grey',
  dotStyle: {marginTop: -moderateScale(2)},
};

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
      <TouchableOpacity key={label} onPress={() => onPress(true)}>
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

const RowInputDate = React.memo(
  ({
    keyInput = '',
    isDark = false,
    customColors = {},
    label = '',
    value = '',
    onChangeDate = () => null,
  }) => {
    const handleChange = () => onChangeDate(keyInput);
    return (
      <TouchableOpacity onPress={handleChange}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            styles.row_header,
            isDark && cStyles.borderBottomDark,
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
            <CText customLabel={value} />
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
    user,
    first,
    last,
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
            first && isDark && cStyles.borderTopDark,
            first && !isDark && cStyles.borderTop,
            last && isDark && cStyles.borderBottomDark,
            last && !isDark && cStyles.borderBottom,
            {backgroundColor: customColors.card},
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
                color={IS_IOS ? 'blue' : 'green'}
                size={'small'}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

function FilterOverview(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;

  const aParams = {
    onFilter: route.params?.onFilter || null,
    activeYear: route.params?.activeYear || null,
    activeOwner: route.params?.activeOwner || [],
    activeStatus: route.params?.activeStatus || [],
    activeSector: route.params?.activeSector || [],
  };
  /** Use redux */
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const selectedDate = {
    selected: true,
    selectedColor: IS_IOS ? customColors.blue : customColors.green,
  };

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [year, setYear] = useState({
    status: false,
    data: [],
    active: 0,
  });
  const [dateFilter, setDateFilter] = useState({
    active: null,
    from: Configs.toDay.startOf('year').format(formatDate),
    to: Configs.toDay.endOf('year').format(formatDate),
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

  const handlePickerYear = show => {
    if (keyboardShow) Keyboard.dismiss();
    else setYear({...year, status: show});
  };

  const handleChangeYear = () => {
    setYear({...year, status: false});
    setDateFilter({
      from: moment(Number(year.data[year.active]?.value), 'yyyy')
        .startOf('year')
        .format(formatDate),
      to: moment(Number(year.data[year.active]?.value), 'yyyy')
        .endOf('year')
        .format(formatDate),
    });
    handlePickerYear(false);
  };

  const handleFilter = () => {
    if (
      (dateFilter.from !== '' && dateFilter.to === '') ||
      (dateFilter.from === '' && dateFilter.to !== '')
    ) {
      alert(t, 'project_overview:error_date_empty', () => null);
    } else {
      aParams.onFilter(
        Number(year.data[year.active]?.value),
        dateFilter.from !== ''
          ? moment(dateFilter.from, 'YYYY-MM-DD').format('MM/DD')
          : '',
        dateFilter.to !== ''
          ? moment(dateFilter.to, 'YYYY-MM-DD').format('MM/DD')
          : '',
        owner.active,
        status.active,
        sectors.active,
      );
      navigation.goBack();
    }
  };

  /************
   ** FUNC **
   ************/
  const onKeyboardOpen = () => setKeyboardShow(true);

  const onKeyboardHide = () => setKeyboardShow(false);

  const onChangeDate = type => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (dateFilter.active) {
      return setDateFilter({...dateFilter, active: null});
    }
    setDateFilter({...dateFilter, active: type});
  };

  const onChangeFromDate = day => {
    setDateFilter({...dateFilter, from: day.dateString});
  };

  const onChangeToDate = day => {
    setDateFilter({...dateFilter, to: day.dateString});
  };

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
    keyboardOpen = Keyboard.addListener('keyboardDidShow', onKeyboardOpen);
    keyboardHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    if (IS_IOS) {
      if (!isDark) {
        StatusBar.setBarStyle('light-content', true);
      }
    }
    if (year.data.length === 0) {
      let years = onGetListYear(Configs.numberYearToFilter);
      let find = years.findIndex(
        f => f.value === JSON.stringify(aParams.activeYear),
      );
      setYear({data: years, active: find});
    }
  }, []);

  useEffect(() => {
    if (loading) {
      if (year.data.length > 0) setLoading(false);
    }
  }, [loading, year.data]);

  useLayoutEffect(() => {
    return () => {
      Keyboard.removeAllListeners(keyboardOpen);
      Keyboard.removeAllListeners(keyboardHide);
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
  }, [navigation, year, dateFilter, owner, status, sectors]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      safeAreaStyle={{backgroundColor: customColors.background}}
      style={{backgroundColor: customColors.background}}
      content={
        <KeyboardAwareScrollView contentContainerStyle={cStyles.pb24}>
          {/** Year */}
          <CGroupLabel />
          <RowPicker
            loading={loading}
            isDark={isDark}
            customColors={customColors}
            label={t('project_overview:year')}
            active={year.data[year.active]?.label}
            onPress={handlePickerYear}
          />

          {/** From date */}
          <RowInputDate
            keyInput={INPUT_NAME.FROM_DATE}
            isDark={isDark}
            customColors={customColors}
            label={t('project_overview:from_date')}
            value={moment(dateFilter.from, formatDate).format(formatDateView)}
            onChangeDate={onChangeDate}
          />
          {dateFilter.active === INPUT_NAME.FROM_DATE && (
            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyEnd]}>
              <CText
                styles={'mr16 mt10 colorOrange'}
                label={'common:close'}
                onPress={onChangeDate}
              />
              <Calendar
                style={styles.con_picker_date}
                minDate={Number(year.data[year.active]?.value) + '-01-01'}
                maxDate={Number(year.data[year.active]?.value) + '-12-31'}
                current={dateFilter.from}
                onDayPress={onChangeFromDate}
                monthFormat={'MMMM - yyyy'}
                firstDay={1}
                disableAllTouchEventsForDisabledDays
                enableSwipeMonths
                theme={THEME_CALENDAR}
                markedDates={{[dateFilter.from]: selectedDate}}
              />
            </View>
          )}

          {/** To date */}
          <RowInputDate
            keyInput={INPUT_NAME.TO_DATE}
            isDark={isDark}
            customColors={customColors}
            label={t('project_overview:to_date')}
            value={moment(dateFilter.to, formatDate).format(formatDateView)}
            onChangeDate={onChangeDate}
          />
          {dateFilter.active === INPUT_NAME.TO_DATE && (
            <View style={[cStyles.row, cStyles.itemsStart, cStyles.justifyEnd]}>
              <CText
                styles={'mr16 mt10 colorOrange'}
                label={'common:close'}
                onPress={onChangeDate}
              />
              <Calendar
                style={styles.con_picker_date}
                minDate={dateFilter.from}
                maxDate={Number(year.data[year.active]?.value) + '-12-31'}
                current={dateFilter.to}
                onDayPress={onChangeToDate}
                monthFormat={'MMMM - yyyy'}
                firstDay={1}
                disableAllTouchEventsForDisabledDays
                enableSwipeMonths
                theme={THEME_CALENDAR}
                markedDates={{[dateFilter.to]: selectedDate}}
              />
            </View>
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
                  isDark={isDark}
                  customColors={customColors}
                  user
                  value={item.empID}
                  label={item.empName}
                  active={isActive !== -1}
                  first={index === 0}
                  last={index === owner.data.length - 1}
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
                  isDark={isDark}
                  customColors={customColors}
                  user={false}
                  value={item.statusID}
                  label={item.statusName}
                  active={isActive !== -1}
                  first={index === 0}
                  last={index === status.data.length - 1}
                  onPress={onChangeStatus}
                />
              );
            })}
          </View>

          {/** Sector */}
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
                  isDark={isDark}
                  customColors={customColors}
                  user={false}
                  value={item.sectorID}
                  label={item.sectorName}
                  active={isActive !== -1}
                  first={index === 0}
                  last={index === sectors.data.length - 1}
                  onPress={onChangeSector}
                />
              );
            })}
          </View>

          <CAlert
            show={year.status}
            title={t('project_overview:choose_year')}
            customContent={
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyAround,
                ]}>
                <Picker
                  style={styles.con_picker_year}
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

                <View style={cStyles.px10}>
                  <CButton
                    style={styles.button}
                    block
                    color={customColors.green}
                    icon={Icons.check}
                    label={'common:ok'}
                    onPress={handleChangeYear}
                  />
                </View>
              </View>
            }
          />
        </KeyboardAwareScrollView>
      }
    />
  );
}

const styles = StyleSheet.create({
  row_header: {height: moderateScale(50)},
  left_row_select: {width: moderateScale(16)},
  button: {width: moderateScale(100)},
  con_picker_year: {width: '50%', height: '70%'},
  con_picker_date: {
    marginVertical: moderateScale(10),
    marginRight: moderateScale(16),
    width: verticalScale(200),
    borderRadius: moderateScale(10),
  },
});

export default FilterOverview;
