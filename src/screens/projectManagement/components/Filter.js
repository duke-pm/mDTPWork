/**
 ** Name: Filter
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
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
import {useTheme} from '@react-navigation/native';
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
import Commons from '~/utils/common/Commons';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};
const STATUS_TASK = [
  {
    value: Commons.STATUS_TASK.NEW.value,
    label: Commons.STATUS_TASK.NEW.label,
  },
  {
    value: Commons.STATUS_TASK.TO_BE_SCHEDULE.value,
    label: Commons.STATUS_TASK.TO_BE_SCHEDULE.label,
  },
  {
    value: Commons.STATUS_TASK.SCHEDULE.value,
    label: Commons.STATUS_TASK.SCHEDULE.label,
  },
  {
    value: Commons.STATUS_TASK.IN_PROCESS.value,
    label: Commons.STATUS_TASK.IN_PROCESS.label,
  },
  {
    value: Commons.STATUS_TASK.CLOSED.value,
    label: Commons.STATUS_TASK.CLOSED.label,
  },
  {
    value: Commons.STATUS_TASK.ON_HOLD.value,
    label: Commons.STATUS_TASK.ON_HOLD.label,
  },
  {
    value: Commons.STATUS_TASK.REJECTED.value,
    label: Commons.STATUS_TASK.REJECTED.label,
  },
];

function Filter(props) {
  const {onFilter = () => {}} = props;
  const {t} = useTranslation();
  const {customColors} = useTheme();

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
    status: [0, 1, 2, 3, 4, 5, 6],
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
      onFilter(data.fromDate, data.toDate, data.status.join());
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
        show && cStyles.pb12,
        {backgroundColor: customColors.card},
      ]}>
      <TouchableOpacity activeOpacity={1} onPress={handleToggle}>
        {/** Header of filter */}
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

      {/** Content of filter */}
      {show && (
        <View style={cStyles.px16}>
          {/** From date */}
          <View
            style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
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
            style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
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

          <CGroupFilter
            row
            label={'common:status'}
            items={STATUS_TASK}
            itemsChoose={data.status}
            onChange={handleChangeStatus}
          />

          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.pt10,
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
});

export default Filter;
