/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {createRef, useState, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
import {TabView} from 'react-native-tab-view';
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
import FilterTags from '../components/FilterTags';
/* COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {Commons, Icons} from '~/utils/common';
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All ref */
const asFilterRef = createRef();

const RenderTabbar = props => <TabbarType {...props} />;
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

function ListRequestAll(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');

  /** use state */
  const [showSearchBar, setShowSearch] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: Commons.APPROVED_TYPE.ASSETS.value + '',
      title: t('list_request_assets:title_add'),
      fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
      toDate: Configs.toDay.clone().endOf('month').format(formatDate),
      status: '1,2,3,4',
      type: Commons.APPROVED_TYPE.ASSETS.value + '',
      search: '',
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.DAMAGED.value + '',
      title: t('list_request_assets:title_damaged'),
      fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
      toDate: Configs.toDay.clone().endOf('month').format(formatDate),
      status: '1,2,3,4',
      type: Commons.APPROVED_TYPE.DAMAGED.value + '',
      search: '',
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.LOST.value + '',
      title: t('list_request_assets:title_lost'),
      fromDate: Configs.toDay.clone().startOf('month').format(formatDate),
      toDate: Configs.toDay.clone().endOf('month').format(formatDate),
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
    let tmp = {search: value};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    setRoutes(tmpRoutes);
  };

  const handleFilter = (fromDate, toDate, status, type) => {
    let tmp = {fromDate, toDate, status, type};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    setRoutes(tmpRoutes);
    asFilterRef.current?.hide();
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
    asFilterRef.current?.show();
  };

  const handleHideFilter = () => {
    asFilterRef.current?.hide();
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
  let item,
    status = routes[index].status.split(','),
    statusObj = [];
  for (item of status) {
    if (item == Commons.STATUS_REQUEST.WAIT.value) {
      statusObj.push('approved_assets:status_wait');
    } else if (item == Commons.STATUS_REQUEST.REJECT.value) {
      statusObj.push('approved_assets:status_reject');
    } else if (
      statusObj.indexOf('approved_assets:status_approved_done') === -1
    ) {
      statusObj.push('approved_assets:status_approved_done');
    }
  }
  return (
    <CContainer
      loading={false}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_APPROVED}
      primaryColorShapesDark={colors.BG_HEADER_APPROVED_DARK}
      content={
        <View style={cStyles.flex1}>
          <CSearchBar
            isVisible={showSearchBar}
            valueSearch={routes[index].search}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />
          <FilterTags
            translation={t}
            formatDateView={formatDateView}
            fromDate={routes[index].fromDate}
            toDate={routes[index].toDate}
            arrStatus={statusObj}
            primaryColor={customColors.yellow2}
          />
          <TabView
            lazy
            initialLayout={styles.container_tab}
            navigationState={{index, routes}}
            onIndexChange={setIndex}
            renderScene={RenderScene}
            renderTabBar={RenderTabbar}
          />

          <CActionSheet actionRef={asFilterRef}>
            <View style={[cStyles.px16, cStyles.pb16]}>
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

const styles = StyleSheet.create({
  container_tab: {width: cStyles.deviceWidth},
});

export default ListRequestAll;
