/**
 ** Name: Filter request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
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
/* REDUX */

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
    onFilter = () => { },
  } = props;

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
  });
  const [statusRequest, setStatusRequest] = useState({
    wait: true,
    approved: true,
    reject: true,
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

  const handleFilter = () => {
    setShow(false);
    onFilter(
      data.fromDate,
      data.toDate,
      data.status.join(),
    );
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
    <View style={[cStyles.rounded1, styles.container]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={handleToggle}
      >
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.p16]}>
          <CText styles={'H6'} label={'approved:filter'} />
          <Feather name={show ? 'chevron-up' : 'chevron-down'} size={20} color={colors.BLACK} />
        </View>
      </TouchableOpacity>

      {show &&
        <View style={cStyles.px16}>
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText customStyles={[cStyles.pt16, cStyles.textLeft,]} label={'approved:from_date'} />
            </View>
            <CInput
              containerStyle={[cStyles.justifyEnd, styles.input_date]}
              style={styles.con_input_date}
              disabled={true}
              hasRemove={true}
              dateTimePicker={true}
              value={data.fromDate === ''
                ? ''
                : moment(data.fromDate).format(
                  commonState.get('formatDateView')
                )}
              valueColor={colors.BLACK}
              iconLast={'calendar-alt'}
              iconLastColor={colors.GRAY_700}
              onPressIconLast={() => handleDateInput(INPUT_NAME.FROM_DATE)}
              onPressRemoveValue={() => setData({ ...data, fromDate: '' })}
            />
          </View>

          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={styles.text_date}>
              <CText customStyles={[cStyles.pt16, cStyles.textLeft,]} label={'approved:to_date'} />
            </View>
            <CInput
              containerStyle={[cStyles.justifyEnd, styles.input_date]}
              style={styles.con_input_date}
              disabled={true}
              hasRemove={true}
              dateTimePicker={true}
              value={data.toDate === ''
                ? ''
                : moment(data.toDate).format(
                  commonState.get('formatDateView')
                )}
              valueColor={colors.BLACK}
              iconLast={'calendar-alt'}
              iconLastColor={colors.GRAY_700}
              onPressIconLast={() => handleDateInput(INPUT_NAME.TO_DATE)}
              onPressRemoveValue={() => setData({ ...data, toDate: '' })}
            />
          </View>

          <View style={[cStyles.row, cStyles.justifyBetween]}>
            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved:status_wait'}
              value={statusRequest.wait}
              onChange={(checked) => handleChangeStatus('1', 'wait', checked)}
            />

            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved:status_approved'}
              value={statusRequest.approved}
              onChange={(checked) => handleChangeStatus([2, 3], 'approved', checked)}
            />

            <CCheckbox
              style={styles.con_input_status}
              labelStyle={'textDefault pl10'}
              label={'approved:status_reject'}
              value={statusRequest.reject}
              onChange={(checked) => handleChangeStatus('0', 'reject', checked)}
            />
          </View>

          <CButton
            label={'approved:filter_start'}
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
