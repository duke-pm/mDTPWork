/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Booking Management
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of BookingManagement.js
 **/
import React, {useRef, useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
/** COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CContentSubMenu from "~/components/CContentSubMenu";
/** COMMON */
import Configs from "~/configs";
import {Animations} from "~/utils/asset";
import {
  REDUX_LOGIN,
} from "~/configs/constants";
/* REDUX */
import * as Actions from "~/redux/actions";

function BookingManagement(props) {
  const {navigation, route} = props;

  /** Use ref */
  const contentRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState["language"];
  const refreshToken = authState[REDUX_LOGIN]["refreshToken"];

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
  const onPrepareMasterData = () => {
    let params = {
      listType: "BKColor, BKResource, Users",
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
  };

  const onPrepareData = () => {
    let tmpListMenu = authState[REDUX_LOGIN]["lstMenu"];
    if (route.params.idRouteParent && tmpListMenu) {
      let findChildren = tmpListMenu.lstPermissionItem.find(
        f => f.menuID === route.params.idRouteParent,
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
    onPrepareMasterData();
  }, []);

  useEffect(() => {
    if (loading) {
      if (!masterState["submitting"]) {
        onPrepareData();
      }
    }
  }, [
    loading,
    masterState["submitting"],
  ]);

  useEffect(() => {
    if (loading) {
      return contentRef.current.fadeInUp(500).then(endState => {
        if (endState.finished) {
          setLoading(false);
        }
      });
    }
  }, [loading, routes]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top"]}
      headerComponent={
        <CTopNavigation
          title="booking_management:title"
          back
          borderBottom
        />
      }>
      <CContentSubMenu
        loading={loading}
        contentRef={contentRef}
        animTypeImage={Animations.bookingHolder}
        routes={routes}
        title={"booking_management:booking_services"}
        holder={"booking_management:booking_services_holder"}
        colorsItem={Configs.colorsSubMenu.booking}
        onPressItem={handleItem}
      />
    </CContainer>
  );
}

export default BookingManagement;
