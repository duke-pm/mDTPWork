/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import CItem from '~/components/CItem';
/** COMMON */
import Configs from '~/config';
import {cStyles} from '~/utils/style';
import {fS} from '~/utils/helper';
import Routes from '~/navigation/Routes';

function Dashboard(props) {
  const {navigation} = props;

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = dataRoute => {
    navigation.navigate(dataRoute.mName, {
      idRouteParent: dataRoute.menuID,
    });
  };

  const handleNewFeature = () => {
    navigation.navigate(Routes.MAIN.SALES_VISIT.name);
  };

  /************
   ** FUNC **
   ************/
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
      setRoutes(tmpRoutes);
      onStart();
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
      // centerStyle={cStyles.center}
      // header
      // title={'dashboard:title'}
      // headerRight={
      //   Configs.salesVisit ? (
      //     <TouchableOpacity style={cStyles.itemsEnd} onPress={handleNewFeature}>
      //       <Icon
      //         style={cStyles.p16}
      //         name={'star'}
      //         color={'white'}
      //         size={fS(20)}
      //       />
      //     </TouchableOpacity>
      //   ) : null
      // }
      content={
        <CContent>
          {!loading && (
            <CList
              contentStyle={cStyles.pt16}
              data={routes}
              item={({item, index}) => {
                if (item.isAccess) {
                  return (
                    <CItem index={index} data={item} onPress={handleItem} />
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

export default Dashboard;
