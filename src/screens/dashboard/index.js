/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
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

function Dashboard(props) {
  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /** HANDLE FUNC */
  const handleItem = dataRoute => {
    props.navigation.navigate(dataRoute.mName, {
      idRouteParent: dataRoute.menuID,
    });
  };

  /** FUNC */
  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(['login', 'lstMenu']);
    if (tmpListMenu && tmpListMenu.lstPermissionItem.length > 0) {
      setRoutes(tmpListMenu.lstPermissionItem);
      onStart();
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
      header
      title={'dashboard:title'}
      content={
        <CContent>
          <CList
            contentStyle={cStyles.pt16}
            data={routes}
            item={({item, index}) => {
              if (item.isAccess) {
                return <Item index={index} data={item} onPress={handleItem} />;
              }
              return null;
            }}
            numColumns={3}
            showScrollTop={false}
          />
        </CContent>
      }
    />
  );
}

export default Dashboard;
