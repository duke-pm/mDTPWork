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
import {TabView, TabBar} from 'react-native-tab-view';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Filter from '../components/Filter';
import Assets from '../assets';
import AssetsDamage from '../assetsDamage';
import AssetsLost from '../assetsLost';
/* COMMON */
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import Commons from '~/utils/common/Commons';

function ListRequestAll(props) {
  const {t} = useTranslation();

  const commonState = useSelector(({common}) => common);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: 'add',
      title: t('list_request_assets:title_add'),
      fromDate: moment()
        .clone()
        .startOf('month')
        .format(commonState.get('formatDate')),
      toDate: moment()
        .clone()
        .endOf('month')
        .format(commonState.get('formatDate')),
      status: '1,2,3,4',
      type: '1',
      search: '',
      isRefresh: true,
    },
    {
      key: 'damage',
      title: t('list_request_assets:title_damaged'),
      fromDate: moment()
        .clone()
        .startOf('month')
        .format(commonState.get('formatDate')),
      toDate: moment()
        .clone()
        .endOf('month')
        .format(commonState.get('formatDate')),
      status: '1,2,3,4',
      type: '2',
      search: '',
      isRefresh: true,
    },
    {
      key: 'lost',
      title: t('list_request_assets:title_lost'),
      fromDate: moment()
        .clone()
        .startOf('month')
        .format(commonState.get('formatDate')),
      toDate: moment()
        .clone()
        .endOf('month')
        .format(commonState.get('formatDate')),
      status: '1,2,3,4',
      type: '3',
      search: '',
      isRefresh: true,
    },
  ]);

  /** HANDLE FUNC */
  const handleAddNew = () => {
    if (index === 1) {
      props.navigation.navigate(Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name, {
        type: '1',
        onRefresh: () => handleRefresh(1),
      });
    } else if (index === 2) {
      props.navigation.navigate(Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name, {
        type: '2',
        onRefresh: () => handleRefresh(2),
      });
    } else {
      props.navigation.navigate(Routes.MAIN.ADD_APPROVED_ASSETS.name, {
        type: '3',
        onRefresh: () => handleRefresh(0),
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

  /** FUNC */
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'lost':
        return (
          <AssetsLost
            dataRoute={route}
            type={Commons.APPROVED_TYPE.LOST.code}
          />
        );
      case 'damage':
        return (
          <AssetsDamage
            dataRoute={route}
            type={Commons.APPROVED_TYPE.DAMAGED.code}
          />
        );
      case 'add':
        return (
          <Assets dataRoute={route} type={Commons.APPROVED_TYPE.ASSETS.code} />
        );
    }
  };

  /** RENDER */
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator_tab}
      style={styles.tab}
      renderLabel={({route, focused, color}) => (
        <CText
          styles={'p10 ' + (focused ? 'colorPrimary fontBold' : 'colorGray700')}
          customLabel={route.title}
        />
      )}
    />
  );

  return (
    <CContainer
      title={'list_request_assets:title'}
      loading={false}
      header
      hasAddNew
      hasSearch
      hasBack
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
            initialLayout={styles.con_tab}
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
          />
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  indicator_tab: {backgroundColor: colors.PRIMARY},
  tab: {backgroundColor: colors.WHITE},
  con_tab: {width: cStyles.deviceWidth},
});

export default ListRequestAll;
