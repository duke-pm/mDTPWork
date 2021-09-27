/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Booking Management
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingManagement.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContentSubMenu from '~/components/CContentSubMenu';
/** COMMON */
import Configs from '~/config';
import {Animations} from '~/utils/asset';
import {colors} from '~/utils/style';
/* REDUX */
import * as Actions from '~/redux/actions';
import {showMessage} from 'react-native-flash-message';

function BookingManagement(props) {
  const {t} = useTranslation();
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
      listType: 'BKIcon, BKColor, BKResource, Users',
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

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:cannot_get_master_booking'),
      type: 'danger',
      icon: 'danger',
    });
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
        if (!masterState.get('success') && masterState.get('error')) {
          onError();
        }
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
