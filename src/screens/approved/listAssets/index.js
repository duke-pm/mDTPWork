/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
/**
 ** Name: List request page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {TabView} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CSearchBar from '~/components/CSearchBar';
import Filter from '../components/Filter';
import Assets from '../assets';
import AssetsDamage from '../assetsDamage';
import AssetsLost from '../assetsLost';
import TabbarType from '../components/TabbarType';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ListRequestAll(props) {
  const {t} = useTranslation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {route, navigation} = props;
  const isPermissionWrite = route.params?.permission?.write || false;

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

  navigation.setOptions({
    headerRight: () => (
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        <TouchableOpacity onPress={handleOpenSearch}>
          <View style={isPermissionWrite ? cStyles.pr24 : {}}>
            <Icon
              name={'search'}
              color={
                isDark ? colors.WHITE : IS_ANDROID ? colors.WHITE : colors.BLACK
              }
              size={moderateScale(21)}
            />
            {routes[index].search !== '' && (
              <View
                style={[
                  cStyles.abs,
                  cStyles.rounded2,
                  cStyles.borderAll,
                  styles.badge,
                  isDark && cStyles.borderAllDark,
                  {
                    backgroundColor: customColors.red,
                    top: 0,
                    left: moderateScale(10),
                  },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
        {isPermissionWrite && (
          <TouchableOpacity onPress={handleAddNew}>
            <View>
              <Icon
                name={'add-circle'}
                color={
                  isDark
                    ? colors.WHITE
                    : IS_ANDROID
                    ? colors.WHITE
                    : colors.BLACK
                }
                size={moderateScale(21)}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    ),
  });

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
  };

  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(false);
  };

  /**************
   ** RENDER **
   **************/
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
      content={
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          <View style={cStyles.itemsCenter}>
            {!showSearchBar && (
              <Filter
                data={routes[index]}
                isResolve={false}
                onFilter={handleFilter}
              />
            )}
          </View>

          <CSearchBar
            isVisible={showSearchBar}
            onSearch={handleSearch}
            onClose={handleCloseSearch}
          />

          <TabView
            style={cStyles.flex1}
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={styles.con_tab}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_tab: {width: cStyles.deviceWidth},
  badge: {
    height: moderateScale(10),
    width: moderateScale(10),
    top: 16,
    right: 15,
  },
});

export default ListRequestAll;
