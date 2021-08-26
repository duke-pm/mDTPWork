/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Booking Management
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingManagement.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CItem from '~/components/CItem';
/* COMMON */
import {colors, cStyles} from '~/utils/style';

const colorsItem = [
  {
    colors: [colors.INDIGO, '#373B44'],
    bgColor: colors.BG_PROJECT_M,
  },
  {
    colors: [colors.GREEN, '#373B44'],
    bgColor: colors.BG_PROJECT_O,
  },
];

function BookingManagement(props) {
  const {navigation, route} = props;

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = dataRoute => {
    navigation.navigate(dataRoute.mName, {
      permission: {write: dataRoute.isWrite},
    });
  };

  /**********
   ** FUNC **
   **********/
  const onStart = () => setLoading(false);

  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(['login', 'lstMenu']);
    let idRouteParent = route.params.idRouteParent;
    if (idRouteParent && tmpListMenu) {
      let findChildren = tmpListMenu.lstPermissionItem.find(
        f => f.menuID === idRouteParent,
      );
      if (findChildren) {
        /** Check permission user can access */
        let item = null,
          tmpRoutes = [];
        for (item of findChildren.lstPermissionItem) {
          if (item.isAccess) {
            tmpRoutes.push(item);
          }
        }
        setRoutes(tmpRoutes);
      }
    }
    onStart();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      content={
        <CContent scrollEnabled={false}>
          {!loading && (
            <View
              style={[
                cStyles.row,
                cStyles.itemscenter,
                cStyles.justifyStart,
                cStyles.flexWrap,
              ]}>
              {routes.map((item, index) => {
                if (item.isAccess) {
                  return (
                    <CItem
                      key={index.toString()}
                      index={index}
                      data={item}
                      colors={colorsItem[index].colors}
                      bgColor={colorsItem[index].bgColor}
                      onPress={handleItem}
                    />
                  );
                }
                return null;
              })}
            </View>
          )}
        </CContent>
      }
    />
  );
}

export default BookingManagement;
