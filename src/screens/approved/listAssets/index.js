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
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
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
import Icons from '~/config/Icons';
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import CIcon from '~/components/CIcon';
import {useTheme} from '@react-navigation/native';
import CText from '~/components/CText';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
      content={
        <View style={cStyles.flex1}>
          <CSearchBar
            isVisible={showSearchBar}
            valueSearch={routes[index].search}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />
          <View
            style={[
              cStyles.flexWrap,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.px16,
              cStyles.pt10,
            ]}>
            <CIcon name={Icons.tags} />
            <View
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mx10,
                cStyles.rounded1,
                {backgroundColor: customColors.green2},
              ]}>
              <CText
                styles={'textCaption2'}
                customLabel={
                  (routes[index].fromDate !== ''
                    ? moment(routes[index].fromDate).format(formatDateView)
                    : '#') +
                  ' - ' +
                  (routes[index].toDate !== ''
                    ? moment(routes[index].toDate).format(formatDateView)
                    : '#')
                }
              />
            </View>

            {statusObj.map(itemStatus => {
              return (
                <View
                  style={[
                    cStyles.px6,
                    cStyles.py2,
                    cStyles.mr10,
                    cStyles.mt8,
                    cStyles.rounded1,
                    {backgroundColor: customColors.green2},
                  ]}>
                  <CText styles={'textCaption2'} label={itemStatus} />
                </View>
              );
            })}
          </View>
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
