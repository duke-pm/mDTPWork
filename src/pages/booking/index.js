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
import CTopNavigation from '~/components/CTopNavigation';
import CContentSubMenu from '~/components/CContentSubMenu';
/** COMMON */
import Configs from '~/configs';
import {Animations} from '~/utils/asset';
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

  useEffect(() => setLoading(false), [routes]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={
        <CTopNavigation title="booking_management:title" back />
      }>
      <CContentSubMenu
        loading={loading}
        animTypeImage={Animations.bookingHolder}
        routes={routes}
        title={'booking_management:booking_services'}
        holder={'booking_management:booking_services_holder'}
        colorsItem={Configs.colorsSubMenu.booking}
        onPressItem={handleItem}
      />
    </CContainer>
  );
}

export default BookingManagement;
