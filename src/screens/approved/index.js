/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import Item from './components/Item';
/** COMMON */
import {cStyles} from '~/utils/style';

function Approved(props) {
  const {navigation, route} = props;
  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /** HANDLE FUNC */
  const handleItem = dataRoute => {
    navigation.navigate(dataRoute.mName, {
      permission: {
        write: dataRoute.isWrite,
      },
    });
  };

  /** FUNC */
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

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

  /** RENDER */
  return (
    <CContainer
      loading={loading}
      title={'approved:assets'}
      header
      hasBack
      content={
        <CContent>
          <CList
            contentStyle={cStyles.pt16}
            data={routes}
            item={({item, index}) => {
              return <Item index={index} data={item} onPress={handleItem} />;
            }}
            numColumns={3}
            showScrollTop={false}
          />
        </CContent>
      }
    />
  );
}

export default Approved;
