/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useTheme, Datepicker, Button, Icon, Divider, Layout,
} from '@ui-kitten/components';
import {MomentDateService} from '@ui-kitten/moment';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import 'moment';
import 'moment/locale/vi';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CGroupFilter from '~/components/CGroupFilter';
/* COMMON */
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {sW} from '~/utils/helper';

/** All init */
const minDate = '2010-01-01';
const maxDate = '2030-12-31';
const TYPES_ASSETS = [
  {
    value: Commons.APPROVED_TYPE.ASSETS.value,
    label: 'list_request_assets_handling:title_add',
  },
  {
    value: Commons.APPROVED_TYPE.DAMAGED.value,
    label: 'list_request_assets_handling:title_damaged',
  },
  {
    value: Commons.APPROVED_TYPE.LOST.value,
    label: 'list_request_assets_handling:title_lost',
  },
];
const STATUS_REQUEST = [
  {
    value: Commons.STATUS_REQUEST.WAIT.value,
    label: 'approved_assets:status_wait',
  },
  {
    value: Commons.STATUS_REQUEST.APPROVED.value,
    label: 'approved_assets:status_approved_done',
  },
  {
    value: Commons.STATUS_REQUEST.REJECT.value,
    label: 'approved_assets:status_reject',
  },
];

const RenderCheckIcon = props => (
  <Icon {...props} name="done-all-outline" />
);

function Filter(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {isResolve = false, onFilter = () => {}} = props;

  /** Use State */
  const [data, setData] = useState({
    fromDate: props.data.fromDate,
    toDate: props.data.toDate,
    status: [1, 2, 3, 4],
    type: [1, 2, 3],
    resolveRequest: isResolve,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeType = typesChoose => setData({...data, type: typesChoose});

  const handleChangeStatus = statusChoose => {
    let tmp = statusChoose;
    let index = tmp.indexOf(2);
    if (index !== -1) {
      tmp.push(3);
    }
    return setData({...data, status: tmp});
  };

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== '' ? moment(data.fromDate, 'YYYY-MM-DD').valueOf() : null;
    let tmpToDate =
      data.toDate !== '' ? moment(data.toDate, 'YYYY-MM-DD').valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return onErrorValidation('error:from_date_larger_than_to_date');
    } else if (!isResolve && data.status.length === 0) {
      return onErrorValidation('error:status_not_found');
    } else if (isResolve && data.type.length === 0) {
      return onErrorValidation('error:type_not_found');
    } else {
      return onFilter(
        data.fromDate,
        data.toDate,
        data.status.join(),
        data.type.join(),
        data.resolveRequest,
      );
    }
  };

  const onErrorValidation = messageKey => {
    return showMessage({
      message: t('common:app_name'),
      description: t(messageKey),
      type: 'warning',
      icon: 'warning',
    });
  };

  /**********
   ** FUNC **
   **********/
  const onChangeFromDate = newDate => {
    setData({...data, fromDate: newDate});
  };

  const onChangeToDate = newDate => {
    setData({...data, toDate: newDate});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (props.data) {
      let tmp = {
        ...data,
        fromDate: props.data.fromDate,
        toDate: props.data.toDate,
        type: JSON.parse('[' + props.data.type + ']'),
      };
      if (props.data.status) {
        tmp.status = JSON.parse('[' + props.data.status + ']');
      }
      setData(tmp);
    }
  }, [props.data]);

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={[cStyles.pb20, {width: sW('80%')}]}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pb5]}>
        <CText category="s1">{t('common:filter').toUpperCase()}</CText>
        <Button
          appearance="ghost"
          accessoryLeft={RenderCheckIcon}
          onPress={handleFilter}
        />
      </View>
      <Divider />
      <>
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <Datepicker
            style={cStyles.mt16}
            label={t('approved_assets:from_date')}
            accessoryRight={propsR => <Icon {...propsR} name="calendar" />}
            dateService={new MomentDateService('vi')}
            placeholder={t('approved_assets:from_date')}
            date={data.fromDate === ''
              ? ''
              : moment(data.fromDate)}
            min={moment(minDate)}
            max={moment(maxDate)}
            onSelect={onChangeFromDate}
          />
          <Datepicker
            style={cStyles.mt16}
            label={t('approved_assets:to_date')}
            accessoryRight={propsR => <Icon {...propsR} name="calendar" />}
            dateService={new MomentDateService('vi')}
            placeholder={t('approved_assets:to_date')}
            date={data.toDate === ''
              ? ''
              : moment(data.toDate)}
              min={moment(minDate)}
              max={moment(maxDate)}
            onSelect={onChangeToDate}
          />
        </View>

        {isResolve && (
          <CGroupFilter
            label={'common:type'}
            items={TYPES_ASSETS}
            itemsChoose={data.type}
            primaryColor={'primary'}
            onChange={handleChangeType}
          />
        )}

        {!isResolve && (
          <CGroupFilter
            label={'common:status'}
            items={STATUS_REQUEST}
            itemsChoose={data.status}
            primaryColor={'primary'}
            onChange={handleChangeStatus}
          />
        )}
      </>
    </Layout>
  );
}

Filter.propTypes = {
  isResolve: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default Filter;
