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
import {showMessage} from 'react-native-flash-message';
import {useTheme, Button, Datepicker, Divider, Icon} from '@ui-kitten/components';
import {MomentDateService} from '@ui-kitten/moment';
import {View} from 'react-native';
import moment from 'moment';
import 'moment';
import 'moment/locale/vi';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CGroupFilter from '~/components/CGroupFilter';
/* COMMON */
import {cStyles} from '~/utils/style';
import {sW} from '~/utils/helper';
import {DEFAULT_FORMAT_DATE_1} from '~/configs/constants';

/** All init avriables */
const minDate = '2010-01-01';
const maxDate = '2030-12-31';

function Filter(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    formatDate = DEFAULT_FORMAT_DATE_1,
    resourcesMaster = {},
    onFilter = () => {},
  } = props;

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [dataResources, setDataResources] = useState([]);
  const [data, setData] = useState({
    fromDate: props.data.fromDate,
    toDate: props.data.toDate,
    resources: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeResource = resourceChoosed =>
    setData({...data, resources: resourceChoosed});

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== '' ? moment(data.fromDate, formatDate).valueOf() : null;
    let tmpToDate =
      data.toDate !== '' ? moment(data.toDate, formatDate).valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return onErrorValidation('error:from_date_larger_than_to_date');
    }
    if (data.resources.length === 0) {
      return onErrorValidation('error:resource_not_found');
    }
    let tmpResourceORG = dataResources.filter(item =>
      data.resources.includes(item.value),
    );

    return onFilter(
      data.fromDate,
      data.toDate,
      data.resources.join(),
      tmpResourceORG,
    );
  };

  /**********
   ** FUNC **
   **********/
  const onErrorValidation = messageKey => {
    return showMessage({
      message: t('common:app_name'),
      description: t(messageKey),
      type: 'warning',
      icon: 'warning',
    });
  };

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
    if (loading && resourcesMaster.length > 0) {
      let i,
        objResource = {},
        tmpResurces = [],
        tmpDataResources = [];
      for (i = 0; i < resourcesMaster.length; i++) {
        tmpResurces.push(resourcesMaster[i].resourceID);
        objResource = {};
        objResource.value = resourcesMaster[i].resourceID;
        objResource.label = resourcesMaster[i].resourceName;
        tmpDataResources.push(objResource);
      }
      setDataResources(tmpDataResources);
      setData({...data, resources: tmpResurces});
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (props.data) {
      let tmp = {
        fromDate: props.data.fromDate,
        toDate: props.data.toDate,
        resources: JSON.parse('[' + props.data.resources + ']'),
      };
      setData(tmp);
    }
  }, [props.data]);
  console.log('[LOG] === resourcesMaster ===> ', dataResources);
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.pb20, {width: sW('80%')}]}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pb10]}>
        <CText category="label" status="control">{t('common:filter').toUpperCase()}</CText>
        <Button
          appearance="ghost"
          accessoryLeft={propsI =>
            CIcon(propsI, 'eva', 'checkmark', theme['text-control-color'])}
          onPress={handleFilter}
        />
      </View>
      <Divider />
      <>
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <Datepicker
            style={cStyles.mt16}
            label={t('bookings:from_date')}
            accessoryRight={propsR => <Icon {...propsR} name="calendar" />}
            dateService={new MomentDateService('vi')}
            placeholder={t('bookings:from_date')}
            date={data.fromDate === ''
              ? ''
              : moment(data.fromDate)}
            min={moment(minDate)}
            max={moment(maxDate)}
            onSelect={onChangeFromDate}
          />
          <Datepicker
            style={cStyles.mt16}
            label={t('bookings:to_date')}
            accessoryRight={propsR => <Icon {...propsR} name="calendar" />}
            dateService={new MomentDateService('vi')}
            placeholder={t('bookings:to_date')}
            date={data.toDate === ''
              ? ''
              : moment(data.toDate)}
              min={moment(minDate)}
              max={moment(maxDate)}
            onSelect={onChangeToDate}
          />
        </View>

        {!loading &&
          <CGroupFilter
            label={'bookings:resource'}
            items={dataResources}
            itemsChoose={data.resources}
            primaryColor={'primary'}
            onChange={handleChangeResource}
          />
        }
      </>
    </View>
  );
}

Filter.propTypes = {
  data: PropTypes.object.isRequired,
  formatDate: PropTypes.string,
  resourcesMaster: PropTypes.object,
  onFilter: PropTypes.func.isRequired,
};

export default Filter;
