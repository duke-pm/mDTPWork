/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContentSubMenu from '~/components/CContentSubMenu';
/** COMMON */
import Configs from '~/config';
import {colors} from '~/utils/style';
import {Animations} from '~/utils/asset';

function Approved(props) {
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
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_APPROVED}
      primaryColorShapesDark={colors.BG_HEADER_APPROVED_DARK}
      content={
        <CContentSubMenu
          loading={loading}
          routes={routes}
          title={'approved:approved_services'}
          holder={'approved:approved_services_holder'}
          animTypeImage={Animations.approvedHolder}
          colorsItem={Configs.colorsSubMenu.approved}
          onPressItem={handleItem}
        />
      }
    />
  );
}

export default Approved;
