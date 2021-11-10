/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CAvatar from '~/components/CAvatar';
import CItem from '~/components/CItem';
import CText from '~/components/CText';
/** COMMON */
import Configs from '~/config';
import {cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_8} from '~/config/constants';

function Dashboard(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const authState = useSelector(({auth}) => auth);
  const fullName = authState.getIn(['login', 'fullName']);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = (dataRoute, indexRoute) => {
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
      console.log('[LOG] === tmpRoutes ===> ', tmpRoutes);
      setRoutes(tmpRoutes);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  useEffect(() => setLoading(false), [routes]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      safeArea={{top: true, bottom: false}}
      hasShapes
      content={
        <CContent padder>
          <View
            style={[
              cStyles.row,
              cStyles.itemsEnd,
              cStyles.justifyBetween,
              cStyles.fullWidth,
              styles.welcome,
            ]}>
            <View>
              <CText
                styles={'textCaption1 colorWhite'}
                customLabel={`${moment().format(DEFAULT_FORMAT_DATE_8)}`}
              />
              <CText
                styles={'textHeadline colorWhite'}
                customLabel={`${t('dashboard:welcome')} ${fullName}`}
              />
              <CText
                styles={'textCaption1 colorWhite'}
                label={'dashboard:welcome_1'}
              />
            </View>
            <View style={cStyles.itemsEnd}>
              <CAvatar size={'medium'} label={fullName} />
            </View>
          </View>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.flexWrap,
              cStyles.pt16,
              styles.list_item,
            ]}>
            {routes.map((item, index) => {
              if (item.isAccess) {
                return (
                  <CItem
                    key={index.toString()}
                    index={index}
                    data={item}
                    colors={Configs.colorsSubMenu.main[index].colors}
                    bgColor={Configs.colorsSubMenu.main[index].bgColor}
                    onPress={handleItem}
                  />
                );
              }
              return null;
            })}
          </View>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  welcome: {flex: 0.5},
  list_item: {flex: 0.5},
});

export default Dashboard;
