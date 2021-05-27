/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CButton from '~/components/CButton';
import CGroupFilter from '~/components/CGroupFilter';
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
const TYPES_ASSETS = [
  {
    value: 1,
    label: 'list_request_assets_handling:title_add',
  },
  {
    value: 2,
    label: 'list_request_assets_handling:title_damaged',
  },
  {
    value: 3,
    label: 'list_request_assets_handling:title_lost',
  },
];
const STATUS_REQUEST = [
  {
    value: 1,
    label: 'approved_assets:status_wait',
  },
  {
    value: 2,
    label: 'approved_assets:status_approved_done',
  },
  {
    value: 4,
    label: 'approved_assets:status_reject',
  },
];

function Filter(props) {
  const {isResolve = false, onFilter = () => {}} = props;
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');

  /** Use State */
  const [show, setShow] = useState(false);
  const [valueAnim] = useState(new Animated.Value(0));
  const [showPickerDate, setShowPickerDate] = useState({
    status: false,
    active: null,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    status: [1, 2, 3, 4],
    type: [1, 2, 3],
    resolveRequest: isResolve,
  });

  /** Use previous */
  let prevData = usePrevious(props.data);

  /** HANDLE FUNC */
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(valueAnim, {
      toValue: show ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShow(!show);
  };

  const handleDateInput = inputName => {
    setShowPickerDate({
      active: inputName,
      status: true,
    });
  };

  const handleChangeType = typesChoose => {
    setData({...data, type: typesChoose});
  };

  const handleChangeStatus = statusChoose => {
    let tmp = statusChoose;
    let index = tmp.indexOf(2);
    if (index !== -1) {
      tmp.push(3);
    }
    setData({...data, status: tmp});
  };

  const handleFilter = () => {
    if (data.status.length === 0) {
      showMessage({
        message: t('common:app_name'),
        description: t('error:status_not_found'),
        type: 'danger',
        icon: 'danger',
      });
    } else {
      onFilter(
        data.fromDate,
        data.toDate,
        data.status.join(),
        data.type.join(),
        data.resolveRequest,
      );
      handleToggle();
    }
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

  /** LIFE CYCLE */
  useEffect(() => {
    if (prevData) {
      if (prevData.key !== props.data.key) {
        setData({
          ...data,
          fromDate: props.data.fromDate,
          toDate: props.data.toDate,
          status: JSON.parse('[' + props.data.status + ']'),
          type: JSON.parse('[' + props.data.type + ']'),
        });
      }
    }
  }, [props.data, prevData]);

  /** RENDER */
  const rotateData = valueAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  return (
    <View
      style={[
        cStyles.rounded2,
        cStyles.mx16,
        cStyles.mt16,
        cStyles.borderAll,
        isDark && cStyles.borderAllDark,
        show && cStyles.pb12,
        {backgroundColor: customColors.card},
      ]}>
      <TouchableOpacity activeOpacity={1} onPress={handleToggle}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.p16,
          ]}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Icon name={'filter'} color={customColors.text} size={scalePx(3)} />
            <CText styles={'pl10'} label={'approved_assets:filter'} />
          </View>
          <Animated.View style={{transform: [{rotate: rotateData}]}}>
            <Icon
              name={'chevron-down'}
              size={scalePx(3)}
              color={customColors.text}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {show && (
        <View style={cStyles.px16}>
          <View
            style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText
                styles={'pt12 textLeft'}
                label={'approved_assets:from_date'}
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

          <View
            style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText
                styles={'pt12 textLeft'}
                label={'approved_assets:to_date'}
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

          {isResolve && (
            <CGroupFilter
              label={'common:type'}
              items={TYPES_ASSETS}
              itemsChoose={data.type}
              onChange={handleChangeType}
            />
          )}

          {!isResolve && (
            <CGroupFilter
              label={'common:status'}
              items={STATUS_REQUEST}
              itemsChoose={data.status}
              onChange={handleChangeStatus}
            />
          )}

          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.mt10,
            ]}>
            <CButton
              style={{width: cStyles.deviceWidth / 2.5}}
              variant={'outlined'}
              label={'common:close'}
              onPress={handleToggle}
            />
            <CButton
              style={{width: cStyles.deviceWidth / 2.5}}
              label={'common:apply'}
              onPress={handleFilter}
            />
          </View>
        </View>
      )}

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
  );
}

const styles = StyleSheet.create({
  text_date: {flex: 0.3},
  input_date: {flex: 0.7},
  con_input_status: {
    backgroundColor: IS_ANDROID ? 'transparent' : colors.WHITE,
  },
});

export default Filter;
