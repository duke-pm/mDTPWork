/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/**
 ** Name: List request page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {createRef, useState, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  View,
  LayoutAnimation,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import {TabView} from 'react-native-tab-view';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CSearchBar from '~/components/CSearchBar';
import CIconHeader from '~/components/CIconHeader';
import CActionSheet from '~/components/CActionSheet';
import Filter from '../components/Filter';
import Assets from '../assets';
import AssetsDamage from '../assetsDamage';
import AssetsLost from '../assetsLost';
import TabbarType from '../components/TabbarType';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import Icons from '~/config/Icons';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const actionSheetFilterRef = createRef();

const RenderScene = ({route}) => {
  switch (route.key) {
    case Commons.APPROVED_TYPE.LOST.value + '':
      return <AssetsLost dataRoute={route} />;
    case Commons.APPROVED_TYPE.DAMAGED.value + '':
      return <AssetsDamage dataRoute={route} />;
    case Commons.APPROVED_TYPE.ASSETS.value + '':
      return <Assets dataRoute={route} />;
    default:
      return null;
  }
};
const RenderTabbar = props => <TabbarType {...props} />;

function ListRequestAll(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;
  const layout = useWindowDimensions();

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');

  /** use state */
  const [showSearchBar, setShowSearch] = useState(false);
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
    actionSheetFilterRef.current?.hide();
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    if (routes[index].search !== '') {
      handleSearch('');
    }
  };

  const handleOpenFilter = () => {
    actionSheetFilterRef.current?.show();
  };

  const handleHideFilter = () => {
    actionSheetFilterRef.current?.hide();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: routes[index].search !== '',
              icon: Icons.search,
              onPress: handleOpenSearch,
            },
            {
              show: true,
              showRedDot: false,
              icon: Icons.filter,
              onPress: handleOpenFilter,
            },
            {
              show: isPermissionWrite,
              showRedDot: false,
              icon: Icons.addNew,
              onPress: handleAddNew,
            },
          ]}
        />
      ),
    });
  }, [navigation, index, routes[index], isPermissionWrite]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
        <View style={cStyles.flex1}>
          <CSearchBar
            isVisible={showSearchBar}
            valueSearch={routes[index].search}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />

          <TabView
            lazy
            initialLayout={{width: layout.width}}
            navigationState={{index, routes}}
            onIndexChange={setIndex}
            renderScene={RenderScene}
            renderTabBar={RenderTabbar}
          />

          <CActionSheet actionRef={actionSheetFilterRef}>
            <View style={cStyles.p16}>
              <Filter
                isResolve={false}
                data={routes[index]}
                onFilter={handleFilter}
                onClose={handleHideFilter}
              />
            </View>
          </CActionSheet>
        </View>
      }
    />
  );
}

export default ListRequestAll;
