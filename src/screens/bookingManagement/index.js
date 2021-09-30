/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Booking Management
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingManagement.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContentSubMenu from '~/components/CContentSubMenu';
/** COMMON */
import Configs from '~/config';
import {Animations} from '~/utils/asset';
import {colors} from '~/utils/style';
/* REDUX */
import * as Actions from '~/redux/actions';

function BookingManagement(props) {
  const {navigation, route} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

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

  const onGetMasterData = () => {
    let params = {
      listType: 'BKColor, BKResource, Users',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
  };

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
  useEffect(() => {
    dispatch(Actions.resetStatusMasterData());
    onGetMasterData();
  }, []);

  useEffect(() => {
    if (loading) {
      if (!masterState.get('submitting')) {
        onPrepareData();
      }
    }
  }, [
    loading,
    masterState.get('submitting'),
    masterState.get('success'),
    masterState.get('error'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      hasShapes
      figuresShapes={[]}
      primaryColorShapes={colors.BG_HEADER_BOOKING}
      primaryColorShapesDark={colors.BG_HEADER_BOOKING_DARK}
      content={
        <CContentSubMenu
          loading={loading}
          animTypeImage={Animations.bookingHolder}
          routes={routes}
          colorsItem={Configs.colorsSubMenu.booking}
          onPressItem={handleItem}
        />
      }
    />
  );
}

export default BookingManagement;
