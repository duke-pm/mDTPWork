/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {StyleSheet, View} from 'react-native';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CItem from '~/components/CItem';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
/** COMMON */
import {cStyles} from '~/utils/style';

function Dashboard(props) {
  const {navigation} = props;

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /** Use redux */
  const authState = useSelector(({auth}) => auth);
  const fullName = authState.getIn(['login', 'fullName']);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = dataRoute => {
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
      // tmpRoutes.push(tmpListMenu.lstPermissionItem[0]);
      // tmpRoutes.push(tmpListMenu.lstPermissionItem[0]);
      // tmpRoutes.push(tmpListMenu.lstPermissionItem[0]);
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
      hasShapes
      content={
        <CContent>
          <View
            style={[
              cStyles.row,
              cStyles.itemsEnd,
              cStyles.justifyBetween,
              cStyles.px16,
              cStyles.fullWidth,
              ifIphoneX(cStyles.pt60, cStyles.pt40),
              styles.welcome,
            ]}>
            <View>
              <CText
                styles={'textTitle1 colorWhite'}
                label={'dashboard:welcome'}
              />
              <CText
                styles={'textSubheadline colorWhite'}
                customLabel={fullName}
              />
            </View>
            <View style={cStyles.itemsEnd}>
              <CAvatar size={'medium'} label={fullName} />
            </View>
          </View>
          <View
            style={[
              cStyles.row,
              cStyles.itemsStart,
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
