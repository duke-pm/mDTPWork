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
import CCheckbox from '~/components/CCheckbox';
/* COMMON */
import { colors, cStyles } from '~/utils/style';
import { IS_ANDROID } from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INPUT_NAME = {
  FROM_DATE: 'fromDate',
  TO_DATE: 'toDate',
};

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
  const [resolveRequest, setResolveRequest] = useState(false);
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(commonState.get('formatDate')),
    toDate: moment().clone().endOf('month').format(commonState.get('formatDate')),
    status: [1, 2, 3, 4],
    type: [2, 3],
  });
  const [statusRequest, setStatusRequest] = useState({
    wait: true,
    approved: true,
    reject: true,
  });
  const [typeRequest, setTypeRequest] = useState({
    damaged: true,
    lost: true,
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

  const handleChangeStatus = (status, nameStatus, checked) => {
    let tmpStatus = [...data.status];
    if (checked) {
      if (typeof status === 'string') {
        tmpStatus.push(status);
      } else {
        for (let i of status) tmpStatus.push(i);
      }
    } else {
      if (typeof status === 'string') {
        let findStatus = tmpStatus.findIndex(f => f == status);
        if (findStatus !== -1) tmpStatus.splice(findStatus, 1);
      } else {
        for (let j of status) {
          let findStatus = tmpStatus.findIndex(f => f == j);
          if (findStatus !== -1) tmpStatus.splice(findStatus, 1);
        }
      }
    }
    setStatusRequest({ ...statusRequest, [nameStatus]: checked });
    setData({ ...data, status: tmpStatus });
  };

  const handleChangeType = (type, nameType, checked) => {
    let tmpType = [...data.type];
    if (checked) {
      tmpType.push(type);
    } else {
      let findType = tmpType.findIndex(f => f == type);
      if (findType !== -1) tmpType.splice(findType, 1);
    }
    setTypeRequest({ ...typeRequest, [nameType]: checked });
    setData({ ...data, type: tmpType });
  };

  const handleChangeResolveRequest = (checked) => {
    setResolveRequest(checked);
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
        resolveRequest,
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
      cStyles.rounded2,
      cStyles.mx16,
      cStyles.mt16,
      show && cStyles.pb12,
      styles.container
    ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleToggle}
      >
        <View style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.p16
        ]}>
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Icon
              name={'filter'}
              color={colors.BLACK}
              size={20}
            />
            <CText styles={'H6 pl10'} label={'approved_assets:filter'} />
          </View>
          <Icon
            name={show ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={colors.BLACK}
          />
        </View>
      </TouchableOpacity>

      {show &&
        <View style={cStyles.px16}>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText customStyles={[cStyles.pt16, cStyles.textLeft,]} label={'approved_assets:from_date'} />
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
              valueColor={colors.BLACK}
              iconLast={'calendar'}
              iconLastColor={colors.GRAY_700}
              onPressIconLast={() => handleDateInput(INPUT_NAME.FROM_DATE)}
              onPressRemoveValue={() => setData({ ...data, fromDate: '' })}
            />
          </View>

          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText customStyles={[cStyles.pt16, cStyles.textLeft,]} label={'approved_assets:to_date'} />
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
              valueColor={colors.BLACK}
              iconLast={'calendar'}
              iconLastColor={colors.GRAY_700}
              onPressIconLast={() => handleDateInput(INPUT_NAME.TO_DATE)}
              onPressRemoveValue={() => setData({ ...data, toDate: '' })}
            />
          </View>

          {hasLostDamage &&
            <View style={[cStyles.row, cStyles.justifyBetween]}>
              <CCheckbox
                style={styles.con_input_status}
                labelStyle={'textDefault pl10'}
                label={'approved_assets:damaged'}
                value={typeRequest.damaged}
                onChange={(checked) => handleChangeType(2, 'damaged', checked)}
              />

              <CCheckbox
                style={styles.con_input_status}
                labelStyle={'textDefault pl10'}
                label={'approved_assets:lost'}
                value={typeRequest.lost}
                onChange={(checked) => handleChangeType(3, 'lost', checked)}
              />
            </View>
          }

          <View style={[cStyles.row, cStyles.justifyBetween]}>
            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved_assets:status_wait'}
              value={statusRequest.wait}
              onChange={(checked) => handleChangeStatus('1', 'wait', checked)}
            />

            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved_assets:status_approved'}
              value={statusRequest.approved}
              onChange={(checked) => handleChangeStatus([2, 3], 'approved', checked)}
            />

            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved_assets:status_reject'}
              value={statusRequest.reject}
              onChange={(checked) => handleChangeStatus('4', 'reject', checked)}
            />
          </View>

          <View>
            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved_assets:resolve_request'}
              value={resolveRequest}
              onChange={handleChangeResolveRequest}
            />
          </View>

          <CButton
            label={'approved_assets:filter_start'}
            onPress={handleFilter}
          />
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
    backgroundColor: colors.GRAY_300,
  },
  text_date: { flex: 0.3 },
  input_date: { flex: 0.7 },
  con_input_date: { backgroundColor: colors.WHITE },
  con_input_status: { backgroundColor: IS_ANDROID ? 'transparent' : colors.WHITE },
});

export default Filter;
