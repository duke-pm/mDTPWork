/**
 ** Name: Filter request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
import CButton from '~/components/CButton';
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import { IS_ANDROID, scalePx } from '~/utils/helper';
import CGroupFilter from '~/components/CGroupFilter';

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
    value: 2,
    label: 'approved_lost_damaged:title_damaged',
  },
  {
    value: 3,
    label: 'approved_lost_damaged:title_lost',
  }
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
  }
];

const NEED_REQUEST = [
  {
    value: false,
    label: 'approved_assets:resolve_request',
  },
];

function Filter(props) {
  const {
    hasLostDamage = false,
    onFilter = () => { },
  } = props;
  const { t } = useTranslation();

  const commonState = useSelector(({ common }) => common);

  const [show, setShow] = useState(false);
  const [showPickerDate, setShowPickerDate] = useState({
    status: false,
    active: null,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(commonState.get('formatDate')),
    toDate: moment().clone().endOf('month').format(commonState.get('formatDate')),
    status: [1, 2, 3, 4],
    type: [2, 3],
    resolveRequest: false,
  });

  /** HANDLE FUNC */
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShow(!show);
  };

  const handleDateInput = (inputName) => {
    setShowPickerDate({
      active: inputName,
      status: true,
    });
  };

  const handleChangeType = (typesChoose) => {
    setData({ ...data, type: typesChoose });
  };

  const handleChangeStatus = (statusChoose) => {
    let tmp = statusChoose;
    let index = tmp.indexOf(2);
    if (index !== -1) tmp.push(3);
    setData({ ...data, status: tmp });
  };

  const handleChangeResolveRequest = (checked) => {
    setData({ ...data, resolveRequest: checked.length > 0 ? true : false });
  };

  const handleFilter = () => {
    if (hasLostDamage && data.type.length === 0) {
      showMessage({
        message: t('common:app_name'),
        description: t('error:type_lost_damaged_not_found'),
        type: 'danger',
        icon: 'danger',
      });
    } else if (data.status.length === 0) {
      showMessage({
        message: t('common:app_name'),
        description: t('error:status_not_found'),
        type: 'danger',
        icon: 'danger',
      });
    } else {
      setShow(false);
      onFilter(
        data.fromDate,
        data.toDate,
        data.status.join(),
        data.type.join(),
        data.resolveRequest,
      );
    }
  };

  /** FUNC */
  const onChangeDateRequest = (newDate, showPicker) => {
    setShowPickerDate({ ...showPickerDate, status: showPicker });
    if (newDate && showPickerDate.active) {
      setData({
        ...data,
        [showPickerDate.active]: moment(newDate).format(commonState.get('formatDate')),
      });
      setShowPickerDate({ ...showPickerDate, status: showPicker });
    }
  }

  /** RENDER */
  return (
    <View style={[
      cStyles.rounded1,
      cStyles.mx16,
      cStyles.mt16,
      cStyles.borderAll,
      show && cStyles.pb12,
      styles.container
    ]}>
      <TouchableOpacity activeOpacity={1} onPress={handleToggle}>
        <View style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.p16
        ]}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Icon
              name={'filter'}
              color={colors.TEXT_BASE}
              size={scalePx(3)}
            />
            <CText styles={'H6 pl10'} label={'approved_assets:filter'} />
          </View>
          <Icon
            name={show ? 'chevron-up' : 'chevron-down'}
            size={scalePx(3)}
            color={colors.ICON_BASE}
          />
        </View>
      </TouchableOpacity>

      {show &&
        <View style={cStyles.px16}>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText styles={'fontMedium pt16 textLeft'} label={'approved_assets:from_date'} />
            </View>
            <CInput
              containerStyle={[cStyles.justifyEnd, styles.input_date]}
              style={styles.con_input_date}
              hasRemove={true}
              dateTimePicker={true}
              value={data.fromDate === ''
                ? ''
                : moment(data.fromDate).format(
                  commonState.get('formatDateView')
                )}
              valueColor={colors.TEXT_BASE}
              iconLast={'calendar'}
              iconLastColor={colors.ICON_BASE}
              onPressIconLast={() => handleDateInput(INPUT_NAME.FROM_DATE)}
              onPressRemoveValue={() => setData({ ...data, fromDate: '' })}
            />
          </View>

          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText styles={'fontMedium pt16 textLeft'} label={'approved_assets:to_date'} />
            </View>
            <CInput
              containerStyle={[cStyles.justifyEnd, styles.input_date]}
              style={styles.con_input_date}
              hasRemove={true}
              dateTimePicker={true}
              value={data.toDate === ''
                ? ''
                : moment(data.toDate).format(
                  commonState.get('formatDateView')
                )}
              valueColor={colors.TEXT_BASE}
              iconLast={'calendar'}
              iconLastColor={colors.ICON_BASE}
              onPressIconLast={() => handleDateInput(INPUT_NAME.TO_DATE)}
              onPressRemoveValue={() => setData({ ...data, toDate: '' })}
            />
          </View>

          {hasLostDamage &&
            <CGroupFilter
              row
              label={'common:type'}
              items={TYPES_ASSETS}
              itemsChoose={data.type}
              onChange={handleChangeType}
            />
          }

          <CGroupFilter
            row
            label={'common:status'}
            items={STATUS_REQUEST}
            itemsChoose={data.status}
            onChange={handleChangeStatus}
          />

          <CGroupFilter
            activeAll={false}
            row
            label={'approved_assets:resolve_request'}
            items={NEED_REQUEST}
            itemsChoose={[data.resolveRequest]}
            onChange={handleChangeResolveRequest}
          />

          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pt10]}>
            <CButton
              style={{ width: cStyles.deviceWidth / 2.5 }}
              variant={'outlined'}
              label={'common:close'}
              onPress={handleToggle}
            />
            <CButton
              style={{ width: cStyles.deviceWidth / 2.5 }}
              label={'common:apply'}
              onPress={handleFilter}
            />
          </View>
        </View>
      }

      {/** PICKER */}
      <CDateTimePicker
        show={showPickerDate.status}
        value={data[showPickerDate.active] === ''
          ? moment().format(commonState.get('formatDate'))
          : data[showPickerDate.active]}
        onChangeDate={onChangeDateRequest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.GRAY_200,
  },
  text_date: { flex: 0.3 },
  input_date: { flex: 0.7 },
  con_input_date: { backgroundColor: colors.WHITE },
  con_input_status: { backgroundColor: IS_ANDROID ? 'transparent' : colors.WHITE },
});

export default Filter;
