/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  UIManager,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, scalePx} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};

const RowLabel = (customColors, label) => {
  return (
    <View
      style={[
        cStyles.px16,
        cStyles.pl16,
        cStyles.pb10,
        cStyles.justifyEnd,
        styles.row_header,
        {backgroundColor: customColors.cardDisable},
      ]}>
      <CText styles={'textMeta'} customLabel={label.toUpperCase()} />
    </View>
  );
};

const RowStatus = (
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
          cStyles.ml16,
          isBorder && cStyles.borderBottom,
          styles.row_header,
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

const RowToggle = (customColors, slug, active, label, onToggle) => {
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.ml16,
        !active && cStyles.borderBottom,
        styles.row_header,
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

function Filter(props) {
  const {show, onFilter = () => {}} = props;
  const {t} = useTranslation();
  const isDark = useColorScheme() === 'dark';
  const {customColors} = useTheme();

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
    statusClosed: false,
    statusRejected: false,
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
      statusClosed: false,
      statusRejected: false,
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
      statusClosed: !data.statusAll,
      statusRejected: !data.statusAll,
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
      <SafeAreaView style={cStyles.flex1}>
        <View style={[cStyles.flex1, {backgroundColor: customColors.card}]}>
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
            {RowLabel(customColors, t('project_management:date_filter'))}
            {/** From date */}
            <View
              style={[
                cStyles.px16,
                cStyles.pt12,
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={styles.text_date}>
                <CText
                  styles={'fontMedium pt16 textLeft'}
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
              ]}>
              <View style={styles.text_date}>
                <CText
                  styles={'fontMedium pt16 textLeft'}
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
            {RowLabel(customColors, t('project_management:assigned_filter'))}
            {RowToggle(
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
                    cStyles.ml16,
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
            {RowLabel(customColors, t('project_management:status_filter'))}
            {RowToggle(
              customColors,
              'statusAll',
              data.statusAll,
              'project_management:assign_status_any',
              onToggleStatusAll,
            )}
            {!data.statusAll &&
              RowStatus(
                customColors,
                'statusNew',
                data.statusNew,
                'project_management:assign_status_new',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                customColors,
                'statusInProgress',
                data.statusInProgress,
                'project_management:assign_status_in_progress',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                customColors,
                'statusClosed',
                data.statusClosed,
                'project_management:assign_status_closed',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                customColors,
                'statusOnHold',
                data.statusOnHold,
                'project_management:assign_status_on_hold',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
                customColors,
                'statusRejected',
                data.statusRejected,
                'project_management:assign_status_reject',
                onChangeStatus,
              )}
            {!data.statusAll &&
              RowStatus(
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
                {backgroundColor: customColors.cardDisable},
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

export default Filter;
