/* eslint-disable no-shadow */
/**
 ** Name: List request page
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {TabView} from 'react-native-tab-view';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Filter from '../components/Filter';
import Assets from '../assets';
import AssetsDamage from '../assetsDamage';
import AssetsLost from '../assetsLost';
import TabbarType from '../components/TabbarType';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {cStyles} from '~/utils/style';

function ListRequestAll(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');

  /** use state */
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: Commons.APPROVED_TYPE.ASSETS.value + '',
      title: t('list_request_assets:title_add'),
      fromDate: moment().clone().startOf('month').format(formatDate),
      toDate: moment().clone().endOf('month').format(formatDate),
      status: '1,2,3,4',
      type: Commons.APPROVED_TYPE.ASSETS.value + '',
      search: '',
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.DAMAGED.value + '',
      title: t('list_request_assets:title_damaged'),
      fromDate: moment().clone().startOf('month').format(formatDate),
      toDate: moment().clone().endOf('month').format(formatDate),
      status: '1,2,3,4',
      type: Commons.APPROVED_TYPE.DAMAGED.value + '',
      search: '',
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.LOST.value + '',
      title: t('list_request_assets:title_lost'),
      fromDate: moment().clone().startOf('month').format(formatDate),
      toDate: moment().clone().endOf('month').format(formatDate),
      status: '1,2,3,4',
      type: Commons.APPROVED_TYPE.LOST.value + '',
      search: '',
      isRefresh: true,
    },
  ]);

  /** HANDLE FUNC */
  const handleAddNew = () => {
    if (index === 1) {
      navigation.navigate(Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name, {
        type: Commons.APPROVED_TYPE.DAMAGED.value,
        onRefresh: () => handleRefresh(index),
      });
    } else if (index === 2) {
      navigation.navigate(Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name, {
        type: Commons.APPROVED_TYPE.LOST.value,
        onRefresh: () => handleRefresh(index),
      });
    } else {
      navigation.navigate(Routes.MAIN.ADD_APPROVED_ASSETS.name, {
        type: Commons.APPROVED_TYPE.ASSETS.value,
        onRefresh: () => handleRefresh(index),
      });
    }
  };

  const handleRefresh = idxRoute => {
    let tmpRoutes = [...routes];
    tmpRoutes[idxRoute] = {
      ...tmpRoutes[idxRoute],
      isRefresh: !tmpRoutes[idxRoute].isRefresh,
    };
    setRoutes(tmpRoutes);
  };

  const handleSearch = value => {
    let route = {search: value};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...route};
    setRoutes(tmpRoutes);
  };

  const handleFilter = (fromDate, toDate, status, type) => {
    let route = {fromDate, toDate, status, type};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...route};
    setRoutes(tmpRoutes);
  };

  /** RENDER */
  const renderScene = ({route}) => {
    switch (route.key) {
      case Commons.APPROVED_TYPE.LOST.value + '':
        return <AssetsLost dataRoute={route} navigation={navigation} />;
      case Commons.APPROVED_TYPE.DAMAGED.value + '':
        return <AssetsDamage dataRoute={route} navigation={navigation} />;
      default:
        return <Assets dataRoute={route} navigation={navigation} />;
    }
  };
  const renderTabBar = props => <TabbarType {...props} />;
  return (
    <CContainer
      loading={false}
      title={'list_request_assets:title'}
      header
      hasSearch
      hasBack
      hasAddNew={isPermissionWrite}
      onPressAddNew={handleAddNew}
      onPressSearch={handleSearch}
      content={
        <CContent>
          <Filter
            data={routes[index]}
            isResolve={false}
            onFilter={handleFilter}
          />

          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={styles.con_tab}
          />
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_tab: {width: cStyles.deviceWidth, height: 0},
});

export default ListRequestAll;
