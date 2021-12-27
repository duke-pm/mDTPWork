/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {TabView, Tab} from '@ui-kitten/components';
import {View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CButtonAdd from '~/components/CButtonAdd';
import Assets from '../assets';
import AssetsDamage from '../assetsDamage';
import AssetsLost from '../assetsLost';
import Filter from '../components/Filter';
/* COMMON */
import Routes from '~/navigator/Routes';
import {Commons} from '~/utils/common';
/* REDUX */
import * as Actions from '~/redux/actions';

function ListRequestAll(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const isPermissionWrite =
    route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const formatDate = commonState.get('formatDate');
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddNew = () => {
    if (index === 1) {
      navigation.navigate(Routes.ADD_APPROVED_LOST_DAMAGED.name, {
        type: Commons.APPROVED_TYPE.DAMAGED.value,
        onRefresh: () => handleRefresh(index),
      });
    } else if (index === 2) {
      navigation.navigate(Routes.ADD_APPROVED_LOST_DAMAGED.name, {
        type: Commons.APPROVED_TYPE.LOST.value,
        onRefresh: () => handleRefresh(index),
      });
    } else {
      navigation.navigate(Routes.ADD_APPROVED_ASSETS.name, {
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
    return setRoutes(tmpRoutes);
  };

  const handleSearch = value => {
    let tmp = {search: value};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    return setRoutes(tmpRoutes);
  };

  const handleFilter = (fromDate, toDate, status, type, toggle) => {
    toggle();
    let tmp = {fromDate, toDate, status, type};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    return setRoutes(tmpRoutes);
  };

  /**********
   ** FUNC **
   **********/
  const resetAllRequests = () => {
    dispatch(Actions.resetAllApproved());
  };

  const onPrepareData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
  };

  const shouldLoadComponent = (newIndex) => newIndex === index;

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    resetAllRequests();
    onPrepareData();
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top', 'bottom']}
      headerComponent={
        <CTopNavigation
          title="list_request_assets:title"
          back
          searchFilter
          onSearch={handleSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isResolve={false}
                data={routes[index]}
                onFilter={(fromDate, toDate, status, type) =>
                  handleFilter(fromDate, toDate, status, type, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** Content */}
      <TabView
        shouldLoadComponent={shouldLoadComponent}
        selectedIndex={index}
        onSelect={setIndex}>
        <Tab title={t('list_request_assets:title_add')}>
          <Assets dataRoute={routes[index]} navigation={navigation} />
        </Tab>
        <Tab title={t('list_request_assets:title_damaged')}>
          <AssetsDamage dataRoute={routes[index]} navigation={navigation} />
        </Tab>
        <Tab title={t('list_request_assets:title_lost')}>
          <AssetsLost dataRoute={routes[index]} navigation={navigation} />
        </Tab>
      </TabView>

      {/** If have permission => Add action will show */}
      <CButtonAdd show={isPermissionWrite} onPress={handleAddNew} />
    </CContainer>
  );
}

export default ListRequestAll;
