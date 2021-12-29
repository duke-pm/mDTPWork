/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme, Avatar, Layout, Spinner, Text} from '@ui-kitten/components';
import {StatusBar, StyleSheet, View} from 'react-native';
import moment from 'moment';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CItem from '~/components/CItem';
/** COMMON */
import Configs from '~/configs';
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_8, LIGHT} from '~/configs/constants';
import {IS_ANDROID} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';

function Dashboard(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {navigation} = props;
  const bgHeader = theme['background-basic-color-3'];

  /** Use redux */
  const authState = useSelector(({auth}) => auth);
  const fullName = authState.getIn(['login', 'fullName']);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = (dataRoute, idxRoute) => {
    navigation.navigate(dataRoute.mName, {
      idRouteParent: dataRoute.menuID,
    });
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(['login', 'lstMenu']);
    if (tmpListMenu && tmpListMenu.lstPermissionItem.length > 0) {
      /** Check permission user can access */
      let item = null,
        tmpRoutes = [];
      for (item of tmpListMenu.lstPermissionItem) {
        if (item.isAccess) {
          tmpRoutes.push(item);
        }
      }
      tmpRoutes.sort((a, b) => {
        if (a.menuID > b.menuID) {
          return 1;
        } else if (a.menuID < b.menuID) {
          return -1;
        } else {
          return 0;
        }
      });
      setRoutes(tmpRoutes);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  useEffect(() => setLoading(false), [routes]);

  useEffect(() => {
    if (themeContext.themeApp === LIGHT) {
      const unsubscribe = navigation.addListener('focus', () => {
        StatusBar.setBarStyle('dark-content', true);
        IS_ANDROID &&
          StatusBar.setBackgroundColor(bgHeader, true);
      });
      return unsubscribe;
    }
  }, [themeContext.themeApp, navigation]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      backgroundColor={bgHeader}>
      <Layout
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.px16,
          cStyles.py24
        ]} level={'3'}>
        <View>
          <Text>{`${moment().format(DEFAULT_FORMAT_DATE_8)}`}</Text>
          <Text style={cStyles.mt5} category='h6'>
            {`${t('dashboard:welcome')} ${fullName}`}
          </Text>
          <Text style={cStyles.mt5} category='c1'>
            {t('dashboard:welcome_1')}
          </Text>
        </View>
        <Avatar size={'large'} source={Assets.iconUser} />
      </Layout>

      {!loading && (
        <Layout
          style={[
            cStyles.flex1,
            cStyles.roundedTopLeft8,
            cStyles.roundedTopRight8,
            cStyles.shadowListItem,
          ]}>
          <View
            style={[
              cStyles.row,
              cStyles.justifyEvenly,
              cStyles.flexWrap,
              cStyles.pt16,
              styles.list_item,
            ]}>
            {routes.map((item, index) => {
              if (item.isAccess) {
                return (
                  <View key={item.menuID + '_' + index}>
                    <CItem
                      index={index}
                      data={item}
                      colors={Configs.colorsSubMenu.main[index].colors}
                      bgColor={Configs.colorsSubMenu.main[index].bgColor}
                      onPress={handleItem}
                    />
                  </View>
                );
              }
              return null;
            })}
          </View>
        </Layout>
      )}

      {loading && (
        <Layout
          style={[
            cStyles.flex1,
            cStyles.center,
            cStyles.roundedTopLeft8,
            cStyles.roundedTopRight8,
            cStyles.shadowListItem,
          ]}>
          <Spinner />
        </Layout>
      )}
    </CContainer>
  );
}

const styles = StyleSheet.create({
  list_item: {flex: 0.5},
});

export default Dashboard;
