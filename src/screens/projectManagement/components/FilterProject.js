/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: FilterProject
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  UIManager,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import {BlurView} from '@react-native-community/blur';
import moment from 'moment';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
import {THEME_DARK} from '~/config/constants';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};

const RowLabel = label => {
  return (
    <View
      style={[
        cStyles.px16,
        cStyles.pl16,
        cStyles.pb10,
        cStyles.justifyEnd,
        styles.row_header,
      ]}>
      <CText styles={'textMeta'} customLabel={label.toUpperCase()} />
    </View>
  );
};

const RowStatus = (
  isDark,
  customColors,
  slug,
  active,
  label,
  onPress,
  isBorder = true,
) => {
  const handleChange = () => {
    onPress(slug, !active);
  };

  return (
    <TouchableOpacity onPress={handleChange}>
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

const RowToggle = (isDark, customColors, slug, active, label, onToggle) => {
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.pl16,
        styles.row_header,
        isDark && cStyles.borderBottomDark,
        !isDark && cStyles.borderBottom,
        {backgroundColor: customColors.card},
      ]}>
      <CText label={label} />
      <Switch
        style={cStyles.mr16}
        trackColor={{false: '#767577', true: customColors.green}}
        thumbColor={'#f4f3f4'}
        onValueChange={onToggle}
        value={active}
      />
    </View>
  );
};

function FilterProject(props) {
  const {show, onFilter = () => {}} = props;
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');

  /** Use State */
  const [showPickerDate, setShowPickerDate] = useState({
    status: false,
    active: null,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    assignToMe: false,
    assignTo: [],
    statusAll: false,
    statusNew: false,
    statusInProgress: false,
    statusOnHold: false,
    statusCompleted: false,
  });

  /** Use previous */
  let prevData = usePrevious(props.data);

  /** HANDLE FUNC */
  const handleDateInput = inputName => {
    setShowPickerDate({
      active: inputName,
      status: true,
    });
  };

  const handleReset = () => {
    setData({
      fromDate: moment().clone().startOf('month').format(formatDate),
      toDate: moment().clone().endOf('month').format(formatDate),
      assignToMe: false,
      assignTo: [],
      statusAll: false,
      statusNew: false,
      statusInProgress: false,
      statusOnHold: false,
      statusCompleted: false,
    });
  };

  const handleFilter = () => {
    onFilter();
  };

  /** FUNC */
  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate({...showPickerDate, status: showPicker});
    if (newDate && showPickerDate.active) {
      setData({
        ...data,
        [showPickerDate.active]: moment(newDate).format(
          commonState.get('formatDate'),
        ),
      });
      setShowPickerDate({...showPickerDate, status: showPicker});
    }
  };

  const onToggleAssignMe = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setData({...data, assignToMe: !data.assignToMe});
  };

  const onToggleStatusAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setData({
      ...data,
      statusNew: !data.statusAll,
      statusInProgress: !data.statusAll,
      statusOnHold: !data.statusAll,
      statusCompleted: !data.statusAll,
      statusAll: !data.statusAll,
    });
  };

  const onChangeStatus = (slug, status) => {
    setData({...data, [slug]: status});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    if (prevData) {
      if (prevData.key !== props.data.key) {
        setData({
          ...data,
          fromDate: props.data.fromDate,
          toDate: props.data.toDate,
          status: JSON.parse('[' + props.data.status + ']'),
        });
      }
    }
  }, [props.data, prevData]);

  /** RENDER */
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
            {RowLabel(t('project_management:date_filter'))}
            {/** From date */}
            <View
              style={[
                cStyles.px16,
                cStyles.pt12,
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                {backgroundColor: customColors.card},
              ]}>
              <View style={styles.text_date}>
                <CText
                  styles={'pt16 textLeft'}
                  label={'project_management:from_date'}
                />
              </View>
              <CInput
                containerStyle={[cStyles.justifyEnd, styles.input_date]}
                style={styles.con_input_date}
                hasRemove={true}
                dateTimePicker={true}
                value={
                  data.fromDate === ''
                    ? ''
                    : moment(data.fromDate).format(
                        commonState.get('formatDateView'),
                      )
                }
                valueColor={colors.TEXT_BASE}
                iconLast={'calendar'}
                iconLastColor={colors.ICON_BASE}
                onPressIconLast={() => handleDateInput(INPUT_NAME.FROM_DATE)}
                onPressRemoveValue={() => setData({...data, fromDate: ''})}
              />
            </View>
            {/** To date */}
            <View
              style={[
                cStyles.px16,
                cStyles.pb16,
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
                {backgroundColor: customColors.card},
              ]}>
              <View style={styles.text_date}>
                <CText
                  styles={'pt16 textLeft'}
                  label={'project_management:to_date'}
                />
              </View>
              <CInput
                containerStyle={[cStyles.justifyEnd, styles.input_date]}
                style={styles.con_input_date}
                hasRemove={true}
                dateTimePicker={true}
                value={
                  data.toDate === ''
                    ? ''
                    : moment(data.toDate).format(
                        commonState.get('formatDateView'),
                      )
                }
                valueColor={colors.TEXT_BASE}
                iconLast={'calendar'}
                iconLastColor={colors.ICON_BASE}
                onPressIconLast={() => handleDateInput(INPUT_NAME.TO_DATE)}
                onPressRemoveValue={() => setData({...data, toDate: ''})}
              />
            </View>

            {/** Assigned */}
            {RowLabel(t('project_management:assigned_filter'))}
            {RowToggle(
              isDark,
              customColors,
              'assignToMe',
              data.assignToMe,
              'project_management:assign_to_me',
              onToggleAssignMe,
            )}
            {!data.assignToMe && (
              <TouchableOpacity>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyBetween,
                    cStyles.pl16,
                    {backgroundColor: customColors.card},
                    styles.row_header,
                  ]}>
                  <CText label={'project_management:assign_to'} />
                  <View
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.pr10]}>
                    <CText
                      styles={'colorTextMeta pr6'}
                      label={'project_management:assign_to_any'}
                    />
                    <Icon
                      name={'chevron-right'}
                      color={customColors.icon}
                      size={scalePx(3)}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/** Status */}
            {RowLabel(t('project_management:status_filter'))}
            {RowToggle(
              isDark,
              customColors,
              'statusAll',
              data.statusAll,
              'project_management:assign_status_any',
              onToggleStatusAll,
            )}
            {!data.statusAll &&
              RowStatus(
                isDark,
                customColors,
                'statusNew',
                data.statusNew,
                'project_management:assign_status_new',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                isDark,
                customColors,
                'statusInProgress',
                data.statusInProgress,
                'project_management:assign_status_in_progress',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                isDark,
                customColors,
                'statusOnHold',
                data.statusOnHold,
                'project_management:assign_status_on_hold',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                isDark,
                customColors,
                'statusCompleted',
                data.statusCompleted,
                'project_management:assign_status_completed',
                onChangeStatus,
                false,
              )}
            <View
              style={[
                cStyles.px16,
                cStyles.pl16,
                cStyles.pb10,
                cStyles.justifyEnd,
                styles.row_header,
              ]}
            />
          </ScrollView>

          {/** PICKER */}
          <CDateTimePicker
            show={showPickerDate.status}
            value={
              data[showPickerDate.active] === ''
                ? moment().format(commonState.get('formatDate'))
                : data[showPickerDate.active]
            }
            onChangeDate={onChangeDateRequest}
          />
        </View>
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
  text_date: {flex: 0.3},
  input_date: {flex: 0.7},
});

export default FilterProject;
