/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Approved
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, {useRef, useState, useEffect} from "react";
import {useSelector} from "react-redux";
/** COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CContentSubMenu from "~/components/CContentSubMenu";
/** COMMON */
import Configs from "~/configs";
import {Animations} from "~/utils/asset";

function Approved(props) {
  const {navigation, route} = props;

  /** Use ref */
  const contentRef = useRef();

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /** Use state */
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
    let tmpListMenu = authState.getIn(["login", "lstMenu"]);
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
    onPrepareData();
  }, []);

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
          title="approved:title"
          back
          borderBottom
        />
      }>
      <CContentSubMenu
        loading={loading}
        contentRef={contentRef}
        routes={routes}
        title="approved:approved_services"
        holder="approved:approved_services_holder"
        animTypeImage={Animations.approvedHolder}
        colorsItem={Configs.colorsSubMenu.approved}
        onPressItem={handleItem}
      />
    </CContainer>
  );
}

export default Approved;
