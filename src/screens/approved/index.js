/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import CItem from '~/components/CItem';
/** COMMON */
import {cStyles} from '~/utils/style';

function Approved(props) {
  const {customColors} = useTheme();
  const {navigation, route} = props;

  const DATA_COLOR = {
    ListApprovedAssets: {
      value: 'ListApprovedAssets',
      color: customColors.green,
    },
    ListApprovedAssetsHandling: {
      value: 'ListApprovedAssetsHandling',
      color: customColors.orange,
    },
  };

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
      permission: {
        write: dataRoute.isWrite,
      },
    });
  };

  /************
   ** FUNC **
   ************/
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
        onStart();
      } else {
        onStart();
      }
    } else {
      onStart();
    }
  };

  const onStart = () => {
    setLoading(false);
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onPrepareData();
  }, []);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading}
      content={
        <CContent contentStyle={cStyles.itemsStart}>
          {!loading && (
            <CList
              contentStyle={cStyles.pt16}
              data={routes}
              item={({item, index}) => {
                if (item.isAccess) {
                  let color = DATA_COLOR[item.mName].color;
                  return (
                    <CItem
                      index={index}
                      data={item}
                      color={color}
                      onPress={handleItem}
                    />
                  );
                }
                return null;
              }}
              numColumns={3}
            />
          )}
        </CContent>
      }
    />
  );
}

export default Approved;
